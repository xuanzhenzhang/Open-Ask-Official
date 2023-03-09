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

const LensCard = ({ accessToken, setAccessError }) => {
  const [currentAccount, setCurrentAccount] = useState(
    localStorage.getItem("walletAddress")
  );
  const [provider, setProvider] = useState();
  const [lensAccessToken, setLensAccessToken] = useState(
    localStorage.getItem("lensAccessToken")
  );
  const [lensProfile, setLensProfile] = useState();
  const [usedLensProfile, setUsedLensProfile] = useState(
    localStorage.getItem("usedLensProfile") === "true"
  );

  useEffect(() => {
    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, []);

  const handleStorageUpdate = (event) => {
    if (event.storageArea === localStorage && event.key === "walletAddress") {
      setCurrentAccount(event.newValue);
    }
  };

  // const init = async () => {
  //   const gaslessWalletConfig = {
  //     apiKey: "Q7E6fPdBQmEA9ArUXXKP_wE_m_v_Y20WkCeU5WLsmxU_",
  //   };

  //   const loginConfig = {
  //     domains: [window.location.origin],
  //     chain: {
  //       id: 84531,
  //       rpcUrl: "https://goerli.base.org",
  //     },
  //     openLogin: {
  //       redirectUrl: `${window.location.origin}`,
  //     },
  //   };

  //   const gelatoLogin = new GaslessOnboarding(loginConfig, gaslessWalletConfig);
  //   console.log("gelatoLogin!!!: ", gelatoLogin);

  //   await gelatoLogin.init();

  //   console.log("gelatoLoginafter init: ", gelatoLogin);

  //   // const providerGelato = gelatoLogin.getProvider();
  //   // const provider = new ethers.providers.Web3Provider(providerGelato);
  //   // const gelatoSigner = provider.getSigner();
  //   // const sender = await gelatoSigner.getAddress();
  // };

  // useEffect(() => {
  //   init();
  // }, []);

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

  //   Lens Function
  const connectLens = async () => {
    const loginInfo = await loginQuery(currentAccount);
    const challenge = loginInfo.challenge;
    const deployerProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = deployerProvider.getSigner();
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
  };

  const useLensProfile = async () => {
    axios
      .put(
        "https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/user/lens",
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
    );
  } else {
    return <></>;
  }
};

export default LensCard;
