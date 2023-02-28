import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { Box } from "@mui/system";


import FeedCards from "./FeedCards.js";
import Loader from "./Loader.js";
import axios, * as others from "axios";
import FeedFilters from "./subcomponents/FeedFilters.js";

const Feed = ({ accessToken, setAccessError }) => {
  const [loading, setLoading] = useState(false);
  const [congrats, setCongrats] = useState();
  const [questions, setQuestions] = useState();

  const navigate = useNavigate();

  // Get Feed Questions and Answers
  useEffect(() => {
    const getQuestions = async () => {
      setLoading(true);
      try {
        const { data } = await axios
          .get(
            "https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/questions"
          )
          .catch((error) => {
            console.log(error);
          });

        // Filter out questions without answers
        const filteredData = data?.filter((question) => {
          return question.answerId;
        });

        // Set feed data
        setQuestions(filteredData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    getQuestions();
  }, []);

  const handleCloseCongrats = () => {
    setCongrats(false);
    navigate("/feed");
  };

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
            <Box className="content-container" sx={{height: "calc(100vh - 84.5px)"}}>
              <FeedCards data={questions} price />
            </Box>
          </>
        )}
      </Container>
      {/* {congrats && (
        <Congratulations handleCloseCongrats={handleCloseCongrats} purchase />
      )} */}
    </>
  );
};

export default Feed;
