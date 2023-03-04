import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Backdrop } from "@mui/material";

import Loader from "./Loader";
import SnackbarError from "./subcomponents/SnackbarError";

import axios, * as others from "axios";

import { getUsers } from "./functions/getUsers";
import { useNavigate } from "react-router-dom";

import { withdrawPayment } from "./functions/withdrawPayment";
import { withdrawEthPayment } from "./functions/withdrawEthPayment";

import QuestionHeader from "./subcomponents/QuestionHeader";
import QuestionBody from "./subcomponents/QuestionBody";
import QuestionFooter from "./subcomponents/QuestionFooter";
import AnswerQuestion from "./AnswerQuestion";
import WithdrawQuestion from "./subcomponents/WithdrawQuestion";

const Questions = ({ userInfo, accessToken, setAccessError }) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);

  const [allUsers, setAllUsers] = useState();

  const [allQuestionsAsked, setAllQuestionsAsked] = useState();
  const [allQuestionsFor, setAllQuestionsFor] = useState();
  const [allQuestionsPurchased, setAllQuestionsPurchased] = useState();

  const [openAnswer, setOpenAnswer] = useState(false);
  const [answerHandle, setAnswerHandle] = useState();
  const [answerDisplayName, setAnswerDisplayName] = useState();
  const [answerAvatar, setAnswerAvatar] = useState();
  const [answerRewardAmount, setAnswerRewardAmount] = useState();
  const [answerQuestion, setAnswerQuestion] = useState();
  const [answerQuestionId, setAnswerQuestionId] = useState();
  const [answerBountyId, setAnswerBountyId] = useState();

  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [askLoaderWithdrawText, setAskLoaderWithdrawText] = useState();

  // Get all questions asked by user
  useEffect(() => {
    setLoading(true);
    const getQuestionsBy = async () => {
      if (userInfo?.userUid) {
        try {
          const response = await axios.get(
            `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/questions-by/${userInfo.userUid}`
          );
          const filteredQuestions = response.data.filter((data) => data.txHash);
          // Set all questions
          setAllQuestionsAsked(filteredQuestions);
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      } else {
        setLoading(false);
        console.log("No ID");
      }
    };
    getQuestionsBy();
  }, [userInfo]);

  // Get all questions for user
  useEffect(() => {
    setLoading(true);
    const getQuestionsFor = async () => {
      if (userInfo) {
        try {
          const { data } = await axios.get(
            `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/questions-for/${userInfo.userUid}`
          );
          const filteredQuestions = data.filter((response) => response.txHash);
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

  // Get all purchased questions
  useEffect(() => {
    if (userInfo) {
      setLoading(true);
      // Get all info for purchased questions
      const getPurchasedQuestions = async () => {
        try {
          const { data } = await axios.get(
            "https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/questions-purchased",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setAllQuestionsPurchased(data);
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
  }, [userInfo]);

  const handleWithdraw = async (contractAddress, tokenType) => {
    try {
      tokenType === "ETH"
        ? await withdrawEthPayment(contractAddress)
        : await withdrawPayment(contractAddress); //Need contract address
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };

  // Get all users
  useEffect(() => {
    getUsers().then((users) => {
      const modifiedUsers = users.map((user) => {
        if (user?.profile?.imageUrl?.startsWith("ipfs")) {
          return {
            ...user,
            profile: {
              ...user.profile,
              imageUrl: `https://ipfs.io/ipfs/${
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

  // Change Tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Close backdrop
  const handleCloseBackdrop = () => {
    setOpenAnswer(false);
  };

  const navigate = useNavigate();

  // Navigate to question landing page
  const handleCardClick = (id) => {
    navigate(`/id/${id}`);
  };

  // Navigate to sensei details page
  // const handleAvatarClick = (twitter) => {
  //   navigate(`/sensei/${twitter}`);
  // };

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
                <Tab label="Asked by me" {...a11yProps(0)} />
                <Tab label="Questions for me" {...a11yProps(1)} />
                <Tab label="Purchased" {...a11yProps(2)} />
              </Tabs>
            </Box>
            {/* Asked By Me */}
            <TabPanel value={value} index={0}>
              {allQuestionsAsked?.map((content) => {
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
                  <Card
                    className="feed-card"
                    key={content.questionId}
                    onClick={() => handleCardClick(content.questionId)}
                  >
                    <QuestionHeader
                      twitterPfp={userInfo?.profile?.imageUrl}
                      twitterHandle={userInfo?.profile?.handle}
                      twitterDisplayName={userInfo?.profile?.displayName}
                      price
                      tokenAmount={content.rewardTokenAmount}
                      tokenType={content.rewardTokenType}
                    />

                    <QuestionBody
                      body={content.body}
                      createdAt={content.createdAt}
                    />

                    <QuestionFooter
                      answeredBy={content.answerId !== null}
                      waiting={content.answerId === null && diffInHours < 48}
                      expired={content.answerId === null && diffInHours >= 48}
                      twitterHandle={answerer && answerer[0]?.profile.handle}
                      waitingTime={waitingTime}
                      bountyId={content.bountyId}
                      accessToken={accessToken}
                      setAccessError={setAccessError}
                      questionId={content.questionId}
                      setOpenWithdraw={setOpenWithdraw}
                      setAskLoaderWithdrawText={setAskLoaderWithdrawText}
                      withdrawn={content.withdrawnAfterExpiry}
                    />
                  </Card>
                );
              })}
            </TabPanel>
            {/* Questions for me */}
            <TabPanel value={value} index={1}>
              {allQuestionsFor?.map((content) => {
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
                        answered={content.answerId !== null}
                        toAnswer={content.answerId === null && diffInHours < 48}
                        userExpired={
                          content.answerId === null && diffInHours >= 48
                        }
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
            {/* Purchased */}
            <TabPanel value={value} index={2}>
              {allQuestionsPurchased?.map((content) => {
                const user = allUsers?.filter((id) => {
                  return id.userId === content.questionerUid;
                });

                const answerer = allUsers?.filter((id) => {
                  return id.userId === content.questioneeUid;
                });

                return (
                  <Card
                    className="feed-card"
                    key={content.questionId}
                    onClick={() => handleCardClick(content.questionId)}
                  >
                    <QuestionHeader
                      twitterPfp={user && user[0]?.profile.imageUrl}
                      twitterHandle={user && user[0]?.profile.handle}
                      twitterDisplayName={user && user[0]?.profile.displayName}
                      price
                      tokenAmount={content.rewardTokenAmount}
                      tokenType={content.rewardTokenType}
                    />

                    <QuestionBody
                      body={content.body}
                      createdAt={content.createdAt}
                    />

                    <QuestionFooter
                      purchased
                      twitterHandle={answerer && answerer[0]?.profile.handle}
                    />
                  </Card>
                );
              })}
            </TabPanel>
          </>
        )}
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
        {/* Withdraw Backdrop */}
        <Backdrop
          className="ask-question-backdrop"
          open={openWithdraw}
          sx={{ ml: "0px !important" }}
        >
          <WithdrawQuestion askLoaderWithdrawText={askLoaderWithdrawText} />
        </Backdrop>
      </Container>
    </>
  );
};

export default Questions;

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
