import React, { useEffect, useState } from "react";
import {
  Container,
  Avatar,
  Box,
  Typography,
  Card,
  Link,
  Backdrop,
  Tabs,
  Tab,
} from "@mui/material";
import QuestionBody from "./subcomponents/QuestionBody.js";
import QuestionHeader from "./subcomponents/QuestionHeader.js";
import QuestionFooter from "./subcomponents/QuestionFooter.js";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios, * as others from "axios";
import Loader from "./Loader.js";
import AskQuestion from "./AskQuestion.js";

import AskSenseiButton from "./subcomponents/AskSenseiButton.js";
import { calendarSVG, linkSVG, backSvg } from "./subcomponents/VectorSVGs.js";

const SenseiDetails = ({ accessToken, setAccessError, userInfo }) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState([]);
  const [allUsers, setAllUsers] = useState();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [profit, setProfit] = useState(100.0);

  const [allQuestions, setAllQuestions] = useState();
  const [allAnswers, setAllAnswers] = useState();

  const [myPage, setMyPage] = useState(false);

  const [tokenAmount, setTokenAmount] = useState("");

  const [value, setValue] = useState(0);

  const sensei = useParams();
  const { twitter } = sensei;
  console.log(sensei)

  // Set My Page
  useEffect(() => {
    if (userInfo.profile.handle === twitter) {
      setMyPage(true);
    } else {
      setMyPage(false);
    }
  }, [twitter]);

  // Click ask question
  const onAskQuestion = (senseiDisplayName) => {
    setOpenBackdrop(true);
  };

  // Close backdrop
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  // Get Sensei
  useEffect(() => {
    setLoading(true);
    const getUsers = async () => {
      try {
        const { data } = await axios.get(
          `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/users`
        );
        const modifiedUsers = data.map((user) => {
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
        let userProfile = modifiedUsers.filter((user) => {
          return user.profile.handle === twitter;
        });
        console.log(userProfile)
        setAllUsers(modifiedUsers);
        setProfile(userProfile);
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();
  }, [twitter]);

  // Get all questions by User
  useEffect(() => {
    const getUserQuestions = async () => {
      try {
        const { data: questionsBy } = await axios.get(
          `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/questions-by/${profile[0]?.userId}`
        );
        const { data: questionsFor } = await axios.get(
          `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/questions-for/${profile[0]?.userId}`
        );

        const questions = questionsBy.filter((question) => {
          return question.answerId !== null;
        });
        const answers = questionsFor.filter((question) => {
          return question.answerId !== null;
        });

        setAllQuestions(questions);
        setAllAnswers(answers);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    getUserQuestions();
  }, [profile]);

  const navigate = useNavigate();

  // Navigate to question landing page
  const handleCardClick = (id) => {
    navigate(`/id/${id}`);
  };

  const onBtnClick = () => {
    navigate("/sensei/ask");
  };

  // Go Back Function
  function handleGoBack() {
    navigate(-1);
  }

  // Format Date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  // Change Tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
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
          {/* Header */}
          <Box className="sensei-details-header">
            <Box className="sensei-details-header-box" onClick={handleGoBack}>
              {backSvg}
            </Box>
            <Box className="sensei-details-header-box">
              {profile[0]?.profile.displayName}
            </Box>
          </Box>
          {/* Content */}
          <Box
            className="content-container"
            sx={{ height: "calc(100vh - 98px)" }}
          >
            <Box className="sensei-details-body" sx={{ pt: "24px" }}>
              <Box className="sensei-details-body-header">
                <Avatar
                  className="sensei-details-avatar"
                  alt={profile && profile[0]?.profile.displayName}
                  src={profile && profile[0]?.profile.imageUrl}
                />
                {!myPage && (
                  <AskSenseiButton
                    onAskQuestion={onAskQuestion}
                    senseiDisplayName={profile && profile[0]?.profile.displayName}
                  />
                )}
              </Box>
            </Box>
            <Box className="sensei-details-body" sx={{ pt: "12px" }}>
              <Typography variant="h5">
                {profile && profile[0]?.profile.displayName}
              </Typography>
              <Link
                className="link"
                href={`https://twitter.com/${twitter}`}
                target="_blank"
                rel="noreferrer"
                underline="none"
                sx={{
                  width: "100%",
                  display: "block",
                }}
              >
                @{twitter}
              </Link>
            </Box>
            <Box className="sensei-details-body" sx={{ pt: "20px" }}>
              <Typography>{profile && profile[0]?.profile.bio}</Typography>
            </Box>
            {/* Text Stats */}
            <Box className="sensei-details-body" sx={{ pt: "24px" }}>
              <Box className="sensei-details-body-stats">
                <Typography className="sensei-details-stats">
                  {profile && (
                    <span>
                      {profile[0]?.profile.followers_count?.toLocaleString()}
                    </span>
                  )}{" "}
                  Followers
                </Typography>
                <Typography className="sensei-details-stats">
                  {profile && (
                    <span>
                      {profile[0]?.questionsFor.length.toLocaleString()}
                    </span>
                  )}{" "}
                  Answers
                </Typography>
              </Box>
            </Box>
            {/* Box Stats */}
            <Box
              className="sensei-details-body"
              sx={{ pt: "20px", pb: "24px" }}
            >
              <Box className="sensei-details-fields">
                <Box className="sensei-details-field">{calendarSVG} Joined</Box>
                <Box className="sensei-details-field">{linkSVG} Website</Box>
              </Box>
              <Box className="sensei-details-fields">
                <Box className="sensei-details-field2">
                  {formatDate(profile[0]?.createdAt)}
                </Box>
                <Box className="sensei-details-field2">
                  <Link
                    className="link"
                    href={`https://ricefarmer.io`}
                    target="_blank"
                    rel="noreferrer"
                    underline="none"
                  >
                    {/* ricefarmer.io */}
                  </Link>
                </Box>
              </Box>
            </Box>
            {/* Tabs */}
            <Box className="sensei-details-filter">
              <Tabs
                value={value}
                onChange={handleChange}
                centered
                variant="fullWidth"
              >
                <Tab
                  className="sensei-details-label"
                  label="Answers"
                  {...a11yProps(0)}
                />
                <Tab
                  className="sensei-details-label"
                  label="Questions"
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
            {/* Answers */}
            <TabPanel value={value} index={0}>
              {allAnswers?.map((content) => {
                const questioner = allUsers?.filter((id) => {
                  return id.userId === content.questionerUid;
                });

                return (
                  <Card
                    className="feed-card"
                    key={content.questionId}
                    onClick={() => handleCardClick(content.questionId)}
                  >
                    <QuestionHeader
                      twitterPfp={questioner[0]?.profile.imageUrl}
                      twitterHandle={questioner[0]?.profile.handle}
                      twitterDisplayName={questioner[0]?.profile.displayName}
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
                      twitterHandle={profile[0]?.profile.handle}
                    />
                  </Card>
                );
              })}
            </TabPanel>
            {/* Questions */}
            <TabPanel value={value} index={1}>
              {allQuestions?.map((content) => {
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
                      twitterPfp={profile[0]?.profile.imageUrl}
                      twitterHandle={profile[0]?.profile.handle}
                      twitterDisplayName={profile[0]?.profile.displayName}
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
                      twitterHandle={answerer[0]?.profile.handle}
                    />
                  </Card>
                );
              })}
            </TabPanel>
          </Box>
          {/* Backdrop */}
          <Backdrop className="ask-question-backdrop" open={openBackdrop}>
            <AskQuestion
              userInfo={userInfo}
              accessToken={accessToken}
              setAccessError={setAccessError}
              handleCloseBackdrop={handleCloseBackdrop}
              askedSensei={profile && profile[0]?.profile.displayName}
            />
          </Backdrop>
        </>
      )}
    </Container>
  );
};

export default SenseiDetails;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      // className="content-container"
      // sx={{ height: "calc(100vh - 96px)" }}
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
