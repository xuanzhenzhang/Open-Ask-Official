import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { GaslessOnboarding } from "@gelatonetwork/gasless-onboarding";

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

  let normalSigner;

  // const setupWalletListener = () => {
  //   window.addEventListener("storage", function (event) {
  //     console.log("!!!!!");
  //     if (event.key === "walletAddress") {
  //       setCurrentAccount(localStorage.getItem("walletAddress"));
  //     }
  //   });
  // };
  // useEffect(() => {
  //   setupWalletListener();
  // }, []);

  // const setWalletAddress = async () => {
  //   const { ethereum } = window;

  //   if (!ethereum) {
  //     console.log("Need to install MetaMask");
  //     alert("Please install MetaMask browser extension to interact.");
  //     return;
  //   }
  //   // Request account access
  //   const accounts = await ethereum.request({
  //     method: "eth_requestAccounts",
  //   });

  //   setCurrentAccount(accounts[0]);

  //   const provider = new ethers.providers.Web3Provider(ethereum);
  //   const signer = provider.getSigner();
  //   setSigner(signer);
  //   // setProvider(provider);
  // };

  const init = async () => {
    console.log("???????");
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
    console.log("gelatoLogin!!!: ", gelatoLogin);

    await gelatoLogin.init();

    console.log("gelatoLoginafter init: ", gelatoLogin);

    const providerGelato = gelatoLogin.getProvider();
    console.log("providerGelato: ", providerGelato);

    // const deployerProvider = new ethers.providers.Web3Provider(window.ethereum);
    // normalSigner = deployerProvider.getSigner();

    // const provider = new ethers.providers.Web3Provider(providerGelato);
    // const gelatoSigner = provider.getSigner();
    // const sender = await gelatoSigner.getAddress();

    // console.log(sender);

    setSigner(normalSigner);
  };

  useEffect(() => {
    init();
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
    setCurrentAccount("0xD3C6E4583BCc33339D733cb35034362D134A6749");
  }, []);
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
    console.log("here?");
    const loginInfo = await loginQuery(currentAccount);
    console.log("currentAccount!!!!!!!: ", currentAccount);
    const challenge = loginInfo.challenge;
    console.log("challenge: ", challenge);
    const deployerProvider = new ethers.providers.Web3Provider(window.ethereum);
    normalSigner = deployerProvider.getSigner();
    const signature = await normalSigner.signMessage(challenge.text);
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
        localStorage.setItem("profileHandle", lensProfile.handle);
        localStorage.setItem("usedLensProfile", "true");
        localStorage.setItem("lensProfileId", lensProfile.id);
        // window.location.reload(false);
      });
  };

  if (lensProfile) {
    return (
      <>
        {lensAccessToken == null ? (
          <Box onClick={connectLens} className="wallet-btn">
            <Typography sx={{ display: "flex", justifyContent: "center" }}>
              {" "}
              {"Lens Login"}
            </Typography>
          </Box>
        ) : (
          <Box onClick={useLensProfile} className="wallet-btn">
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
