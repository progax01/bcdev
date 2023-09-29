// SPDX-License-Identifier:MIT

pragma solidity ^0.8.10;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Mynft is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    mapping(address => mapping(uint256 => uint256)) TokenBuyAmount;
    mapping(uint =>address) public TokenOwner;
    mapping(uint=> bool) public isTokenDrawn;
    Counters.Counter private _tokenIdCounter;

    uint256 public mintingFee = 1000;

    constructor() ERC721("MyNFT", "NFT") {}

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://orange-absolute-barracuda-733.mypinata.cloud/ipfs/Qma34JYoFDhwy4B3nMqodPUhhXzTt2xgeQ6FRXRwhdqTee/";
    }

    function mintNFT(address adrs, uint256 amount) public {
     
        uint256 tokenId = _tokenIdCounter.current();
        string memory baseuri = _baseURI();
        string memory mytokenURI = string(abi.encodePacked(baseuri, Strings.toString(tokenId), ".json"));
        _setTokenURI(tokenId, mytokenURI);
        _mint(adrs, tokenId);

        //Maintain Record amount and Widthdraw
        TokenBuyAmount[adrs][tokenId] = amount;
        isTokenDrawn[tokenId]=false;

        //Maining Token Ownership
        TokenOwner[tokenId]=adrs;
        _tokenIdCounter.increment();
    }

    function safeMint(address ads, uint amount) public {
        //require(msg.value == mintingFee, "Insufficient ether sent");
        uint256 tokenId = _tokenIdCounter.current();
        string memory mytokenURI = string(abi.encodePacked(_baseURI(), Strings.toString(tokenId), ".json"));
        _setTokenURI(tokenId, mytokenURI);
        _safeMint(ads, tokenId);
        
        //Maintain Record amount and Widthdraw
        TokenBuyAmount[ads][tokenId] = amount;
        isTokenDrawn[tokenId]=false;
       
        _tokenIdCounter.increment();
    }


     function burn(uint256 tokenId) external {
     
        _burn(tokenId);
    }
}
