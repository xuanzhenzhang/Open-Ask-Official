import React, { useState, useEffect } from "react";
import { Container, Box, Tabs, Tab, Typography } from "@mui/material";
import axios, * as others from "axios";

import FeedCards from "./FeedCards";
import QuestionAndAnswer from "./subcomponents/QuestionAndAnswer";
import Loader from "./Loader";

const QuestionsPurchased = ({ accessToken, userInfo, setAccessError }) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [purchasedQuestions, setPurchasedQuestions] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Get Feed Questions and Answers
  useEffect(() => {
    if (userInfo) {
      setLoading(true);
      // Get all info for ppurchased questions
      const getPurchasedQuestions = async () => {
        try {
          const { data: questionsPurchased } = await axios.get(
            "https://us-central1-fir-quickask.cloudfunctions.net/api/questions-purchased",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          // Find answer for each question(if applicable)
          const answers = questionsPurchased.map((object) => {
            return axios
              .get(
                `https://us-central1-fir-quickask.cloudfunctions.net/api/answer/${object.answerId}`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              )
              .catch((error) => {
                if (error.response.status === 403) {
                  setAccessError(true);
                }
                console.log(error);
                return { data: "" };
              });
          });

          const response = await Promise.all(answers);

          // Destructure answer array
          const answerArray = response.map((data) => {
            return {
              answer: data?.data?.body,
              questionId: data?.data?.questionId,
              answerCreatedAt: data?.data?.createdAt,
            };
          });

          // Match questionId from question with answer. Add answer if applicable
          for (let i = answerArray.length - 1; i >= 0; i--) {
            const index = i;
            if (index !== -1) {
              questionsPurchased[index].answer = answerArray[index].answer;
              questionsPurchased[index].answerCreatedAt =
                answerArray[index].answerCreatedAt;
              questionsPurchased[index].questionId =
                answerArray[index].questionId;
            }
          }

          // Set feed data
          setPurchasedQuestions(questionsPurchased);
          setLoading(false);
        } catch (error) {
          if (error.response.status === 403) {
            setAccessError(true);
          }
          setLoading(false);
          console.log(error);
        }
      };
      getPurchasedQuestions();
    } else {
      console.log("No ID");
    }
  }, []);

  return (
    <Container
      sx={{
        mt: 2,
        width: { md: `calc(100% - 300px)` },
        ml: { md: `300px` },
        mt: "74px",
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange} centered>
                <Tab label="Purchased" {...a11yProps(0)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                <QuestionAndAnswer data={purchasedQuestions} />
              </TabPanel>
            </Box>
          </>
        </>
      )}
    </Container>
  );
};

export default QuestionsPurchased;

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}
