import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Button from "@mui/material/Button";
import axios from "axios";
import { Box, Typography } from "@mui/material";

const { ApolloClient, InMemoryCache, gql } = require("@apollo/client");
const PROFILE = {
  TWITTER: "twitter",
  LENS: "lens",
};
const APIURL = "https://api.lens.dev";

const apolloClient = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const profileQuery = async (address) => {
  const profileQueryGraphql = `
  query DefaultProfile {
    defaultProfile(request: { ethereumAddress: "${address}"}) {
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
  const response = await apolloClient.query({
    query: gql(profileQueryGraphql),
  });
  return response.data;
};

const loginQuery = async (address) => {
  const loginQueryGraphql = `query Challenge {
  challenge(request: { address: "${address}" }) {
    text
  }
}`;
  const response = await apolloClient.query({
    query: gql(loginQueryGraphql),
  });
  return response.data;
};

const authenticateMutation = async (address, signature) => {
  const authenticateQueryGraphql = `mutation Authenticate {
    authenticate(request: {
      address: "${address}",
      signature: "${signature}"
    }) {
      accessToken
      refreshToken
    }
  }`;
  const response = await apolloClient.mutate({
    mutation: gql(authenticateQueryGraphql),
  });
  return response.data;
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
  const [lensAccessToken, setLensAccessToken] = useState(
    localStorage.getItem("lensAccessToken")
  );
  const [lensProfile, setLensProfile] = useState();
  const [usedLensProfile, setUsedLensProfile] = useState(
    localStorage.getItem("usedLensProfile") === "true"
  );

  const setWalletAddress = async () => {
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

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    setSigner(signer);
    setProvider(provider);
  };
  useEffect(() => {
    setWalletAddress();
  }, []);

  const setupLensProfile = async (crAccount) => {
    const profileResponse = await profileQuery(crAccount);
    if (profileResponse.defaultProfile != null) {
      const defaultProfile = profileResponse.defaultProfile;
      const profile = {
        type: PROFILE.LENS,
        id: defaultProfile.id,
        handle: defaultProfile.handle,
        displayName: defaultProfile?.name,
        imageUrl: defaultProfile?.picture?.original?.url,
        bio: defaultProfile?.bio,
        followers_count: defaultProfile?.stats?.totalFollowers,
        following_count: defaultProfile?.stats?.totalFollowing,
        posts_count: defaultProfile?.stats?.totalPosts,
      };
      setLensProfile(profile);
    }
  };
  useEffect(() => {
    setupLensProfile(currentAccount);
  }, [currentAccount]);

  // Connect wallet method
  // const connectWallet = async () => {
  //   try {
  //     const { ethereum } = window;

  //     if (!ethereum) {
  //       console.log("Need to install MetaMask");
  //       alert("Please install MetaMask browser extension to interact.");
  //       return;
  //     }
  //     // Request account access
  //     const accounts = await ethereum.request({
  //       method: "eth_requestAccounts",
  //     });

  //     setCurrentAccount(accounts[0]);
  //     setupEventListener();
  //     await setUserWallet(accounts[0]);
  //     return accounts[0];
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // Check if wallet is connected
  // const checkIfWalletIsConnected = async () => {
  //   const { ethereum } = window;

  //   if (!ethereum) {
  //     console.log("Please install metamask!");
  //     return;
  //   } else {
  //     console.log(
  //       await ethereum.request({
  //         method: "eth_accounts",
  //       })
  //     );
  //   }

  //   // Check access to user's wallet
  //   const accounts = await ethereum.request({ method: "eth_accounts" });

  //   // Use first account if multiple authorized accounts
  //   if (accounts.length !== 0) {
  //     const account = accounts[0];
  //     setCurrentAccount(account);
  //     setupEventListener();
  //     await setUserWallet(account);
  //   } else {
  //     console.log("No authorized account found");
  //   }
  // };
  // useEffect(() => {
  //   checkIfWalletIsConnected();
  // }, []);

  // Set Event
  // const setupEventListener = async () => {
  //   try {
  //     const { ethereum } = window;

  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       setSigner(signer);
  //       setProvider(provider);
  //     } else {
  //       console.log("Ethereum object doesn't exist");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // POST Wallet Address to Backend
  // const setUserWallet = async (userWallet) => {
  //   try {
  //     await axios.post(
  //       `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/user-wallet`,
  //       {
  //         body: userWallet,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     if (error.response.status === 403) {
  //       setAccessError(true);
  //     }
  //     console.log(error);
  //   }
  // };

  //   Lens Function
  const connectLens = async () => {
    // const account = await connectWallet();
    const loginInfo = await loginQuery(currentAccount);
    const challenge = loginInfo.challenge;
    const signature = await signer.signMessage(challenge.text);
    const authenticateResponse = await authenticateMutation(
      currentAccount,
      signature
    );

    setLensAccessToken(authenticateResponse.authenticate.accessToken);
    localStorage.setItem(
      "lensAccessToken",
      authenticateResponse.authenticate.accessToken
    );
    // console.log("account: ", account);
  };

  const useLensProfile = async () => {
    axios
      .put(
        "https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/user/lens",
        // "http://localhost:5001/open-ask-dbbe2/us-central1/api/user/lens",
        {
          profile: lensProfile,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        setUsedLensProfile(true);
        localStorage.setItem("usedLensProfile", "true");
        localStorage.setItem("lensProfileId", lensProfile.id);
        window.location.reload(false);
      });
  };

  if (lensProfile) {
    return (
      <>
        {lensAccessToken == null ? (
          <Box onClick={connectLens} className='wallet-btn'>
            <Typography sx={{ display: "flex", justifyContent: "center" }}>
              {" "}
              {"Lens Login"}
            </Typography>
          </Box>
        ) : (
          <Box onClick={useLensProfile} className='wallet-btn'>
            <Typography sx={{ display: "flex", justifyContent: "center" }}>
              {" "}
              {usedLensProfile ? lensProfile.handle : "Use Lens Profile"}
            </Typography>
          </Box>
        )}
      </>
      // <>
      //   {lensAccessToken != null ? (
      //     <Box onClick={useLensProfile} className='wallet-btn'>
      //       <Typography sx={{ display: "flex", justifyContent: "center" }}>
      //         {" "}
      //         {lensProfile.handle ? lensProfile.handle : "Use Lens Profile"}
      //       </Typography>
      //     </Box>
      //   ) : (
      //     <Box onClick={connectLens} className='wallet-btn'>
      //       <Typography sx={{ display: "flex", justifyContent: "center" }}>
      //         {" "}
      //         {lensAccessToken ? "Use Lens Profile" : "Lens Login"}
      //       </Typography>
      //     </Box>
      //   )}
      // </>
    );
  } else {
    return <></>;
  }
};

export default LensCard;
