import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { Box } from "@mui/system";

import FeedCards from "./subcomponents/FeedCards.js";
import Loader from "./subcomponents/Loader.js";
import axios from "axios";
import FeedFilters from "./subcomponents/FeedFilters.js";
import { getUsers } from "./functions/getUsers.js";
import { endpoint } from "./data/endpoint.js";

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState();
  const [allUsers, setAllUsers] = useState();

  // Get all users
  useEffect(() => {
    let isMounted = true;
    getUsers().then((users) => {
      const modifiedUsers = users.map((user) => {
        if (user?.profile?.imageUrl?.startsWith("ipfs")) {
          return {
            ...user,
            profile: {
              ...user.profile,
              imageUrl: `https://gateway.pinata.cloud/ipfs/${
                user.profile.imageUrl.split("/")[2]
              }`,
            },
          };
        } else {
          return user;
        }
      });
      if (isMounted) {
        setAllUsers(modifiedUsers);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Get Feed Questions and Answers
  useEffect(() => {
    const getQuestions = async () => {
      try {
        const { data } = await axios
          .get(`${endpoint}/questions`)
          .catch((error) => {
            console.log(error);
          });

        // Filter out questions without answers
        const filteredData = data?.filter((question) => {
          return question.answerId;
        });

        // Set feed data
        setQuestions(filteredData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getQuestions();
  }, [allUsers]);

  return (
    <>
      <Container
        className="main-container"
        sx={{
          width: { md: `calc(100% - 300px)` },
          mr: { md: `276px` },
          mt: "24px",
        }}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            <FeedFilters setQuestions={setQuestions} questions={questions} />
            <Box
              className="content-container"
              sx={{ height: "calc(100vh - 84.5px)" }}
            >
              <FeedCards questions={questions} allUsers={allUsers} price />
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default Feed;
