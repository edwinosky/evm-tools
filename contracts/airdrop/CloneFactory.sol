// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CloneFactory
 * @dev Factory to create clones of contracts using EIP-1167.
 */
contract CloneFactory {
    /**
     * @dev Creates a clone of the implementation contract.
     * @param implementation The address of the contract to clone.
     * @return proxy The address of the newly created clone.
     */
    function createClone(address implementation) internal returns (address proxy) {
        assembly {
            let ptr := mload(0x40)
            // EIP-1167 proxy bytecode
            mstore(ptr, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(ptr, 0x14), implementation)
            mstore(add(ptr, 0x28), 0x5af43d82803e903d91602b57fd5bf300000000000000000000000000000000)
            proxy := create(0, ptr, 0x37)
        }
        require(proxy != address(0), "CloneFactory: Creation failed");
    }
}
