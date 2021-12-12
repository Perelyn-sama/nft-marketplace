var NFT = artifacts.require("./NFT.sol");
var MarketPlace = artifacts.require("./MarketPlace.sol");

module.exports = async function (deployer) {
  deployer.deploy(NFT);

  deployer.deploy(MarketPlace);
};
