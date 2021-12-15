<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import NFT from "./contracts/NFT.json";
// client\src\contracts\NFT.json
=======
import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
>>>>>>> parent of 07689c7 (time to play codm)
import getWeb3 from "./getWeb3";

import "./App.css";

<<<<<<< HEAD
const App = () => {
  const [itemId, setitemId] = useState(0);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NFT.networks[networkId];
        const contract = new web3.eth.Contract(
          NFT.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    init();
  }, []);

  // useEffect(() => {
  //   const load = async () => {
  //     // Stores a given value, 5 by default.
  //     await contract.methods.set(5).send({ from: accounts[0] });

  //     // Get the value from the contract to prove it worked.
  //     const response = await contract.methods.get().call();

  //     // Update state with the result.
  //     setStorageValue(response);
  //   }
  //   if(typeof web3 !== 'undefined'
  //      && typeof accounts !== 'undefined'
  //      && typeof contract !== 'undefined') {
  //     load();
  //   }
  // }, [web3, accounts, contract]);

  if (typeof web3 === "undefined") {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  const mint = async () => {
    const tokenUri =
      "https://gateway.pinata.cloud/ipfs/QmY9p6aqQHuBck6LXX7yuycvMxqk8wXQqc3Jj5wdaokPfJ";

    //get latest nonce
    const nonce = await web3.eth.getTransactionCount(accounts[0], "latest");

    //the transaction
    const tx = {
      from: accounts[0],
      to: contract._address,
      nonce: nonce,
      gas: 500000,
      data: contract.methods.createToken(tokenUri).encodeABI(),
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
    signPromise
      .then((signedTx) => {
        web3.eth.sendSignedTransaction(
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

    setitemId(response);
  };
  console.log(accounts[0], "first account ");
  console.log(contract._address, "contract address");

  return (
    <div className="App">
      <button onClick={mint}>Mint</button>
      {itemId}
    </div>
  );
};
=======
class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}
>>>>>>> parent of 07689c7 (time to play codm)

export default App;
