const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const path = require("path");
// const { API_URL, PRIVATE_KEY } = process.env;

// const fs = require("fs");
// const secret = JSON.parse(fs.readFileSync(".secret.json").toString().trim());

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
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
