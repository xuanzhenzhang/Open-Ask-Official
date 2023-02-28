import React, { useEffect, useState } from "react";
import {
  Container,
  Avatar,
  Box,
  Typography,
  Card,
  Link,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import QuestionBody from "./subcomponents/QuestionBody.js";
import QuestionHeader from "./subcomponents/QuestionHeader.js";
import QuestionFooter from "./subcomponents/QuestionFooter.js";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios, * as others from "axios";
import Loader from "./Loader.js";

import AskSenseiButton from "./subcomponents/AskSenseiButton.js";
import { calendarSVG, linkSVG, backSvg } from "./subcomponents/VectorSVGs.js";

const SenseiDetails = ({ accessToken, setAccessError, userInfo }) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState([]);
  const [allUsers, setAllUsers] = useState();
  const [profit, setProfit] = useState(100.0);

  const [allQuestions, setAllQuestions] = useState();
  const [allAnswers, setAllAnswers] = useState();

  const [myPage, setMyPage] = useState(false);

  const [tokenAmount, setTokenAmount] = useState("");

  const [value, setValue] = useState(0);

  const sensei = useParams();
  const { twitter } = sensei;

  // Set My Page
  useEffect(() => {
    if (userInfo.twitterHandle === twitter) {
      setMyPage(true);
    } else {
      setMyPage(false)
    }
  }, [twitter]);

  // Get Sensei
  useEffect(() => {
    setLoading(true);
    const getUsers = async () => {
      try {
        const { data } = await axios.get(
          `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/users`
        );
        let userProfile = data.filter((user) => {
          return user.twitterHandle === twitter;
        });
        setAllUsers(data);
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
              {profile[0]?.twitterDisplayName}
            </Box>
          </Box>
          {/* Content */}
          <Box
            className="content-container"
            sx={{ height: "calc(100vh - 104.5px)" }}
          >
            <Box className="sensei-details-body" sx={{ pt: "24px" }}>
              <Box className="sensei-details-body-header">
                <Avatar
                  className="sensei-details-avatar"
                  alt={profile && profile[0]?.twitterDisplayName}
                  src={profile && profile[0]?.twitterPFPUrl}
                />
                {!myPage && <AskSenseiButton />}
              </Box>
            </Box>
            <Box className="sensei-details-body" sx={{ pt: "12px" }}>
              <Typography variant="h5">
                {profile && profile[0]?.twitterDisplayName}
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
              <Typography>
                {profile && profile[0]?.twitterDescription}
              </Typography>
            </Box>
            {/* Text Stats */}
            <Box className="sensei-details-body" sx={{ pt: "24px" }}>
              <Box className="sensei-details-body-stats">
                <Typography className="sensei-details-stats">
                  {profile && (
                    <span>
                      {profile[0]?.publicMetrics?.followers_count?.toLocaleString()}
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
                    href={`https://twitter.com/${twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    underline="none"
                  >
                    ricefarmer.io
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
                      twitterPfp={questioner[0]?.twitterPFPUrl}
                      twitterHandle={questioner[0]?.twitterHandle}
                      twitterDisplayName={questioner[0]?.twitterDisplayName}
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
                      twitterHandle={profile[0]?.twitterHandle}
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
                      twitterPfp={profile[0]?.twitterPFPUrl}
                      twitterHandle={profile[0]?.twitterHandle}
                      twitterDisplayName={profile[0]?.twitterDisplayName}
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
                      twitterHandle={answerer[0]?.twitterHandle}
                    />
                  </Card>
                );
              })}
            </TabPanel>
            {/* <Box sx={{ mt: "12px", mb: "12px", padding: "5px" }}>
              <Typography variant="h6">
                Total Profit: ${profit.toFixed(2)}
              </Typography>
            </Box> */}

            {/* <Box
            // sx={{ mt: "12px" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography variant="body">Minimum Ask Price:</Typography>
                <TextField
                  disabled={!myPage}
                  sx={{ flexGrow: "1" }}
                  variant="outlined"
                  label="Minimum Ask Price"
                  size="small"
                  type="number"
                  value={tokenAmount}
                  onChange={handleTokenAmountChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">ETH</InputAdornment>
                    ),
                    inputProps: {
                      step: 0.01,
                    },
                  }}
                />
                {myPage === true && <Button>Save</Button>}
              </Box>
            </Box> */}

            {/* <Box sx={{ mt: "12px", display: "flex", flexDirection: "column" }}>
              <TextField
                className="sensei-details-input"
                disabled={!myPage}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "10px",
                  mb: "10px",
                }}
                variant="standard"
                size="small"
                type="text"
                value={twitter}
                placeholder="Twitter"
                // onChange={handleTokenAmountChange}
                InputProps={{
                  startAdornment: (
                    <TwitterIcon
                      className="sensei-details-twitter"
                      position="start"
                    />
                  ),
                  endAdornment: myPage === true && <Button>Save</Button>,
                  disableUnderline: true,
                  sx: { mr: "5px" },
                }}
              />
              <TextField
                className="sensei-details-input"
                disabled={!myPage}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "10px",
                  mb: "10px",
                }}
                variant="standard"
                size="small"
                type="text"
                value={telegram}
                placeholder="Telegram"
                onChange={(event) => setTelegram(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <TelegramIcon sx={{ color: "black" }} position="start" />
                  ),
                  endAdornment: myPage === true && <Button>Save</Button>,
                  disableUnderline: true,
                  sx: { mr: "5px" },
                }}
              />
            </Box> */}

            {/* <Box>
              <FeedCards data={userFeed} />
            </Box> */}
          </Box>
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
