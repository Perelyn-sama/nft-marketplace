var NFT = artifacts.require("./NFT.sol");
var MarketPlace = artifacts.require("./MarketPlace.sol");

module.exports = async function (deployer) {
  await deployer.deploy(MarketPlace);
  const marketplace = await MarketPlace.deployed();

  await deployer.deploy(NFT, marketplace.address);
};
