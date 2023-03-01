import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Button from "@mui/material/Button";
import axios from "axios";
import { Box, Typography } from "@mui/material";

const { ApolloClient, InMemoryCache, gql } = require("@apollo/client");

const APIURL = "https://api-mumbai.lens.dev/";

const apolloClient = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

// user can fake their wallet address, but does them no good.

const profileQuery = `
query DefaultProfile {
    defaultProfile(request: { ethereumAddress: "0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3"}) {
      id
      name
      bio
      handle
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          chainId
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
      }
    }
  }
`;

const PROFILE = {
  TWITTER: "twitter",
  LENS: "lens",
};

const profileQueryExample = async () => {
  const response = await apolloClient.query({
    query: gql(profileQuery),
  });
  const defaultProfile = response.data.defaultProfile;
  console.log(defaultProfile);
  const profile = {
    type: PROFILE.LENS,
    id: defaultProfile.id,
    handle: defaultProfile.handle,
    displayName: defaultProfile.name,
    imageUrl: defaultProfile.picture.original.url,
    bio: defaultProfile.bio,
    followers_count: defaultProfile.stats.totalFollowers,
    following_count: defaultProfile.stats.totalFollowing,
    posts_count: defaultProfile.stats.totalPosts,
  };
  return profile;
};

const loginQueryExample = async (address) => {
  const loginQuery = `query Challenge {
  challenge(request: { address: "${address}" }) {
    text
  }
}`;
  const response = await apolloClient.query({
    query: gql(loginQuery),
  });
  return response;
};

// const login = async () => {
//   const response = await apolloClient.query({
//     query: gql(profileQuery),
//   });
//   const defaultProfile = response.data.defaultProfile;
//   console.log(defaultProfile);
//   const profile = {
//     type: PROFILE.LENS,
//     id: defaultProfile.id,
//     handle: defaultProfile.handle,
//     displayName: defaultProfile.name,
//     imageUrl: defaultProfile.picture.original.url,
//     bio: defaultProfile.bio,
//     followers_count: defaultProfile.stats.totalFollowers,
//     following_count: defaultProfile.stats.totalFollowing,
//     posts_count: defaultProfile.stats.totalPosts,
//   };

//   return profile;
// };

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
    // const profile = await profileQueryExample();
    const loginInfo = await loginQueryExample(account);
    const challenge = loginInfo.data.challenge;
    console.log("loginInfo", loginInfo.data.challenge);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(challenge.text);
    console.log("message: ", signature);
    const authenticateQuery = `mutation Authenticate {
      authenticate(request: {
        address: "${account}",
        signature: "${signature}"
      }) {
        accessToken
        refreshToken
      }
    }`;
    const authenticateResponse = await apolloClient.mutate({
      mutation: gql(authenticateQuery),
    });
    console.log(
      "authenticateResponse: ",
      authenticateResponse.data?.accessToken
    );
  };

  return (
    <>
      <Box onClick={connectLens} className='wallet-btn'>
        <Typography sx={{ display: "flex", justifyContent: "center" }}>
          {" "}
          {currentAccount ? "Connected" : "Login With Lens"}
        </Typography>
      </Box>
    </>
  );
};

export default LensCard;
