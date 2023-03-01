import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Button from "@mui/material/Button";
import axios from "axios";
import { Box, Typography } from "@mui/material";

const LensCard = ({ accessToken, setAccessError }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();

  // Connect wallet method
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Need to install MetaMask");
        alert("Please install MetaMask browser extension to interact.");
        return;
      }
      // Request account access
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      setupEventListener();
      await setUserWallet(accounts[0]);
      return accounts[0];
    } catch (error) {
      console.log(error);
    }
  };

  // Check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Please install metamask!");
      return;
    } else {
      console.log(
        await ethereum.request({
          method: "eth_accounts",
        })
      );
    }

    // Check access to user's wallet
    const accounts = await ethereum.request({ method: "eth_accounts" });

    // Use first account if multiple authorized accounts
    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
      setupEventListener();
      await setUserWallet(account);
    } else {
      console.log("No authorized account found");
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Set Event
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        setProvider(provider);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // POST Wallet Address to Backend
  const setUserWallet = async (userWallet) => {
    try {
      await axios.post(
        `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/user-wallet`,
        {
          body: userWallet,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      if (error.response.status === 403) {
        setAccessError(true);
      }
      console.log(error);
    }
  };

  //   Lens Function
  const connectLens = async () => {
    const account = await connectWallet();
    console.log(account);
  };

  return (
    <>
      <Box onClick={connectLens} className="wallet-btn">
        <Typography sx={{ display: "flex", justifyContent: "center" }}>
          {" "}
          {currentAccount ? "Connected" : "Connect Wallet"}
        </Typography>
      </Box>
    </>
  );
};

export default LensCard;
