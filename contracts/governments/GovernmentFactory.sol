pragma solidity ^0.6.6;

import "./Government.sol";
import "../tokens/MiniMeToken.sol";

contract GovernmentFactory {

    address private constant MIMIME_TOKEN_FACTORY = address(0xedcDFe0866464dDDFC967Aa3293E235E28Ba03C7);
    address owner;
    mapping (uint => Government) public governments;
    uint public totalGovernments;


    event DeployGovernment(address government);

    constructor() public {
        owner = msg.sender;
        totalGovernments = 0;
    }

    function newGovernment(string memory _name) public returns (address) {
        Government gov = new Government(MiniMeTokenFactory(MIMIME_TOKEN_FACTORY), _name);
        governments[totalGovernments] = gov;
        totalGovernments ++;
        emit DeployGovernment(address(gov));
        return address(gov);
    }

}