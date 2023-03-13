import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { Box } from "@mui/system";

import FeedCards from "./subcomponents/FeedCards.js";
import Loader from "./subcomponents/Loader.js";
import axios, * as others from "axios";
import FeedFilters from "./subcomponents/FeedFilters.js";
import { endpoint } from "./data/endpoint.js";

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState();

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
  }, []);

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
              <FeedCards data={questions} price />
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default Feed;
