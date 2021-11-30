import React from "react";
import { ethers } from "ethers";
import { abi } from "../artifacts/WavePortal.json";

const contractAddress = "0x890f2291770dEAdF767E4aF4842581D2E30f93bA";
const contractABI = abi;

export const useWave = () => {
  const [waveText, setWaveText] = React.useState("");
  const [currentAccount, setCurrentAccount] = React.useState(null);
  const [totalWaves, setTotalWaves] = React.useState(null);
  const [allWaves, setAllWaves] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Ethereum instance from MetaMask wallet.
  const ethereumInstance = React.useMemo(() => {
    const { ethereum } = window;
    if (!ethereum) {
      console.error("Install MetaMask");
      return;
    }
    return ethereum;
  }, []);

  const checkIfWalletIsConnected = React.useCallback(async () => {
    try {
      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereumInstance.request({
        method: "eth_accounts"
      });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }, [ethereumInstance]);

  // Connect to MetaMask and set account.
  const getAccounts = React.useCallback(async () => {
    const accounts = await ethereumInstance.request({
      method: "eth_requestAccounts"
    });

    console.log("Connected", accounts[0]);
    setCurrentAccount(accounts[0]);
  }, [ethereumInstance]);

  // Connect to MetaMask wallet.
  const connectWallet = React.useCallback(async () => {
    try {
      const accounts = await ethereumInstance.request({
        method: "eth_requestAccounts"
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }, [ethereumInstance]);

  // Return total waves.
  const getTotalWaves = React.useCallback(async () => {
    const provider = new ethers.providers.Web3Provider(ethereumInstance);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    let count = await wavePortalContract.getTotalWaves();
    if (count) {
      console.log("Retrieved total wave count...", count.toNumber());
      setTotalWaves(count.toNumber());
    }
  }, [ethereumInstance]);

  // Returns a list with all waves.
  const getAllWaves = React.useCallback(async () => {
    const provider = new ethers.providers.Web3Provider(ethereumInstance);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    /*
     * Call the getAllWaves method from your Smart Contract
     */
    const waves = await wavePortalContract.getAllWaves();

    /*
     * We only need address, timestamp, and message in our UI so let's
     * pick those out
     */
    let wavesCleaned = [];
    waves.forEach((wave) => {
      wavesCleaned.push({
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message
      });
    });

    /*
     * Store our data in React State
     */
    setAllWaves(wavesCleaned);
  }, [ethereumInstance]);

  // Send a wave and register into blockchain.
  const sendWave = React.useCallback(async () => {
    const provider = new ethers.providers.Web3Provider(ethereumInstance);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    // Get total waves.
    getTotalWaves();

    /*
     * Execute the actual wave from your smart contract
     */
    const waveTxn = await wavePortalContract.wave(waveText, {
      gasLimit: 300000
    });
    setLoading(true);
    console.log("Mining...", waveTxn.hash);

    await waveTxn.wait();
    console.log("Mined -- ", waveTxn.hash);
    setLoading(false);
    setWaveText("");

    // update total waves.
    getTotalWaves();
    getAllWaves();
  }, [ethereumInstance, getTotalWaves, getAllWaves, waveText]);

  React.useEffect(() => {
    checkIfWalletIsConnected();
    getTotalWaves();
    getAllWaves();
  }, [checkIfWalletIsConnected, getTotalWaves, getAllWaves]);

  return {
    currentAccount,
    connectWallet,
    getAccounts,
    totalWaves,
    sendWave,
    allWaves,
    setWaveText,
    loading
  };
};
