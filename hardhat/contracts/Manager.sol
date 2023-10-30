// SPDX-License-Identifier:MIT
//@audit-issue  solc-0.8.9 is not recommended for deployment
//@audit-issue no other issue found
// 0x03788b309B299544FF21Abf76E42418475B83206
pragma solidity ^0.8.7;

contract Manager {
    string type1;
    string type2;
    address ownr;
    mapping(address => string) maptype;
    address[] add;
    mapping(address => bool) isRegister;

    constructor(string memory _type1, string memory _type2) {
        //Get the allowed user type while deployment
        type1 = _type1; 
        type2 = _type2;
        ownr = msg.sender;
    }

    function userRegister(string memory userType) external returns (string memory) {
        // Checking the type for user 
        require(
            keccak256(abi.encodePacked(userType)) == keccak256(abi.encodePacked(type1)) ||
                keccak256(abi.encodePacked(userType)) == keccak256(abi.encodePacked(type2)),
            "Entered Type doesnot match"
        );
        require(!isRegister[msg.sender], "You have already registered");
        maptype[msg.sender] = userType;
        isRegister[msg.sender]= true;
        add.push(msg.sender);

        return ("User registered successfully");
    }

    //@Function to get the user type

    function usertype(address adr) external  view returns (string memory) {
        
        return maptype[adr];

    }

    //@Function to View all Users

    function viewall() external view returns (address[] memory, string[] memory) {
    uint count = add.length;
    address[] memory addr = new address[](count);
    string[] memory tp = new string[](count);

    for (uint i = 0; i < count; i++) {
        address tempadr = add[i];
        string memory typ = maptype[tempadr];
        addr[i] = tempadr;
        tp[i] = typ;
    }
    return (addr, tp);
    }

}
