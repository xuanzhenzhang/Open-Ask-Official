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
  const [userBalance, setUserBalance] = useState(null);

  const [currentAccount, setCurrentAccount] = useState();
  const [errorMessage, setErrorMessage] = useState();
  // const [provider, setProvider] = useState();
  const [deployer, setDeployer] = useState();
  const [signer, setSigner] = useState();
  const [lensProfile, setLensProfile] = useState();
  const [isModalConnected, setIsModalConnected] = useState(false);

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfoSlice);
  const { accessToken } = userInfo;

  const currentAccountString = (account) =>
    account?.slice(0, 4) + "..." + account?.slice(-4);

  // Web3Auth Logout
  const web3Logout = async () => {
    await web3auth.logout();
    setCurrentAccount();
    dispatch(ethereumProvider());
    console.log("Logged out");
  };

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
    console.log(provider);
    dispatch(ethereumProvider(provider));

    const signer = await provider.getSigner();

    const address = await signer.getAddress();
    console.log(address);
    setCurrentAccount(currentAccountString(address));
  };

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

  // Check Blockchain Network
  // const checkNetwork = async () => {
  //   const { ethereum } = window;

  //   let chainId = await ethereum.request({ method: "eth_chainId" });
  //   console.log("Connected to chain " + chainId);

  //   const goerliChainId = "0x1";
  //   if (chainId !== goerliChainId) {
  //     alert("You are not connected to the Ethereum Network!");
  //   }
  // };

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
      console.log(deployerProvider);
      dispatch(ethereumProvider(deployerProvider));

      //   // localStorage.setItem("walletAddress", account);
    } else {
      console.log("No authorized account found");
      dispatch(ethereumProvider());
    }
  };

  // Wallet Change Event Listener
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
