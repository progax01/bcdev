// SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

contract manager {
    string type1;
    string type2;
    address ownr;
    mapping(address => string) maptype;
    address[] add;
    mapping(address => bool) isRegister;

    constructor(string memory _type1, string memory _type2) {
        type1 = _type1;
        type2 = _type2;
        ownr = msg.sender;
    }

    function userRegister(string memory Type) public returns (string memory) {
        require(
            keccak256(abi.encodePacked(Type)) ==
                keccak256(abi.encodePacked(type1)) ||
                keccak256(abi.encodePacked(Type)) ==
                keccak256(abi.encodePacked(type2)),
            "Entered Type doesnot match"
        );
        require(!isRegister[msg.sender], "You have already registered");
        maptype[msg.sender] = Type;
        isRegister[msg.sender]= true;
        add.push(msg.sender);

        return ("User registered successfully");
    }

    function usertype(address _adr) public view returns (string memory) {
        return maptype[_adr];
    }


    function viewall() public view returns (address[] memory, string[] memory) {
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
