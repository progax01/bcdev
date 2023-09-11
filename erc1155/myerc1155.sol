// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract Myerc1155 is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
    constructor()
        ERC1155("https://orange-absolute-barracuda-733.mypinata.cloud/ipfs/QmdiFyFmmo9kKjGE9C2xDM3pShzsCpYoioREKwDGHDawTR")
    {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount  )
        public
        onlyOwner
    {
        _mint(account, id, amount, ""  );
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts )
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, "");
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
