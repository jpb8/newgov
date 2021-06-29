pragma solidity ^0.6.6;

import "../math/SafeMath.sol";
import "../math/SafeMath64.sol";
import "../tokens/MiniMeToken.sol";
import "./IForwarder.sol";
import "../common/TimeHelpers.sol";


contract Proposal is IForwarder, TimeHelpers {
    using SafeMath for uint256;
    using SafeMath64 for uint64;

    uint64 public constant PCT_BASE = 10 ** 18; // 0% = 0; 1% = 10^16; 100% = 10^18

    string private constant ERROR_NO_VOTE = "VOTING_NO_VOTE";
    string private constant ERROR_NO_BID = "VOTING_NO_BID";
    string private constant ERROR_INIT_PCTS = "VOTING_INIT_PCTS";
    string private constant ERROR_CHANGE_SUPPORT_PCTS = "VOTING_CHANGE_SUPPORT_PCTS";
    string private constant ERROR_CHANGE_QUORUM_PCTS = "VOTING_CHANGE_QUORUM_PCTS";
    string private constant ERROR_INIT_SUPPORT_TOO_BIG = "VOTING_INIT_SUPPORT_TOO_BIG";
    string private constant ERROR_CHANGE_SUPPORT_TOO_BIG = "VOTING_CHANGE_SUPP_TOO_BIG";
    string private constant ERROR_CAN_NOT_VOTE = "VOTING_CAN_NOT_VOTE";
    string private constant ERROR_CAN_NOT_FORWARD = "VOTING_CAN_NOT_FORWARD";
    string private constant ERROR_NO_VOTING_POWER = "VOTING_NO_VOTING_POWER";
    string private constant ERROR_VOTE_NOT_COMPLETE = "VOTING_VOTE_STILL_INPROG";
    string private constant ERROR_NOT_WINNING_BID = "VOTING_NOT_WINNING_BIDDER";

    struct Bid {
        string name;
        address payable beneficiary;
        bool active;
        uint cost;
        string ifpshash;
        uint256 voteCount;
    }

    struct Vote {
        bool executed;
        string ipfshash;
        string name;
        uint64 startDate;
        uint64 snapshotBlock;
        uint64 supportRequiredPct;
        uint64 minAcceptQuorumPct;
        uint256 votingPower;
        uint256 votingPowerUsed;
        uint256 bidsLength;
        uint256 winningBidId;
        mapping(uint => Bid) bids;
        mapping(address => uint) voters;
    }

    MiniMeToken public token;
    uint64 public supportRequiredPct;
    uint64 public minAcceptQuorumPct;
    uint64 public voteTime;

    // We are mimicing an array, we use a mapping instead to make app upgrade more graceful
    mapping(uint256 => Vote) internal votes;
    uint256 public votesLength;

    event StartVote(uint256 indexed voteId, address indexed creator, string ipfshash, string name);
    event CastVote(uint256 indexed voteId, address indexed voter, uint256 bidId, uint256 stake);
    event ExecuteVote(uint256 indexed voteId);
    event ChangeSupportRequired(uint64 supportRequiredPct);
    event ChangeMinQuorum(uint64 minAcceptQuorumPct);
    event AddBid(uint256 voteId, address beneficiary, string name, string ipfshash);

    modifier voteExists(uint256 _voteId) {
        require(_voteId < votesLength, ERROR_NO_VOTE);
        _;
    }

    modifier bidExists(uint256 _voteId, uint256 _bidId) {
        require(_voteId < votesLength, ERROR_NO_VOTE);
        require(_bidId < votes[_voteId].bidsLength, ERROR_NO_BID);
        _;
    }

    modifier voteComplete(uint256 _voteId) {
        require(votes[_voteId].votingPower == votes[_voteId].votingPowerUsed, ERROR_VOTE_NOT_COMPLETE);
        _;
    }

    modifier voteNotExecuted(uint256 _voteId) {
        require(votes[_voteId].executed == false, ERROR_VOTE_NOT_COMPLETE);
        _;
    }

    modifier winningBeneficiaryOnly(uint256 _voteId) {
        require(votes[_voteId].bids[votes[_voteId].winningBidId].beneficiary == msg.sender, ERROR_NOT_WINNING_BID);
        _;
    }

    /**
    * @notice Initialize Voting app with `_token.symbol(): string` for governance, minimum support of `@formatPct(_supportRequiredPct)`%, minimum acceptance quorum of `@formatPct(_minAcceptQuorumPct)`%, and a voting duration of `@transformTime(_voteTime)`
    * @param _token MiniMeToken Address that will be used as governance token
    * @param _supportRequiredPct Percentage of yeas in casted votes for a vote to succeed (expressed as a percentage of 10^18; eg. 10^16 = 1%, 10^18 = 100%)
    * @param _minAcceptQuorumPct Percentage of yeas in total possible votes for a vote to succeed (expressed as a percentage of 10^18; eg. 10^16 = 1%, 10^18 = 100%)
    * @param _voteTime Seconds that a vote will be open for token holders to vote (unless enough yeas or nays have been cast to make an early decision)
    */
    constructor(MiniMeToken _token, uint64 _supportRequiredPct, uint64 _minAcceptQuorumPct, uint64 _voteTime) public {

        require(_minAcceptQuorumPct <= _supportRequiredPct, ERROR_INIT_PCTS);
        require(_supportRequiredPct < PCT_BASE, ERROR_INIT_SUPPORT_TOO_BIG);

        token = _token;
        supportRequiredPct = _supportRequiredPct;
        minAcceptQuorumPct = _minAcceptQuorumPct;
        voteTime = _voteTime;
        votesLength = 0;
    }

    /**
    * @notice Change required support to `@formatPct(_supportRequiredPct)`%
    * @param _supportRequiredPct New required support
    */
    function changeSupportRequiredPct(uint64 _supportRequiredPct)
    external
    {
        require(minAcceptQuorumPct <= _supportRequiredPct, ERROR_CHANGE_SUPPORT_PCTS);
        require(_supportRequiredPct < PCT_BASE, ERROR_CHANGE_SUPPORT_TOO_BIG);
        supportRequiredPct = _supportRequiredPct;

        emit ChangeSupportRequired(_supportRequiredPct);
    }

    /**
    * @notice Change minimum acceptance quorum to `@formatPct(_minAcceptQuorumPct)`%
    * @param _minAcceptQuorumPct New acceptance quorum
    */
    function changeMinAcceptQuorumPct(uint64 _minAcceptQuorumPct)
    external
    {
        require(_minAcceptQuorumPct <= supportRequiredPct, ERROR_CHANGE_QUORUM_PCTS);
        minAcceptQuorumPct = _minAcceptQuorumPct;

        emit ChangeMinQuorum(_minAcceptQuorumPct);
    }

    /**
    * @notice Create a new vote about "`_metadata`"
    * @param _executionScript EVM script to be executed on approval
    * @param _metadata Vote metadata
    * @return voteId Id for newly created vote
    */
    function newVote(bytes calldata _executionScript, string calldata _ipfshash, string calldata _name) external returns (uint256 voteId) {
        return _newVote(_executionScript, _ipfshash, _name, true, true);
    }

    /**
    * @notice Create a new vote about "`_metadata`"
    * @param _executionScript EVM script to be executed on approval
    * @param _metadata Vote metadata
    * @param _castVote Whether to also cast newly created vote
    * @param _executesIfDecided Whether to also immediately execute newly created vote if decided
    * @return voteId id for newly created vote
    */
    function newVote(bytes calldata _executionScript, string calldata _ipfshash, string _name, bool _castVote, bool _executesIfDecided)
    external
    returns (uint256 voteId)
    {
        return _newVote(_executionScript, _ipfshash, _name, _castVote, _executesIfDecided);
    }

    /**
    * @dev Internal function to create a new Bid
    */
    function newBid(uint256 _voteId, string memory _ipfshash, uint256 _cost, string memory _name)
    public
    voteExists(_voteId)
    returns (uint256 bidId)
    {
        return _newBid(_voteId, _ipfshash, _cost, _name);
    }

    /**
    * @dev Initialization check is implicitly provided by `voteExists()` as new votes can only be
    *      created via `newVote(),` which requires initialization
    * @param _voteId Id for vote
    * @param _bidId The id of the Bid
    */
    function vote(uint256 _voteId, uint256 _bidId)
    external
    voteExists(_voteId)
    bidExists(_voteId, _bidId)
    {
        require(_canVote(_voteId, msg.sender), ERROR_CAN_NOT_VOTE);
        _vote(_voteId, _bidId, msg.sender);
    }

    // Forwarding fns

    /**
    * @notice Tells whether the Voting app is a forwarder or not
    * @dev IForwarder interface conformance
    * @return Always true
    */
    function isForwarder() external pure override returns (bool) {
        return true;
    }

    /**
    * @notice Creates a vote to execute the desired action, and casts a support vote if possible
    * @dev IForwarder interface conformance
    * @param _evmScript Start vote with script
    */
    function forward(bytes memory _evmScript) public override {
        require(canForward(msg.sender, _evmScript), ERROR_CAN_NOT_FORWARD);
        _newVote(_evmScript, "", "", true, true);
    }

    /**
    * @notice Tells whether `_sender` can forward actions or not
    * @dev IForwarder interface conformance
    * @param _sender Address of the account intending to forward an action
    * @return canFowardTrue True if the given address can create votes, false otherwise
    */
    function canForward(address _sender, bytes memory arr) public view override returns (bool canFowardTrue) {
        // Note that `canPerform()` implicitly does an initialization check itself
        return true;
    }

    // Getter fns

    /**
    * @notice Tells whether `_sender` can participate in the vote #`_voteId` or not
    * @dev Initialization check is implicitly provided by `voteExists()` as new votes can only be
    *      created via `newVote(),` which requires initialization
    * @return True if the given voter can participate a certain vote, false otherwise
    */
    function canVote(uint256 _voteId, address _voter) public view voteExists(_voteId) returns (bool) {
        return _canVote(_voteId, _voter);
    }

    /**
    * @dev Return all information for a vote by its ID
    * @param _voteId Vote identifier
    * @return open Vote status
    * @return executed Vote status
    * @return startDate Vote date
    * @return snapshotBlock Vote block
    * @return supportRequired Vote required
    * @return minAcceptQuorum acceptance quorum
    * @return votingPower
    */
    function getVote(uint256 _voteId)
    public
    view
    voteExists(_voteId)
    returns (
        bool open,
        bool executed,
        uint64 startDate,
        uint64 snapshotBlock,
        uint64 supportRequired,
        uint64 minAcceptQuorum,
        uint256 votingPower,
        uint256 bidsLength,
        uint256 winningBidId
    )
    {
        Vote storage vote_ = votes[_voteId];

        open = _isVoteOpen(vote_);
        executed = vote_.executed;
        startDate = vote_.startDate;
        snapshotBlock = vote_.snapshotBlock;
        supportRequired = vote_.supportRequiredPct;
        minAcceptQuorum = vote_.minAcceptQuorumPct;
        votingPower = vote_.votingPower;
        bidsLength = vote_bidsLength;
        winningBidId = winningBidId;
    }

    function getBid(uint256 _voteId, uint256 _bidId)
    public
    view
    voteExists(_voteId)
    bidExists(_voteId, _bidId)
    returns (
        string memory name,
        address beneficiary,
        bool active,
        uint cost,
        string memory ifpshash,
        uint256 voteCount
    )
    {
        Bid memory bid_ = votes[_voteId].bids[_bidId];

        name = bid_.name;
        beneficiary = bid_.beneficiary;
        active = bid_.active;
        cost = bid_.cost;
        ifpshash = bid_.ifpshash;
        voteCount = bid_.voteCount;
    }

    function calculateWinningBid(uint256 _voteId)
    public
    voteExists(_voteId)
    voteComplete(_voteId)
    voteNotExecuted(_voteId)
    {
        _calculateWinningBid(_voteId);
    }

    // Internal fns

    /**
    * @dev Internal function to create a new vote
    * @return voteId id for newly created vote
    */
    function _newVote(bytes memory _executionScript, string memory _ipfshash, string memory _name, bool _castVote, bool _executesIfDecided) internal returns (uint256 voteId) {
        uint64 snapshotBlock = getBlockNumber64() - 1;
        // avoid double voting in this very block
        uint256 votingPower = token.totalSupplyAt(snapshotBlock);
        require(votingPower > 0, ERROR_NO_VOTING_POWER);

        voteId = votesLength++;

        Vote storage vote_ = votes[voteId];
        vote_.startDate = getTimestamp64();
        vote_.ipfshash = _ipfshash;
        vote_._name = _name;
        vote_.snapshotBlock = snapshotBlock;
        vote_.supportRequiredPct = supportRequiredPct;
        vote_.minAcceptQuorumPct = minAcceptQuorumPct;
        vote_.votingPower = votingPower;

        emit StartVote(voteId, msg.sender, _ipfshash, _name);
    }

    /**
    * @dev Internal function to create a new Bid
    */
    function _newBid(uint256 voteId, string memory _ipfshash, uint256 _cost, string memory _name)
    internal
    returns(uint256 bidId)
    {
        Vote storage _vote = votes[voteId];
        bidId = _vote.bidsLength++;

        Bid storage bid_ = _vote.bids[bidId];
        bid_.name = _name;
        bid_.beneficiary = msg.sender;
        bid_.cost = _cost;
        bid_.ifpshash = _ipfshash;
        bid_.voteCount = 0;
        bid_.active = false;

        emit AddBid(voteId, msg.sender, bid_.name, _ipfshash);
    }

    /**
    * @dev Internal function to cast a vote. It assumes the queried vote exists.
    */
    function _vote(uint256 _voteId, uint256 _bidId, address _voter) internal {
        Vote storage vote_ = votes[_voteId];

        // This could re-enter, though we can assume the governance token is not malicious
        uint256 voterStake = token.balanceOfAt(_voter, vote_.snapshotBlock);
        uint256 state = vote_.voters[_voter];

        // If voter had previously voted, decrease count
        if (state != uint256(0)) {
            vote_.bids[state].voteCount = vote_.bids[state].voteCount.sub(voterStake);
        }

        vote_.bids[_bidId].voteCount = vote_.bids[_bidId].voteCount.add(voterStake);
        vote_.votingPowerUsed = vote_.votingPowerUsed.add(voterStake);

        vote_.voters[_voter] = _bidId;

        emit CastVote(_voteId, _voter, _bidId, voterStake);
    }

    function _calculateWinningBid(uint256 _voteId) internal {
        Vote storage vote_ = votes[_voteId];
        uint256 bidId_ = _topBid(vote_);
        vote_.winningBidId = bidId_;

    }

    /**
    * @dev Internal function to check if a voter can participate on a vote. It assumes the queried vote exists.
    * @return True if the given voter can participate a certain vote, false otherwise
    */
    function _canVote(uint256 _voteId, address _voter) internal view returns (bool) {
        Vote storage vote_ = votes[_voteId];
        return _isVoteOpen(vote_) && token.balanceOfAt(_voter, vote_.snapshotBlock) > 0;
    }

    /**
    * @dev Internal function to check if a vote is still open
    * @return True if the given vote is open, false otherwise
    */
    function _isVoteOpen(Vote storage vote_) internal view returns (bool) {
        return getTimestamp64() < vote_.startDate.add(voteTime) && !vote_.executed;
    }

    /**
    * @dev Internal function to find top proposal vote getter
    * @return topBid bidId of top proposal
    */
    function _topBid(Vote storage vote_) internal view returns (uint256 topBid) {
        uint256 topVoteAmount = 0;
        for (uint256 i = 0; i < vote_.bidsLength; i++) {
            if (vote_.bids[i].voteCount > topVoteAmount) {
                topBid = i;
            }
        }
        return topBid;
    }


    /**
    * @dev Calculates whether `_value` is more than a percentage `_pct` of `_total`
    */
    function _isValuePct(uint256 _value, uint256 _total, uint256 _pct) internal pure returns (bool) {
        if (_total == 0) {
            return false;
        }

        uint256 computedPct = _value.mul(PCT_BASE) / _total;
        return computedPct > _pct;
    }
}