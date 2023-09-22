// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MyToken.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/** 
@title A title that should describe the contract/interface
@author The name of the author
@notice Explain to an end user what this does
@dev Explain to a developer any extra details
*/

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
        address userads;
         bool isClaimed;
         bool isAmountc;
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
        Stake memory newStake = Stake(tokenIdCounter.current(), amount, duration, block.timestamp, msg.sender,false,false);
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


 function calculateReward(uint256 userid) public view returns (address,uint256, uint256, uint256)
    {
       
        uint256 endTime = block.timestamp;

        uint256 duration = endTime -  Cid[userid].startTime;
        if (duration >  Cid[userid].duration * 60) {
            duration = Cid[userid].duration * 60;
        }

        // You can define your own reward mechanism here.
        // For example, a simple linear reward of 1 token per second.
        uint256 reward = duration * 1;

        return (Cid[userid].userads, Cid[userid].tokenIdc, reward, (reward +  Cid[userid].amount));
    }


    function claimReward(uint256 userid) public {
        require(msg.sender == Cid[userid].userads, "You can only claim your own rewards");
        require(!Cid[userid].isClaimed, "Reward already claimed");

        (address userAddress, uint256 tokenId, uint256 reward, uint256 totalAmount) = calculateReward(userid);

        // Transfer the reward tokens to the user
        token.transfer(userAddress, reward);

        // Mark the stake as claimed
        Cid[userid].isClaimed = true;
    }

    function claimStakedAmount(uint256 userid) public {
        require(msg.sender == Cid[userid].userads, "You can only claim your own staked amount");
        require(!Cid[userid].isAmountc, "Reward already claimed your amount");
        require(block.timestamp >= Cid[userid].startTime + Cid[userid].duration * 1 minutes, "You can only claim after the staking duration has passed");

        (address userAddress, uint256 tokenId, uint256 reward, uint256 Amount) = calculateReward(userid);

        // Transfer the staked amount back to the user
        token.transfer(userAddress, Cid[userid].amount);

        // Mark the stake as claimed
        Cid[userid].isAmountc = true;
    }


}
                                               