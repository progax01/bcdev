// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Multitkon is ERC1155, ERC1155Burnable, Ownable, ERC1155Supply {
    uint256 constant gift = 9;
    uint256 constant prz = 6;
    uint256 constant prz2 = 7;

    constructor()
        ERC1155(
            "https://orange-absolute-barracuda-733.mypinata.cloud/ipfs/QmSGwZjoysG7DcmoK2yWEA4hTEKFcmck8GsyUjnuRt3pW7/"
        )
    {
        _mint(msg.sender, gift, 1, "");
        _mint(msg.sender, prz, 10, "");
        _mint(msg.sender, prz2, 20, "");

    }

    function uri(uint256 _tokenId)
        public
        pure
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "https://orange-absolute-barracuda-733.mypinata.cloud/ipfs/QmSGwZjoysG7DcmoK2yWEA4hTEKFcmck8GsyUjnuRt3pW7/",
                    Strings.toString(_tokenId),
                    ".json"
                )
            );
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount
    ) public onlyOwner {
        _mint(account, id, amount, "");
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, "");
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
