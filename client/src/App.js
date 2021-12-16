import React, { useState, useEffect } from "react";
import NFT from "./contracts/NFT.json";
import getWeb3 from "./getWeb3";
import { privateKey } from "./secret";

import "./App.css";

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

  return (
    <div className="App">
      <button onClick={mint}>Mint</button>
      {itemId}
    </div>
  );
};

export default App;
