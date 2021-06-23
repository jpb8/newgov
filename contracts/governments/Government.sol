pragma solidity ^0.6.6;

import "../tokens/MiniMeToken.sol";
import "../voting/Voting.sol";
import "../voting/Proposal.sol";


contract Government {

    address public boardToken;
    address public boardVoting;
    address public boardProposals;
    address shareVoting;
    address shareTokenManager;
    address reserve;
    address controller;

    event DeployToken(address token);
    event DeployVoting(address voting);
    event DeployProposals(address proposal);

    MiniMeTokenFactory internal miniMeFactory;

    mapping (uint256 => address) public boardMembers;
    uint public totalBoardMembers;

    string public name;


    constructor(
        MiniMeTokenFactory _miniMeTokenFactory,
        string memory _name
    ) public {
        name = _name;
        miniMeFactory = _miniMeTokenFactory;
    }

    function createBoard(
        string memory _boardTokenName,
        string memory _boardTokenSymbol,
        address[] memory _boardMembers
    ) public {
        MiniMeToken _boardToken = _createToken(_boardTokenName, _boardTokenSymbol, uint8(0));
        _mintTokens(_boardToken, _boardMembers, 1);
        boardToken = address(_boardToken);
        Voting _boardVoting = _createVoting(_boardToken, uint64(10**17 * 5), uint64(10**17 * 5), uint64(365 days));
        boardVoting = address(_boardVoting);
        Proposal _boardProposals = _createProposal(_boardToken, uint64(10**17 * 5), uint64(10**17 * 5), uint64(365 days));
        boardProposals = address(_boardProposals);
        for (uint256 i = 0; i < _boardMembers.length; i++) {
            boardMembers[i] = _boardMembers[i];
            totalBoardMembers ++;
        }
    }

    function _createVoting(
        MiniMeToken _token,
        uint64 _supportRequiredPct,
        uint64 _minAcceptQuorumPct,
        uint64 _voteTime
    )
    internal
    returns (Voting) {
        Voting voting = new Voting(_token, _supportRequiredPct, _minAcceptQuorumPct, _voteTime);
        emit DeployVoting(address(voting));
        return voting;
    }

    function _createProposal(
        MiniMeToken _token,
        uint64 _supportRequiredPct,
        uint64 _minAcceptQuorumPct,
        uint64 _voteTime
    )
    internal
    returns (Proposal) {
        Proposal proposal = new Proposal(_token, _supportRequiredPct, _minAcceptQuorumPct, _voteTime);
        emit DeployProposals(address(proposal));
        return proposal;
    }

    function _mintTokens(MiniMeToken _token, address[] memory _holders, uint[] memory _stakes) internal {
        for (uint256 i = 0; i < _holders.length; i++) {
            _token.generateTokens(_holders[i], _stakes[i]);
        }
    }

    function _mintTokens(MiniMeToken _token, address[] memory _holders, uint _stakes) internal {
        for (uint256 i = 0; i < _holders.length; i++) {
            _token.generateTokens(_holders[i], _stakes);
        }
    }

    function _createToken(string memory _name, string memory _symbol, uint8 _decimals) internal returns (MiniMeToken) {
        require(address(miniMeFactory) != address(0), "MminiMeFactory Token not provided");
        MiniMeToken token = miniMeFactory.createCloneToken(MiniMeToken(address(0)), 0, _name, _decimals, _symbol, true);
        emit DeployToken(address(token));
        return token;
    }

    function _mint(MiniMeToken _token, address _receiver, uint256 _amount) internal {
        _token.generateTokens(_receiver, _amount);
    }
}