// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, ERC20Burnable, Ownable {

    uint public deploy_time ;
    
    uint public stack_time;
    uint[5] Time_Period= [2,4,6,8,10];
    struct user {
        address usreadrs;
        uint amount;
        uint duration_till;
        uint stacktime;
    }
     
    mapping (address => user) public Stack_detail;
    mapping (address => uint) public Stackamount;

    constructor() ERC20("Token", "MTK") {
        deploy_time = block.timestamp;
         
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
 
    function Check_Time_period() public view returns(uint[5] memory)
    {
        return Time_Period;
    }

    function Stack(uint _amount, uint _duration_till) public{
       user storage newuser = Stack_detail[msg.sender];
       newuser.usreadrs= msg.sender;
       newuser.amount= _amount;
       newuser.duration_till= _duration_till;
       newuser.stacktime= block.timestamp;
       require(_amount > 0, "Amount must be greater than 0");
       _transferFrom(msg.sender, address(this), _amount);
       address contractaddres = address(this);
       Stackamount[msg.sender]+= _amount;



    }
    
}
