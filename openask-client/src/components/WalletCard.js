import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Button from "@mui/material/Button";
import axios from "axios";

const WalletCard = ({ accessToken, setAccessError }) => {
  const [userBalance, setUserBalance] = useState(null);

  const [currentAccount, setCurrentAccount] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();

  const currentAccountString = "..." + currentAccount?.slice(-4);

  // Connect wallet method
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Need to install MetaMask");
        setErrorMessage(
          "Please install MetaMask browser extension to interact."
        );
        return;
      }
      // Request account access
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      checkNetwork();
      setCurrentAccount(accounts[0]);
      setupEventListener();
      setUserWallet(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

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
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      setupEventListener();
      setUserWallet(account);
    } else {
      console.log("No authorized account found");
    }
  };

  // Disconnect Wallet
  // const disconnectWallet = () => {
  //   if (window.ethereum) {
  //     window.ethereum.enable().then((accounts) => {
  //       window.ethereum.send({ method: "wallet_disconnect", params: [] }, (err, result) => {
  //         if (err) {
  //           console.error(err);
  //         } else {
  //           console.log(result);
  //         }
  //       });
  //     });
  //   } else {
  //     console.log("MetaMask not detected");
  //   }
  // };

  // Set Event
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        setProvider(provider);

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

  return (
    <>
      <div className="walletCard">
        <Button
          variant="contained"
          size="small"
          color={currentAccount ? "success" : "primary"}
          onClick={connectWallet}
          // disabled={connected}
        >
          {currentAccount ? currentAccountString : "Connect Wallet"}
        </Button>
        {/* {errorMessage} */}
        {/* <Button onClick={() => console.log("Click")}>D</Button> */}
      </div>
    </>
  );
};

export { WalletCard };
