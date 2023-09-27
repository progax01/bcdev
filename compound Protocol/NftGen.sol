// SPDX-License-Identifier:MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 

contract MyConNft is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    mapping(address=> mapping (uint=>uint)) TokenBuyAmount ;
    mapping(uint => bool) isTokenDrawn;
    Counters.Counter private _tokenIdCounter;

    uint256 public mintingFee = 1000;

    constructor() ERC721("MyNFT", "NFT") {}
function _baseURI() internal pure override returns (string memory) {
        return "https://orange-absolute-barracuda-733.mypinata.cloud/ipfs/Qma34JYoFDhwy4B3nMqodPUhhXzTt2xgeQ6FRXRwhdqTee/";
    }
    function mintNFT() public payable {
        require(msg.value == mintingFee, "Insufficient ether sent");
          uint256 tokenId = _tokenIdCounter.current();
         string memory baseuri= _baseURI();
        string memory mytokenURI = string(abi.encodePacked(baseuri, Strings.toString(tokenId) ,".json"));
        _mint(msg.sender, tokenId);
        tokenURI(tokenId,mytokenURI);
        payable (address(this).transfer(msg.value));
        TokenBuyAmount[msg.sender][tokenId]=msg.value;
        _tokenIdCounter.increment();
    }
  function safeMint() public payable {
         require(msg.value == mintingFee, "Insufficient ether sent");
        uint256 tokenId = _tokenIdCounter.current();
        string memory mytokenURI = string.concat(_baseURI(), tokenId.toString(),".json");
        _safeMint(msg.sender, tokenId);
           tokenURI(tokenId,mytokenURI);
             payable (address(this).transfer(msg.value));
        _tokenIdCounter.increment();
        
    }
    function setMintingFee(uint256 _newFee) external onlyOwner {
        mintingFee = _newFee;
    }

    function withdrawFunds() public {
        require(isTokenDrawn[msg.sender]==false,"already withdrawn");
        payable(msg.sender).transfer(address(this).balance);
    }
}
