// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Import the Delegator contract
import "./delegator.sol";

contract DelegatedWithdrawal {
    Delegator public immutable delegatorContract;

    constructor(address _delegatorAddress) {
        // Set the address of the Delegator contract
        delegatorContract = Delegator(_delegatorAddress);
    }

    // Function to deposit Ether
    function deposit() external payable {
        // Deposit logic here
    }

    // Function to initiate a withdrawal using delegated transaction
    function initiateWithdrawal(uint256 amount) external {
        // Ensure the user has enough balance to withdraw
        require(amount <= address(this).balance, "Insufficient balance");

        // Define the data for the delegated transaction
        bytes memory data = abi.encodeWithSignature("withdraw(uint256)", amount);

        // Execute the delegated transaction
        delegatorContract.executeTransaction(address(this), 0, data);
    }

    // Callback function to handle withdrawals (called by the Delegator)
    function withdraw(uint256 amount) external  {
        // Ensure that only the Delegator contract can call this function
        require(msg.sender == address(delegatorContract), "Only the Delegator can call this function");

        // Perform the withdrawal
        payable(msg.sender).transfer(amount);
    }

    // Function to check the contract's balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
