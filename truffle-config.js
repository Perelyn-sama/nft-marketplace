const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const path = require("path");
// const { API_URL, PRIVATE_KEY } = process.env;

const fs = require("fs");
const secret = JSON.parse(fs.readFileSync(".secret.json").toString().trim());

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545,
    },
    kovan: {
      networkCheckTimeout: 10000,
      provider: () => {
        return new HDWalletProvider(
          secret.mnemonic,
          `https://eth-kovan.alchemyapi.io/v2/${secret.projectId}`
        );
      },
      network_id: "42",
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0",
    },
  },
};
