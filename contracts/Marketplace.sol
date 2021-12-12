// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./NFT.sol";


contract MarketPlace is ReentrancyGuard{
    // Declaring state variables 
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    // Struct that will act as a layout for Market items
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
    }

    // mapping to be able to tract market items 
    mapping(uint256 => MarketItem) private idToMarketItem;

    // Event for when items are created
    event MarketItemCreated(
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price 
    );

    // Function to create Market Items, nonReentrant is for security 
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant{
        require(price > 0, "Price must be at least 1 wei");

        // Incremet itemid everytime this function is trigger
        _itemIds.increment();

        // Get the current item ID
        uint256 itemId = _itemIds.current();

        // Initialize a new struct in the mapping, create a new market Item
        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price 
        );

        // Transfer ownership of the nft to the contract
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        // Trigger MarketItemCreated event
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId, 
            msg.sender, 
            address(this), 
            price
        ); 
    }
    // Function for when a user wants to buy a nft
    function createMarketSale(
        address nftContract,
        uint256 itemId
        ) public payable nonReentrant{

            // Getting the price of this particular nft
            uint price = idToMarketItem[itemId].price;

            // Getting the token ID of this particular nft
            uint tokenId = idToMarketItem[itemId].tokenId;

            require(msg.value == price, "Please submit the asking price in order to complete the purchase " );

            // Payment for the nft to the person who put it for sale 
            idToMarketItem[itemId].seller.transfer(msg.value);

            // Transfer of ownership of the nft to the person who bought it 
            IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

            // Assign the buyer as the new owner in the our mapping
            idToMarketItem[itemId].owner = payable(msg.sender);

            // by doing this we signify another item has been sold
            _itemsSold.increment();
        } 

        function fetchMarketItems() public view returns (MarketItem[] memory){
            uint itemCount = _itemIds.current();
            uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
            uint currentIndex = 0;

            MarketItem[] memory items = new MarketItem[](unsoldItemCount);
            for (uint i = 0; i < itemCount; i++){
                if(idToMarketItem[i + 1].owner == address(0)){
                    uint currentId = i + 1;
                    MarketItem storage currentItem = idToMarketItem[currentId];
                    items[currentIndex] = currentItem;
                    currentIndex += 1;
                }
            }

            return items;
        }

        function fetchMyNFTs() public view returns(MarketItem[] memory) {
            uint totalItemCount = _itemIds.current();
            uint itemCount = 0;
            uint currentIndex = 0;

            for (uint256 i = 0; i < totalItemCount; i++) {
                if(idToMarketItem[i + 1].owner == msg.sender){
                    itemCount += 1;
                }
            }

            MarketItem[] memory items = new MarketItem[](itemCount);
            for (uint256 i = 0; i < totalItemCount; i++) {
                if(idToMarketItem[i + 1].owner == msg.sender){
                    uint currentId = i + 1;
                    MarketItem storage currentItem = idToMarketItem[currentId];
                    currentIndex += 1;
                }
                
            }
            return items;
        }
}