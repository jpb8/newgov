pragma solidity ^0.6.6;

import "./IAbstractForwarder.sol";


/**
* @title Forwarder interface
* @dev This is the basic forwarder interface, that only supports forwarding an EVM script.
*      It does not support forwarding additional context or receiving ETH; other interfaces are available to support those.
*/
abstract contract IForwarder is IAbstractForwarder {
    /**
    * @dev Forward an EVM script
    */
    function forward(bytes calldata evmScript) external virtual;

    /**
    * @dev Tell the forwarder type
    * @return Always 1 (ForwarderType.NO_CONTEXT)
    */
    function forwarderType() override external pure returns (ForwarderType) {
        return ForwarderType.NO_CONTEXT;
    }
}