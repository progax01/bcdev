// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Myblacktoken is ERC20, Ownable {
    mapping(address => bool) public isBlacklisted;

    constructor() ERC20("Token", "TOK") {
        _mint(msg.sender, 1000 * 10**uint256(decimals()));
    }

    modifier onlyNotBlacklisted() {
        require(
            !isBlacklisted[msg.sender],
            "You are blacklisted and cannot perform this action."
        );
        _;
    }

    // Function to allow users to buy tokens with Ether
    function buyTokens(uint256 amount) public payable  onlyNotBlacklisted returns (string memory) {
       uint tprice=10 wei;
        uint requiredprice= tprice * amount;
        require(
            !isBlacklisted[msg.sender],
            "You are blacklisted and cannot buy tokens."
        );
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value ==requiredprice, "Insufficient LESS Ether sent");
    //    if(price>msg.value){
    //        uint temp 
    //    }

        // Calculate the number of tokens to transfer based on the amount of Ether sent
       // uint256 tokensToTransfer = (amount * 10**uint256(decimals())) / 1 ether;

        // Transfer tokens to the buyer
        _transfer(owner(), msg.sender, amount);

        // Transfer Ether to th e contract owner
        payable(owner()).transfer(msg.value);
        return ("Buy 1 Token for 10 Wei");
    }

    // Function to blacklist a user
    function blacklistUser(address user) public onlyOwner {
        require(!isBlacklisted[user], "User is already blacklisted");
        isBlacklisted[user] = true;
    }

    // Function to remove a user from the blacklist
    function removeFromBlacklist(address user) public onlyOwner {
        require(isBlacklisted[user], "User is not blacklisted");
        isBlacklisted[user] = false;
    }

    function transfer(address to, uint256 amount) public onlyNotBlacklisted override returns (bool) {
        require(
            isBlacklisted[msg.sender] != true,
            "Your cannot perform transaction you r blacklisted"
        );
        _transfer(msg.sender, to, amount);
        return true;
    }
    
     function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        require(!isBlacklisted [from] && !isBlacklisted[to], "You are blacklisted");
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }
    
}
