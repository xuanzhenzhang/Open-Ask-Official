import { Web3Auth } from "@web3auth/modal";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Button from "@mui/material/Button";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { LensCard } from "./LensCard";
import {
  GaslessOnboarding,
  GaslessWalletConfig,
  GaslessWalletInterface,
  LoginConfig,
} from "@gelatonetwork/gasless-onboarding";

const web3auth = new Web3Auth({
  uiConfig: {
    appLogo: "https://images.web3auth.io/web3auth-logo-w.svg",
    theme: "light",
    loginMethodsOrder: ["twitter"],
    defaultLanguage: "en",
  },
  clientId:
    "BJsOkD91JES7aVales0sTJYBsRxwlofa9YsWs_y2KIjyOgdRlk41Sgfmpt8luQE52UaKp2pD9ajDNy7yjaaYQvc", // Get your Client ID from Web3Auth Dashboard
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x84531", // Please use 0x5 for Goerli Testnet
  },
});

const WalletCard = ({ accessToken, setAccessError }) => {
  const [userBalance, setUserBalance] = useState(null);

  const [currentAccount, setCurrentAccount] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [lensProfile, setLensProfile] = useState();

  const currentAccountString = (account) =>
    account?.slice(0, 4) + "..." + account?.slice(-4);

  // const web3Logout = async () => {
  //   await web3auth.logout();
  // };

  // const web3Connect = async () => {
  //   const userWallet = await web3auth.connect();
  //   console.log(userWallet);

  //   const web3Provider = new ethers.providers.Web3Provider(web3auth.provider);
  //   console.log(web3Provider);
  // };

  // Connect wallet method
  // const connectWallet = async () => {
  //   try {
  //     const { ethereum } = window;

  //     if (!ethereum) {
  //       console.log("Need to install MetaMask");
  //       setErrorMessage(
  //         "Please install MetaMask browser extension to interact."
  //       );
  //       return;
  //     }
  //     // Request account access
  //     const accounts = await ethereum.request({
  //       method: "eth_requestAccounts",
  //     });
  //     console.log("Connected", accounts[0]);
  //     checkNetwork();
  //     setCurrentAccount(currentAccountString(accounts[0]));
  //     // const profileResponse = await profileQuery(
  //     //   currentAccountString(accounts[0])
  //     // );
  //     // console.log("profileResponse:1!! ", profileResponse);
  //     // setLensProfile(profileResponse.defaultProfile);
  //     setupEventListener();
  //     setUserWallet(accounts[0]);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // Check Blockchain Network
  const checkNetwork = async () => {
    const { ethereum } = window;

    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);

    const goerliChainId = "0x1";
    if (chainId !== goerliChainId) {
      alert("You are not connected to the Ethereum Network!");
    }
  };

  // Check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Please install metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    // Check access to user's wallet
    const accounts = await ethereum.request({ method: "eth_accounts" });

    // Use first account if multiple authorized accounts
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(currentAccountString(account));
      setupEventListener();
      setUserWallet(account);
      localStorage.setItem("walletAddress", account);
    } else {
      console.log("No authorized account found");
    }
  };

  // Disconnect Wallet
  const handleDisconnect = async () => {
    const { ethereum } = window;

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length === 0) {
      console.log("Wallet Disconnected");
      setCurrentAccount();
    } else if (accounts.length > 0) {
      setCurrentAccount(currentAccountString(accounts[0]));
    }
  };

  // Set Event
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        // const signer = provider.getSigner();
        setProvider(provider);

        ethereum.on("accountsChanged", handleDisconnect);

        console.log("Successfully setup event listener.");
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
      console.log(`Wallet Address Set: ${userWallet}`);
    } catch (error) {
      if (error.response.status === 403) {
        setAccessError(true);
      }
      console.log(error);
    }
  };

  // Get wallet balance
  useEffect(() => {
    if (currentAccount) {
      provider?.getBalance(currentAccount).then((balanceResult) => {
        setUserBalance(ethers.utils.formatEther(balanceResult));
      });
    }
  }, [provider]);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const init = async () => {
    const gaslessWalletConfig = {
      apiKey: "Q7E6fPdBQmEA9ArUXXKP_wE_m_v_Y20WkCeU5WLsmxU_",
    };

    const loginConfig = {
      domains: [window.location.origin],
      chain: {
        id: 84531,
        rpcUrl: "https://goerli.base.org",
      },
      openLogin: {
        redirectUrl: `${window.location.origin}`,
      },
    };

    const gelatoLogin = new GaslessOnboarding(loginConfig, gaslessWalletConfig);

    await gelatoLogin.init();

    await gelatoLogin.login();

    const gelato = gelatoLogin.getProvider();

    const provider = new ethers.providers.Web3Provider(gelato);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    localStorage.setItem("walletAddress", addr);
    window.location.reload();
  };

  return (
    <>
      <Box onClick={init} className="wallet-btn">
        <Typography sx={{ display: "flex", justifyContent: "center" }}>
          {" "}
          {currentAccount ? currentAccount : "Connect Wallet"}
        </Typography>
      </Box>
      {/* {lensProfile && (
        <LensCard
          accessToken={accessToken}
          setAccessError={setAccessError}
          defaultProfile={lensProfile}
        />
      )} */}
    </>
  );
};

export { WalletCard };
