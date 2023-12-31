// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MyToken is ERC20, Ownable{
    constructor() ERC20("name", "SYM") Ownable(msg.sender) {
        _mint(msg.sender, 1000 * 10 ** 18); // Mint 1,000,000 tokens to the contract creator
        
    }
}
