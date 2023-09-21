// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MyToken.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract StakingContract {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    MyToken public token;
    address public Owner;

    uint256[] time = [2, 4, 6, 8, 10];
    uint256 count = 0;

    constructor(MyToken _token) {
        token = MyToken(_token);
        Owner = msg.sender;
    }

    struct Stake {
        uint  tokenIdC;
        uint256 amount;
        uint256 duration;
        uint256 startTime;
    }

    mapping(address => Stake) public stakers;
    mapping(uint256 => address) public stakerID;
    mapping(address => mapping(uint256 => uint256)) getyouid;
    
    uint256[] totalid;

    function getBal(address adrs) public view returns (uint256) {
        return token.balanceOf(adrs);
    }

    function stake(uint256 amount, uint256 duration) public {
        require(amount > 0, "Amount must be greater than zero");

        require(
            duration == 2 ||
                duration == 4 ||
                duration == 6 ||
                duration == 8 ||
                duration == 10,
            "Enter Duration in formate check duration"
        );
        //  token.transfer(address(this), amount);
        token.transferFrom(msg.sender, address(this), amount);
        uint _tokenId = _tokenIdCounter.current();
       stakerID[_tokenId] = msg.sender;
        stakers[msg.sender].amount = amount;
        stakers[msg.sender].duration = duration;
        stakers[msg.sender].startTime = block.timestamp;
        stakers[msg.sender].tokenIdC= _tokenId;
     
        _tokenIdCounter.increment();



    }

    function ViewDetail(uint256 id) public view returns (Stake memory) {
        require(id <= count, "Enter Valid ID");
        return stakers[id];
    }

    function check_Duration() public view returns (uint256[] memory) {
        return time;
    }

    function calculateReward(uint256 Checkid)
        public
        view
        returns (uint256, uint256)
    {
        Stake storage userStake = stakers[Checkid];
        if (userStake.amount == 0) return (0, userStake.amount);

        uint256 endTime = block.timestamp;

        uint256 duration = endTime - userStake.startTime;
        if (duration > userStake.duration * 60) {
            duration = userStake.duration * 60;
        }

        // You can define your own reward mechanism here.
        // For example, a simple linear reward of 1 token per second.
        uint256 reward = duration * 1;

        return (reward, (reward + userStake.amount));
    }

    function getid(address ad) public view returns (Stake memory) {
       return stakers[address]
      
    }
    // function unstake() public {
    //     Stake storage userStake = stakers[msg.sender];
    //     require(userStake.amount > 0, "No stake to withdraw");

    //     uint256 reward = calculateReward(msg.sender);
    //     uint256 totalAmount = userStake.amount + reward;

    //     delete stakers[msg.sender];

    //     token.transfer(msg.sender, totalAmount);
    // }
}
