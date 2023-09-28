// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./CTokenInterface.sol"; // You'll need to import the Compound cToken interface

contract CompoundSupply {
    using SafeERC20 for IERC20;

    address public owner;
    IERC20 public daiToken;
    CErc20Interface public cDaiToken; // Replace with the appropriate cToken for your asset

    constructor(address _daiTokenAddress, address _cDaiTokenAddress) {
        owner = msg.sender;
        daiToken = IERC20(_daiTokenAddress);
        cDaiToken = CErc20Interface(_cDaiTokenAddress);
    }

    // Deposit DAI into the Compound protocol
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
      require(daiToken.allowance(msg.sender, address(this)) >= amount, "Allowance not set");
        daiToken.safeTransferFrom(msg.sender, address(this), amount);
        uint256 mintResult = cDaiToken.mint(amount);
        require(mintResult == 0, "cDAI minting failed");
    }

    // Withdraw DAI from the Compound protocol
    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(cDaiToken.balanceOf(address(this)) >= amount, "Insufficient cDAI balance");
        uint256 redeemResult = cDaiToken.redeem(amount);
        require(redeemResult == 0, "cDAI redeeming failed");
        daiToken.safeTransfer(msg.sender, amount);
    }

    // Check the cDAI balance of this contract
    function cDaiBalance() external view returns (uint256) {
        return cDaiToken.balanceOf(address(this));
    }

    // Allow the owner to withdraw any excess tokens (if any)
    function withdrawExcessTokens(address tokenAddress) external {
        require(msg.sender == owner, "Only the owner can call this function");
        require(tokenAddress != address(cDaiToken), "Cannot withdraw cDAI");
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        token.safeTransfer(owner, balance);
    }
}
