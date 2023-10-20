// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


 
  
contract Vesting is Ownable {
    IERC20 public token;
    address public receiver;
    uint256 public amount;
    uint256 public expiry;
    bool public locked = false;
    bool public claimed = false;

    event TokensLocked(address indexed receiver, uint256 amount, uint256 expiry);

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    function locktoken(address _receiver, uint256 _amount, uint256 _expiry) external onlyOwner {
    require(!locked, "Funds are already locked");
    require(token.balanceOf(address(this)) >= _amount, "Insufficient balance in the contract");
    require(_receiver != address(0), "Invalid receiver address"); // Check for a zero address

    // Update state variables first
    receiver = _receiver;
    amount = _amount;
    expiry = block.timestamp + _expiry;
    locked = true;

    // Perform the external call after updating state variables
    require(token.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");

    // Emit the event
    emit TokensLocked(_receiver, _amount, expiry);
}

    function withdraw() external {
        require(locked, "Funds are not locked");
        require(block.timestamp > expiry, "Tokens are not yet unlocked");
        require(!claimed, "Tokens have already been claimed");

        // Update state variables first
        claimed = true;

        // Perform the external call after updating state variables
        require(token.transfer(receiver, amount), "Token transfer failed");
    }

    function getTime() external view returns (uint256) {
        return block.timestamp;
    }
}