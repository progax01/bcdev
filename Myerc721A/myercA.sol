// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "https://github.com/chiru-labs/ERC721A/blob/main/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Myerca is ERC721A, Ownable {

    constructor() ERC721A("Myerca", "MEA") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://orange-absolute-barracuda-733.mypinata.cloud/ipfs/QmWtXaFZNaxcahfVzhviwiwAjYYgCKwcvwBG8RFpfvgbG9/";
    }

    function Mint(uint amount) public onlyOwner 
    {
        _safeMint(msg.sender,amount);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) _revert(URIQueryForNonexistentToken.selector);

        string memory baseURI = _baseURI();
        return bytes(baseURI).length != 0 ? string(abi.encodePacked(_baseURI(),"myjsn", _toString(tokenId),".json")) : '';
    }
}


