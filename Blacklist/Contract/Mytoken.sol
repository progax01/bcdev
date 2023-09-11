// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./ERC20.sol";
import "./Ownable.sol";

contract Mytoken is ERC20, Ownable {
uint256 public tokensPerEth = 10;
    event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);
Mytoken mytoken;
    constructor()ERC20("Mytoken","MYT") Ownable(msg.sender) {

        _mint(msg.sender,5000* (10**18));
    }

     // Function to mint new tokens
    function mint(address account, uint256 amount) public onlyOwner {
        require(account != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");
        _mint(account, amount);
    }

    // Function to burn token
    function burn(address useradd, uint256 amount) public {
        _burn(useradd, amount);
    }
    
      function buyToken(uint noOfToken) public payable {

       require(!isBlacklisted(msg.sender), "You are blacklisted");
         
        uint256 requiredAmount = noOfToken * tokenPrice;
        require(msg.value == requiredAmount, "Amount is less");

        _transfer(admin, msg.sender, noOfToken);
    }
}