// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AdminAccount {
    address public admin;
    
    constructor() {
        admin = msg.sender;
    }
    
    function createUserAccount(address user) external payable {
        // Deduct gas fees from admin account
        uint256 gasFees = gasleft() * tx.gasprice;
        require(admin.balance >= gasFees, "Insufficient balance");
        admin.transfer(gasFees);
        
        // Delegate call to UserAccount contract
        (bool success, ) = user.delegatecall(abi.encodeWithSignature("createAccount()"));
        require(success, "User account creation failed");
    }
}

contract UserAccount {
    mapping(address => uint256) public balances;
    
    function createAccount() external {
        // Implement user account creation logic here
        balances[msg.sender] = 0;
    }
}
