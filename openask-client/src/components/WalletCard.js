import { Web3Auth } from "@web3auth/modal";
import { ADAPTER_EVENTS } from "@web3auth/base";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setAccessErrorTrue } from "./store/store";
import { openAskLogo } from "./data/VectorSVGs";
import { ethereumProvider } from "./store/store";

const web3auth = new Web3Auth({
  uiConfig: {
    appLogo: openAskLogo,
    theme: "light",
    loginMethodsOrder: ["twitter", "discord", "github"],
    defaultLanguage: "en",
  },
  clientId:
    "BPcJuzkjeKmqsPAAoLiDOabr_d16MT9Iq9roMzVt2DDNT3AZrBz5iJCfvtArcvKMl0Y74Dc63LMP7Y1VZfYogtk", // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: "cyan",
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x14A33", // hex of 56
    rpcTarget:
      "https://necessary-lingering-diamond.base-goerli.discover.quiknode.pro/362df63cac65318f820cfd24b17981318cdcf514/",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Base Goerli",
    blockExplorer: "https://goerli.basescan.org/",
    ticker: "ETH",
    tickerName: "ETH",
  },
});

const WalletCard = () => {
  const [currentAccount, setCurrentAccount] = useState();

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfoSlice);
  const { accessToken } = userInfo;

  const currentAccountString = (account) =>
    account?.slice(0, 4) + "..." + account?.slice(-4);

  // Web3Auth Initialize Modal
  const web3Init = async () => {
    await web3auth.initModal();
    console.log("Modal Initialized");
    await subscribeAuthEvents(web3auth);
  };

  // Web3Auth Connect
  const web3Connect = async () => {
    const userWallet = await web3auth.connect();

    const provider = await new ethers.providers.Web3Provider(userWallet);
    dispatch(ethereumProvider(provider));

    const signer = await provider.getSigner();

    const address = await signer.getAddress();
    setCurrentAccount(currentAccountString(address));
    postUserWallet(address);
  };

  // Web3Auth Logout
  const web3Logout = async () => {
    try {
      await web3auth.logout();
      setCurrentAccount();
      dispatch(ethereumProvider());
      console.log("Logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Web3Auth Event Listeners
  const subscribeAuthEvents = async (web3auth) => {
    web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
      console.log("connecting");
    });
    web3auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
      console.log("connected to wallet", data);
      // web3auth.provider will be available here after user is connected
    });
    web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
      console.log("disconnected");
    });
    web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
      console.log("error", error);
    });
  };

  // Check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("No wallet found.");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    // Check access to user's wallet
    const accounts = await ethereum.request({ method: "eth_accounts" });

    // Wallet Change Event Listener
    ethereum.on("accountsChanged", checkWalletChange);

    // Use first account if multiple authorized accounts
    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(currentAccountString(account));
      postUserWallet(account);
      const deployerProvider = await new ethers.providers.Web3Provider(
        window.ethereum
      );
      dispatch(ethereumProvider(deployerProvider));

      //   // localStorage.setItem("walletAddress", account);
    } else {
      console.log("No authorized account found");
      dispatch(ethereumProvider());
    }
  };

  // Ethereum Wallet Change Event Listener
  const checkWalletChange = async () => {
    const { ethereum } = window;

    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log("Event Listener Set");

    if (accounts.length === 0) {
      console.log("Wallet Disconnected");
      setCurrentAccount();
      dispatch(ethereumProvider());
    } else if (accounts.length > 0) {
      console.log("Wallet Connected");
      setCurrentAccount(currentAccountString(accounts[0]));
      postUserWallet(accounts[0]);
      dispatch(ethereumProvider(accounts[0]));
    }
  };

  // POST Wallet Address to Backend
  const postUserWallet = async (userWallet) => {
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
      console.log(`Wallet Address Posted to Backend: ${userWallet}`);
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setAccessErrorTrue());
      }
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    web3Init();
  }, []);

  return (
    <>
      <Box
        onClick={currentAccount ? web3Logout : web3Connect}
        className="wallet-btn"
      >
        <Typography sx={{ display: "flex", justifyContent: "center" }}>
          {" "}
          {currentAccount ? currentAccount : "Connect Wallet"}
        </Typography>
      </Box>
    </>
  );
};

export { WalletCard };
