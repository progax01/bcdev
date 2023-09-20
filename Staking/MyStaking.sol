// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyToken.sol";

contract StakingContract is MyToken{
    uint[]  time=[2,4,6,8,10];
       uint count=0;


    struct Stake {
        uint256 amount;
        uint duration;
        uint256 startTime;
    }

    mapping(uint => Stake) public stakers;
    mapping(uint => address) public stakerID;
   

    function stake(uint256 amount,uint duration) public {
        require(amount > 0, "Amount must be greater than zero");
        require(duration==2 || duration ==4 || duration==6 ||duration==8 || duration==10 , "Enter Duration in formate check duration");
        transfer(address(this), amount);
   
        stakerID[count]=msg.sender;
        stakers[count].amount = amount;
        stakers[count].duration= duration;
       stakers[count].startTime = block.timestamp;

        count+=1;
  
    }
    
    function ViewDetail(uint id)public  view  returns(Stake memory){
        require(id<=count, "Enter Valid ID");
        return stakers[id];
    }
    function check_Duration() public view returns (uint[] memory){
        return time;

    }
    function calculateReward(uint Checkid) public view returns (uint256, uint) {
        Stake storage userStake = stakers[Checkid];
        if (userStake.amount == 0) return (0,userStake.amount);
        
        uint256 endTime = block.timestamp;

        uint256 duration = endTime - userStake.startTime;
        if(duration >userStake.duration*60)
        {
            duration=userStake.duration*60;
        }
        
        
        // You can define your own reward mechanism here.
        // For example, a simple linear reward of 1 token per second.
        uint256 reward = duration * 1; 
        
        return (reward,(reward+userStake.amount));
    }
    // function unstake() public {
    //     Stake storage userStake = stakers[msg.sender];
    //     require(userStake.amount > 0, "No stake to withdraw");
        
    //     uint256 reward = calculateReward(msg.sender);
    //     uint256 totalAmount = userStake.amount + reward;
        
    //     delete stakers[msg.sender];
        
    //     transfer(msg.sender, totalAmount);
    // }
}
