import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Backdrop } from "@mui/material";

import Loader from "./subcomponents/Loader";

import axios, * as others from "axios";

import { getUsers } from "./functions/getUsers";
import { useNavigate } from "react-router-dom";

import QuestionHeader from "./subcomponents/card/QuestionHeader";
import QuestionBody from "./subcomponents/card/QuestionBody";
import QuestionFooter from "./subcomponents/card/QuestionFooter";
import AnswerQuestion from "./subcomponents/AnswerQuestion";

const Answers = ({ userInfo, accessToken, setAccessError }) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);

  const [allUsers, setAllUsers] = useState();
  const [allQuestionsFor, setAllQuestionsFor] = useState();

  const [toBeAnswered, setToBeAnswered] = useState();
  const [completed, setCompleted] = useState();
  const [expired, setExpired] = useState();

  const [openAnswer, setOpenAnswer] = useState(false);
  const [answerHandle, setAnswerHandle] = useState();
  const [answerDisplayName, setAnswerDisplayName] = useState();
  const [answerAvatar, setAnswerAvatar] = useState();
  const [answerRewardAmount, setAnswerRewardAmount] = useState();
  const [answerQuestion, setAnswerQuestion] = useState();
  const [answerQuestionId, setAnswerQuestionId] = useState();
  const [answerBountyId, setAnswerBountyId] = useState();

  const navigate = useNavigate();

  //   Get all Questions For User
  useEffect(() => {
    setLoading(true);
    const getQuestionsFor = async () => {
      if (userInfo) {
        try {
          const { data } = await axios.get(
            `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/questions-for/${userInfo.userUid}`
          );
          const filteredQuestions = data.filter((response) => response.txHash);

          //   Set Questions To Be Answered
          const toBeAnswered = filteredQuestions.filter((question) => {
            const lessThan48Hours = !is48HoursAgo(question.createdAt);
            return !question.answerId && lessThan48Hours;
          });
          setToBeAnswered(toBeAnswered);

          //   Set Questions Completed
          const completed = filteredQuestions.filter((question) => {
            return question.answerId;
          });
          setCompleted(completed);

          //   Set Questions Expired
          const expired = filteredQuestions.filter((question) => {
            const moreThan48Hours = is48HoursAgo(question.createdAt);
            return !question.answerId && moreThan48Hours;
          });
          setExpired(expired);

          // Set all questions for
          setAllQuestionsFor(filteredQuestions);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("No ID");
      }
    };

    getQuestionsFor();
  }, [userInfo]);

  // Get all users
  useEffect(() => {
    getUsers().then((users) => {
      const modifiedUsers = users.map((user) => {
        if (user?.profile?.imageUrl?.startsWith("ipfs")) {
          console.log(user);

          return {
            ...user,
            profile: {
              ...user.profile,
              // https://ipfs.io/ipfs/
              imageUrl: `https://gateway.pinata.cloud/ipfs/${
                user.profile.imageUrl.split("/")[2]
              }`,
            },
          };
        } else {
          return user;
        }
      });
      setAllUsers(modifiedUsers);
    });
  }, []);

  const is48HoursAgo = (dateTimeStr) => {
    const dateTime = new Date(dateTimeStr);
    const now = new Date();
    const diffInMs = now.getTime() - dateTime.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return diffInHours >= 48;
  };

  // Change Tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Navigate to question landing page
  const handleCardClick = (id) => {
    navigate(`/id/${id}`);
  };

  // Close backdrop
  const handleCloseBackdrop = () => {
    setOpenAnswer(false);
  };

  //   Set loading to false when allUsers and allQuestionsFor are loaded
  useEffect(() => {
    if (allUsers && allQuestionsFor && loading) {
      setLoading(false);
    }
  }, [allUsers, allQuestionsFor, loading]);

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
            <Box className="question-filter">
              <Tabs
                value={value}
                onChange={handleChange}
                centered
                variant="fullWidth"
              >
                <Tab label="To be answered" {...a11yProps(0)} />
                <Tab label="Completed" {...a11yProps(1)} />
                <Tab label="Expired" {...a11yProps(2)} />
              </Tabs>
            </Box>

            {/* To Be Answered */}
            <TabPanel value={value} index={0}>
              {toBeAnswered?.map((content) => {
                const user = allUsers?.filter((id) => {
                  return id.userId === content.questionerUid;
                });

                const answerer = allUsers?.filter((id) => {
                  return id.userId === content.questioneeUid;
                });

                const specificDate = new Date(content.createdAt);
                const now = new Date();
                const diffInMs = now - specificDate;
                const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
                const diffInMinutes = Math.floor((diffInMs / (1000 * 60)) % 60);
                const waitingTime = `${47 - diffInHours} hours and ${
                  60 - diffInMinutes
                } minutes`;

                return (
                  <>
                    <Card
                      className="feed-card"
                      key={content.questionId}
                      onClick={() => handleCardClick(content.questionId)}
                    >
                      <QuestionHeader
                        twitterPfp={user && user[0]?.profile.imageUrl}
                        twitterHandle={user && user[0]?.profile.handle}
                        twitterDisplayName={
                          user && user[0]?.profile.displayName
                        }
                        price
                        tokenAmount={content.rewardTokenAmount}
                        tokenType={content.rewardTokenType}
                      />

                      <QuestionBody
                        body={content.body}
                        createdAt={content.createdAt}
                      />

                      <QuestionFooter
                        toAnswer={true}
                        twitterHandle={answerer && answerer[0]?.profile.handle}
                        waitingTime={waitingTime}
                        setOpenAnswer={setOpenAnswer}
                        setAnswerAvatar={setAnswerAvatar}
                        setAnswerHandle={setAnswerHandle}
                        setAnswerDisplayName={setAnswerDisplayName}
                        setAnswerRewardAmount={setAnswerRewardAmount}
                        setAnswerQuestion={setAnswerQuestion}
                        setAnswerQuestionId={setAnswerQuestionId}
                        setAnswerBountyId={setAnswerBountyId}
                        handle={user && user[0]?.profile.handle}
                        displayName={user && user[0]?.profile.displayName}
                        avatar={user && user[0]?.profile.imageUrl}
                        rewardAmount={content.rewardTokenAmount}
                        answerQuestion={content.body}
                        questionId={content.questionId}
                        bountyId={content.bountyId}
                      />
                    </Card>
                  </>
                );
              })}
            </TabPanel>

            {/* Completed */}
            <TabPanel value={value} index={1}>
              {completed?.map((content) => {
                const user = allUsers?.filter((id) => {
                  return id.userId === content.questionerUid;
                });

                return (
                  <>
                    <Card
                      className="feed-card"
                      key={content.questionId}
                      onClick={() => handleCardClick(content.questionId)}
                    >
                      <QuestionHeader
                        twitterPfp={user && user[0]?.profile.imageUrl}
                        twitterHandle={user && user[0]?.profile.handle}
                        twitterDisplayName={
                          user && user[0]?.profile.displayName
                        }
                        price
                        tokenAmount={content.rewardTokenAmount}
                        tokenType={content.rewardTokenType}
                      />

                      <QuestionBody
                        body={content.body}
                        createdAt={content.createdAt}
                      />

                      <QuestionFooter answered={true} />
                    </Card>
                  </>
                );
              })}
            </TabPanel>

            {/* Expired */}
            <TabPanel value={value} index={2}>
              {expired?.map((content) => {
                const user = allUsers?.filter((id) => {
                  return id.userId === content.questionerUid;
                });

                return (
                  <>
                    <Card
                      className="feed-card"
                      key={content.questionId}
                      onClick={() => handleCardClick(content.questionId)}
                    >
                      <QuestionHeader
                        twitterPfp={user && user[0]?.profile.imageUrl}
                        twitterHandle={user && user[0]?.profile.handle}
                        twitterDisplayName={
                          user && user[0]?.profile.displayName
                        }
                        price
                        tokenAmount={content.rewardTokenAmount}
                        tokenType={content.rewardTokenType}
                      />

                      <QuestionBody
                        body={content.body}
                        createdAt={content.createdAt}
                      />

                      <QuestionFooter userExpired={true} />
                    </Card>
                  </>
                );
              })}
            </TabPanel>

            {/* Answer Question Backdrop */}
            <Backdrop
              className="ask-question-backdrop"
              open={openAnswer}
              sx={{ ml: "0px !important" }}
            >
              <AnswerQuestion
                userInfo={userInfo}
                accessToken={accessToken}
                setAccessError={setAccessError}
                handle={answerHandle}
                avatar={answerAvatar}
                displayName={answerDisplayName}
                rewardAmount={answerRewardAmount}
                answerQuestion={answerQuestion}
                questionId={answerQuestionId}
                bountyId={answerBountyId}
                handleCloseBackdrop={handleCloseBackdrop}
              />
            </Backdrop>
          </>
        )}
      </Container>
    </>
  );
};

export default Answers;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      className="content-container"
      sx={{ height: "calc(100vh - 96px)" }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Box>{children}</Box>
        </Box>
      )}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
