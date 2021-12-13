// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT  is ERC721URIStorage {
 using Counters for Counters.Counter;
 Counters.Counter private _tokenIds;
 address public contractAddress;

 constructor(address marketplaceAddress) ERC721("Perelyn's Digital Marketplace", "PDM"){
     contractAddress = marketplaceAddress;
 }

    function createToken(string memory tokenURI) public returns (uint){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);

        return newItemId;
    }

}