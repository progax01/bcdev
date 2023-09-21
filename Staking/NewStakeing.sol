// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MyToken.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyStakingContract {
    using Counters for Counters.Counter;

    Counters.Counter private tokenIdCounter;
    MyToken public token;
    address public Owner;
    uint256[] time = [2, 4, 6, 8, 10];

    constructor(MyToken _token) {
        token = MyToken(_token);
        Owner = msg.sender;
    }

    struct Stake {
        uint256  tokenIdc;
        uint256 amount;
        uint256 duration;
        uint256 startTime;
    }
  
    mapping(address => Stake[]) public userStakes; 
    mapping(uint => Stake) public Cid;
      
     function getBal(address adrs) public view returns (uint256) {
        return token.balanceOf(adrs);
    }

    function stakenow(uint amount, uint duration ) public returns (Stake memory ){
        
        require(amount > 0, "Amount must be greater than zero");

        require( duration == 2 || duration == 4 || duration == 6 || duration == 8 || duration == 10,
            "Enter Duration in formate check duration" );

        tokenIdCounter.current();
        Stake memory newStake = Stake(tokenIdCounter.current(), amount, duration, block.timestamp);
        userStakes[msg.sender].push(newStake);
        token.transferFrom(msg.sender, address(this), amount);
        Cid[tokenIdCounter.current()]=newStake;
        tokenIdCounter.increment();
        return newStake;

    } 
    
    function check_Duration() public view returns (uint256[] memory) {
        return time;
    }

    function chkid(uint id) public view returns(Stake memory){
      return Cid[id];
        

    }

  function ViewDetail(address ads) public view returns (Stake[] memory) {
    return userStakes[ads];
    }


 function calculateReward(uint256 userid) public view returns (uint256, uint256)
    {
        

       Cid[userid];
        

        uint256 endTime = block.timestamp;

        uint256 duration = endTime -  Cid[userid].startTime;
        if (duration >  Cid[userid].duration * 60) {
            duration = Cid[userid].duration * 60;
        }

        // You can define your own reward mechanism here.
        // For example, a simple linear reward of 1 token per second.
        uint256 reward = duration * 1;

        return (reward, (reward +  Cid[userid].amount));
    }


    


}
                                               