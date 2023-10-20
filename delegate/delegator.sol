// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Delegator {
    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function executeTransaction(address to, uint256 value, bytes memory data) external onlyOwner {
        require(to != address(0), "Invalid target address"); // Address validation
        // Use a low-level call to forward the transaction
        (bool success, ) = to.call{value: value}(data);
        require(success, "Transaction execution failed");
    }
}
