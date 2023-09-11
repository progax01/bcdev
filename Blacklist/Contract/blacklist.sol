// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./Mytoken.sol";
import "./Ownable.sol";

contract blacklist {
 mapping(address=>bool) isBlacklisted;

    function blackList(address _user) public onlyOwner {
        require(!isBlacklisted[_user], "user already blacklisted");
        isBlacklisted[_user] = true;
        // emit events as well
    }
    
    function removeFromBlacklist(address _user) public onlyOwner {
        require(isBlacklisted[_user], "user already whitelisted");
        isBlacklisted[_user] = false;
        // emit events as well
    }
    
    function transfer(address _to, uint256 _value) public {
        require(!isBlacklisted[_to], "Recipient is backlisted");
        // remaining transfer logic
    }
 
 
   
}