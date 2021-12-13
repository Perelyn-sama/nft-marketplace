import React, { Component } from "react";
import NFT from "./contracts/NFT.json";
import getWeb3 from "./getWeb3";
import { privateKey } from "./secret";

// NFT 0x7c67Eb35Af700F0ED6f9Cbd2585a5B37f2675B2B
// Marketplace 0x7c5294C50c4C8376fAFdE30cc98f521931C56844
import "./App.css";

class App extends Component {
  state = { itemId: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = NFT.networks[networkId];
      const instance = new web3.eth.Contract(
        NFT.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  mint = async () => {
    const { accounts, contract } = this.state;

    const tokenUri =
      "https://gateway.pinata.cloud/ipfs/QmcYswyCuNqDA41henoG5vESVseEcyUTV9wWTPPr3dsS6V";

    console.log(contract._address);
    console.log(accounts);

    const nonce = await this.state.web3.eth.getTransactionCount(
      accounts[0],
      "latest"
    ); //get latest nonce

    //the transaction
    const tx = {
      from: accounts[0],
      to: contract._address,
      nonce: nonce,
      gas: 500000,
      data: contract.methods.createToken(tokenUri).encodeABI(),
    };

    const signPromise = this.state.web3.eth.accounts.signTransaction(
      tx,
      privateKey
    );
    signPromise
      .then((signedTx) => {
        this.state.web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
          function (err, hash) {
            if (!err) {
              console.log(
                "The hash of your transaction is: ",
                hash,
                "\nCheck Alchemy's Mempool to view the status of your transaction!"
              );
            } else {
              console.log(
                "Something went wrong when submitting your transaction:",
                err
              );
            }
          }
        );
      })
      .catch((err) => {
        console.log(" Promise failed:", err);
      });

    const response = await contract.methods
      .createToken(
        "https://gateway.pinata.cloud/ipfs/QmY9p6aqQHuBck6LXX7yuycvMxqk8wXQqc3Jj5wdaokPfJ"
      )
      .call();

    this.setState({ itemId: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <button onClick={this.mint}>Mint</button>
        {this.state.itemId}
      </div>
    );
  }
}

export default App;
