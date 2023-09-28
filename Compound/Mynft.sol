// SPDX-License-Identifier:MIT

pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 


contract Mynft is ERC721, ERC721Burnable,ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    mapping(address=> mapping (uint=>uint)) TokenBuyAmount ;
    mapping(uint => bool) isTokenDrawn;
    Counters.Counter private _tokenIdCounter;

    uint256 public mintingFee = 1000;

    constructor() ERC721("MyNFT", "NFT") {}
function _baseURI() internal pure override returns (string memory) {
        return "https://orange-absolute-barracuda-733.mypinata.cloud/ipfs/Qma34JYoFDhwy4B3nMqodPUhhXzTt2xgeQ6FRXRwhdqTee/";
    }

    function mintNFT() public  {
    //require(msg.value == mintingFee, "Insufficient ether sent");
    uint256 tokenId = _tokenIdCounter.current();
    string memory baseuri = _baseURI();
    string memory mytokenURI = string(abi.encodePacked(baseuri, Strings.toString(tokenId), ".json"));
    _mint(msg.sender, tokenId);
   _setTokenUri(tokenId, mytokenURI);
    tokenURI(tokenId);
    address payable contractAddress = payable(address(this)); // Convert address(this) to address payable
    contractAddress.transfer(msg.value); // Use the transfer function on the new variable
    TokenBuyAmount[msg.sender][tokenId] = msg.value;
    _tokenIdCounter.increment();
}

function safeMint(address ads) public  {
    //require(msg.value == mintingFee, "Insufficient ether sent");
    uint256 tokenId = _tokenIdCounter.current();
    string memory mytokenURI = string(abi.encodePacked(_baseURI(), Strings.toString(tokenId), ".json"));
     //_setTokenURI(tokenId, mytokenURI);
    _safeMint(ads, tokenId);
    tokenURI(tokenId);
    address payable contractAddress = payable(address(this)); // Convert address(this) to address payable
    contractAddress.transfer(msg.value); // Use the transfer function on the new variable
    _tokenIdCounter.increment();
}
    function setMintingFee(uint256 _newFee) external onlyOwner {
        mintingFee = _newFee;
    }

    // function withdrawFunds(uint _tokenID) public {
    //     require(isTokenDrawn[_tokenID]==false,"already withdrawn");
    //     payable(msg.sender).transfer(address(this).balance);
    // }


}
