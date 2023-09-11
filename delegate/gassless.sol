// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasFeeReimbursement {
    address public admin;
    
    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }
    
    function deployContract(bytes memory _code) external onlyAdmin returns (address) {
        address newContract;
        assembly {
            newContract := create(0, add(_code, 0x20), mload(_code))
        }
        require(newContract != address(0), "Contract deployment failed");
        return newContract;
    }
    
    function reimburseGasFees(address user, uint256 gasUsed) external onlyAdmin {
        // Calculate the gas cost based on the gas price at the time of deployment
        uint256 gasCost = gasUsed * tx.gasprice;
        
        // Transfer the gas cost from the admin to the user
        payable(user).transfer(gasCost);
    }
}
