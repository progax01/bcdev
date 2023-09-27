// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyConNft is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public mintingFee = 1000;
    string private baseTokenURI;

    mapping(address => mapping(uint => uint)) public tokenBuyAmount;
    mapping(uint => bool) public isTokenDrawn;

    constructor(string memory _baseTokenURI) ERC721("MyNFT", "NFT") {
        baseTokenURI = _baseTokenURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function mintNFT() public payable {
        require(msg.value >= mintingFee, "Insufficient ether sent");
        uint256 tokenId = _tokenIdCounter.current();

        _mint(msg.sender, tokenId);

        // Update token buy amount and mark token as drawn
        tokenBuyAmount[msg.sender][tokenId] = msg.value;
        isTokenDrawn[tokenId] = false;

        _tokenIdCounter.increment();
    }

    function safeMint() public payable {
        require(msg.value >= mintingFee, "Insufficient ether sent");
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(msg.sender, tokenId);

        // Update token buy amount and mark token as drawn
        tokenBuyAmount[msg.sender][tokenId] = msg.value;
        isTokenDrawn[tokenId] = false;

        _tokenIdCounter.increment();
    }

    function setMintingFee(uint256 _newFee) external onlyOwner {
        mintingFee = _newFee;
    }

    function setBaseTokenURI(string memory _newBaseTokenURI) external onlyOwner {
        baseTokenURI = _newBaseTokenURI;
    }

    function withdrawFunds() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function drawToken(uint256 tokenId) public onlyOwner {
        require(!isTokenDrawn[tokenId], "Token already drawn");
        isTokenDrawn[tokenId] = true;
    }
}
