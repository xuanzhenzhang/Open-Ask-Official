import React, { useEffect, useState } from "react";
import {
  Container,
  Avatar,
  Box,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardActions,
  Link,
  CardContent,
  Paper,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios, * as others from "axios";
import Loader from "./Loader.js";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import LanguageIcon from "@mui/icons-material/Language";

import FeedCards from "./FeedCards.js";

const SenseiDetails = ({ accessToken, setAccessError, userInfo }) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState([]);
  const [userFeed, setUserFeed] = useState();
  const [profit, setProfit] = useState(100.0);

  const [myPage, setMyPage] = useState(false);

  const [tokenAmount, setTokenAmount] = useState("");
  const [telegram, setTelegram] = useState("");

  const sensei = useParams();
  const { twitter } = sensei;

  // Set My Page
  useEffect(() => {
    if (userInfo.twitterHandle === twitter) {
      setMyPage(true);
    }
  }, []);

  // Get Sensei
  useEffect(() => {
    setLoading(true);
    const getUsers = async () => {
      try {
        const { data } = await axios.get(
          `https://us-central1-fir-quickask.cloudfunctions.net/api/users`
        );
        let userProfile = data.filter((user) => {
          return user.twitterHandle === twitter;
        });
        setProfile(userProfile);
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();
  }, []);

  // Get all questions by User
  useEffect(() => {
    const getUserQuestions = async () => {
      try {
        const { data: questionsBy } = await axios.get(
          `https://us-central1-fir-quickask.cloudfunctions.net/api/questions-by/${profile[0]?.userId}`
        );
        const { data: questionsFor } = await axios.get(
          `https://us-central1-fir-quickask.cloudfunctions.net/api/questions-for/${profile[0]?.userId}`
        );

        // Combine questions asked and questions answered
        const allActivity = [...questionsBy, ...questionsFor];

        // Remove duplicates
        const uniqueActivity = [
          ...new Set(allActivity.map((activity) => activity.questionId)),
        ].map((questionId) =>
          allActivity.find((activity) => activity.questionId === questionId)
        );

        // Sort by recent activity
        uniqueActivity.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Find only questions that have been answered
        let questionsWithAnswers = uniqueActivity.filter(function (question) {
          return question.answerId !== null;
        });

        // Find answer for each question(if applicable)
        const answers = questionsWithAnswers.map((object) => {
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
        answerArray.forEach((item) => {
          if (item.questionId) {
            const index = questionsWithAnswers.findIndex(
              (item2) => item2.questionId === item.questionId
            );
            if (index !== -1) {
              questionsWithAnswers[index].answer = item.answer;
              questionsWithAnswers[index].answerCreatedAt =
                item.answerCreatedAt;
            }
          }
        });

        // Set feed data
        setUserFeed(questionsWithAnswers);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    getUserQuestions();
  }, [profile]);

  const navigate = useNavigate();

  const onBtnClick = () => {
    navigate("/sensei/ask");
  };

  const handleTokenAmountChange = (e) => {
    e.preventDefault();
    setTokenAmount(e.target.value);
  };

  return (
    <Container
      sx={{
        width: { md: `calc(100% - 300px)` },
        ml: { md: `300px` },
        mt: "84px",
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="sensei-details-paper">
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Avatar
                    alt={profile && profile[0]?.twitterDisplayName}
                    src={profile && profile[0]?.twitterPFPUrl}
                    sx={{ width: 150, height: 150, mb: "10px" }}
                  />
                  {!myPage && (
                    <Button
                      sx={{ height: "100%" }}
                      variant="contained"
                      size="large"
                      onClick={onBtnClick}
                    >
                      Ask
                    </Button>
                  )}
                </Box>
                <Typography variant="h5">
                  {profile && profile[0]?.twitterDisplayName}
                </Typography>
                <Link
                  href={`https://twitter.com/${twitter}`}
                  target="_blank"
                  rel="noreferrer"
                  variant="body2"
                  underline="none"
                  sx={{
                    width: "100%",
                    display: "block",
                  }}
                >
                  @{twitter}
                </Link>
                <Typography variant="caption" color="text.secondary">
                  {profile &&
                    profile[0]?.publicMetrics?.followers_count?.toLocaleString()}{" "}
                  Followers
                </Typography>
                <br />
                <Typography>About Me:</Typography>
                <Typography>
                  {profile && profile[0]?.twitterDescription}
                </Typography>
              </Paper>
              {/* <Box
                sx={{ display: "flex", justifyContent: "center", mt: "20px" }}
              >
                <Button variant="contained" size="large" onClick={onBtnClick}>
                  Ask
                </Button>
              </Box> */}
              <Box sx={{ mt: "12px", mb: "12px", padding: "5px" }}>
                <Typography variant="h6">
                  Total Profit: ${profit.toFixed(2)}
                </Typography>
              </Box>

              <Box
              // sx={{ mt: "12px" }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {/* <Typography variant="body">Minimum Ask Price:</Typography> */}
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
              </Box>

              <Box
                sx={{ mt: "12px", display: "flex", flexDirection: "column" }}
              >
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
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <FeedCards data={userFeed} />
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default SenseiDetails;
