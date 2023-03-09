import React from "react";
import { Box, Typography } from "@mui/material";

const {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} = require("@apollo/client");
const { setContext } = require("@apollo/client/link/context");

const httpLink = createHttpLink({
  uri: "https://api.lens.dev",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("lensAccessToken");
  console.log("token: ", token);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const LensButton = ({ questionId }) => {
  const postToLens = async () => {
    console.log("questionId: ", questionId);
    const lensProfileId = localStorage.getItem("lensProfileId");
    console.log("lensProfileId: ", lensProfileId);

    const contentURI = `https://openask.me/id/${questionId}`;

    const postMutation = `mutation CreatePostTypedData {
      createPostTypedData(request: {
        profileId: \"${lensProfileId}\",
        contentURI: \"${contentURI}\",
        collectModule: {
          revertCollectModule: true
        },
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      }) {
        id
        expiresAt
        typedData {
          types {
            PostWithSig {
              name
              type
            }
          }
          domain {
            name
            chainId
            version
            verifyingContract
          }
          value {
            nonce
            deadline
            profileId
            contentURI
            collectModule
            collectModuleInitData
            referenceModule
            referenceModuleInitData
          }
        }
      }
    }`;
    client
      .mutate({
        mutation: gql(postMutation),
      })
      .then((result) => console.log(result.data));
  };

  return (
    <Box onClick={postToLens} className='lens-btn'>
      <Typography>Post To Lens</Typography>
    </Box>
  );
};

export default LensButton;
