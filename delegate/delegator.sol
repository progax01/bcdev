// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Delegator {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function executeTransaction(address to, uint256 value, bytes memory data) external onlyOwner {
        // Use a low-level call to forward the transaction
        (bool success, ) = to.call{value: value}(data);
        require(success, "Transaction execution failed");
    }
}
