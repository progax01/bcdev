// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Mynft is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Mynft", "NFT") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://orange-absolute-barracuda-733.mypinata.cloud/ipfs/Qma34JYoFDhwy4B3nMqodPUhhXzTt2xgeQ6FRXRwhdqTee/";
    }

    function safeMint(address to,  uint256 tokenId) public onlyOwner {
        //uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
      
           string memory mtokenURI = string(abi.encodePacked( Strings.toString(tokenId), ".json"));
        
        _safeMint(to, tokenId);
        super._setTokenURI(tokenId, mtokenURI);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
