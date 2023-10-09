// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EtherSender {
    // Function to send Ether to a recipient
    function sendEther(address payable recipient) external payable {
        require(recipient != address(0), "Invalid recipient address");
        require(msg.value > 0, "Amount must be greater than zero");

        // Transfer Ether to the recipient
        recipient.transfer(msg.value);
    }
}
