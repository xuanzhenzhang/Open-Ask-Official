import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Link,
  Avatar,
  Box,
  Backdrop,
  Button,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Loader from "./Loader";
import TweetBtn from "./TweetBtn";

import axios, * as others from "axios";
import { payForAnswer } from "./functions/payForAnswer.js";

const QuestionId = ({ accessToken, setAccessError }) => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [user, setUser] = useState(null);
  const [answerer, setAnswerer] = useState(null);

  const [open, setOpen] = useState(false);

  const params = useParams();
  const { id } = params;

  // Get question by ID
  useEffect(() => {
    setLoading(true);
    const getQuestion = async () => {
      try {
        const { data } = await axios.get(
          `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api.net/api/question/${id}`
        );
        setQuestion(data);
      } catch (error) {
        console.error(error);
      }
    };

    getQuestion();
  }, []);

  // Get user by question
  useEffect(() => {
    const getUser = async () => {
      try {
        if (question) {
          const { data } = await axios.get(
            `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/user/${question?.questionerUid}`
          );
          setUser(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, [question]);

  // Get answerer by question
  useEffect(() => {
    const getAnswerer = async () => {
      try {
        if (question) {
          const { data } = await axios.get(
            `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/user/${question?.questioneeUid}`
          );
          setAnswerer(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getAnswerer();
  }, [question]);

  // Get answer by question id
  useEffect(() => {
    const getAnswerToQuestion = async () => {
      try {
        if (question) {
          const { data } = await axios.get(
            `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/answer-to-question/${id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setAnswer(data);
          setLoading(false);
        }
      } catch (error) {
        if (error.response.status === 403) {
          setAccessError(true);
        }
        setAnswer(null);
        setLoading(false);
        console.log("Unauthorized Answer");
      }
    };

    getAnswerToQuestion();
  }, [question]);

  // Confetti, Pay to See Answer Request
  const handlePurchaseAnswer = (id, answerId, toAddress, tokenAmount) => {
    payForAnswer(accessToken, id, answerId, toAddress, tokenAmount);
  };

  const navigate = useNavigate();

  const handleAvatarClick = (twitter) => {
    navigate(`/sensei/${twitter}`);
  };

  const handleCloseBackdrop = () => {
    setOpen(false);
  };
  const handleOpenBackdrop = () => {
    setOpen(!open);
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
          <Card className="feed-card">
            <CardHeader
              avatar={
                <Avatar
                  sx={{ cursor: "pointer" }}
                  src={user?.twitterPFPUrl}
                  onClick={() => handleAvatarClick(user?.twitterHandle)}
                ></Avatar>
              }
              title={
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>{user?.twitterDisplayName}</Typography>
                    <Typography>{`${question?.rewardTokenAmount} ${question?.rewardTokenType}`}</Typography>
                  </div>
                </>
              }
              subheader={
                <Link
                  className="feed-link"
                  underline="none"
                  href={`https://twitter.com/${user?.twitterHandle}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{user?.twitterHandle}
                </Link>
              }
            ></CardHeader>
            <CardContent>
              <Typography>{question?.body}</Typography>
            </CardContent>
            <CardActions>
              <Typography className="feed-timestamp" variant="caption">
                {new Date(question?.createdAt).toLocaleString()}
              </Typography>
            </CardActions>
            {/* </Card> */}

            {/* Add Answer Card Here */}
            <Divider variant="middle" />

            {/* <Card className="feed-card"> */}
            <CardHeader
              avatar={
                <Avatar
                  sx={{ cursor: "pointer" }}
                  src={answerer?.twitterPFPUrl}
                  onClick={() => handleAvatarClick(answerer?.twitterHandle)}
                ></Avatar>
              }
              title={answerer?.twitterDisplayName}
              subheader={
                <Link
                  className="feed-link"
                  underline="none"
                  href={`https://twitter.com/${answerer?.twitterHandle}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{answerer?.twitterHandle}
                </Link>
              }
            ></CardHeader>
            <CardContent>
              {answer && <Typography>{answer?.body}</Typography>}
              {!answer && (
                <>
                  <Box className="purchase-answer-id">
                    <Typography
                      onClick={handleOpenBackdrop}
                      variant="body2"
                      sx={{ cursor: "pointer" }}
                    >
                      Purchase Answer
                    </Typography>
                  </Box>
                  <Backdrop
                    className="backdrop-purchase"
                    open={open}
                    onClick={handleCloseBackdrop}
                  >
                    <Card sx={{ minWidth: "80%" }}>
                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{ cursor: "pointer" }}
                            src={user?.twitterPFPUrl}
                            onClick={() =>
                              handleAvatarClick(user?.twitterHandle)
                            }
                          ></Avatar>
                        }
                        title={
                          <>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography>
                                {user?.twitterDisplayName}
                              </Typography>
                              <Typography>{`${question?.rewardTokenAmount} ${question?.rewardTokenType}`}</Typography>
                            </div>
                          </>
                        }
                        subheader={
                          <Link
                            className="feed-link"
                            underline="none"
                            href={`https://twitter.com/${user?.twitterHandle}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            @{user?.twitterHandle}
                          </Link>
                        }
                      ></CardHeader>
                      <CardContent>
                        <Typography>{question?.body}</Typography>
                      </CardContent>
                      <CardActions>
                        {/* <ExpandMore disabled>
                          <ExpandMoreIcon />
                        </ExpandMore> */}
                        <Typography>
                          Answered by{" "}
                          <Link
                            href={`https://twitter.com/${answerer?.twitterDisplayName}`}
                            target="_blank"
                            rel="noreferrer"
                            underline="none"
                          >
                            @{answerer?.twitterDisplayName}
                          </Link>
                        </Typography>
                        <Typography className="feed-timestamp">
                          {new Date(question?.createdAt).toLocaleString()}
                        </Typography>
                      </CardActions>
                    </Card>
                    <Button
                      onClick={() =>
                        handlePurchaseAnswer(
                          id,
                          question.answerId,
                          answerer.walletAddress,
                          0.001
                        )
                      }
                      className="btn-purchase"
                      variant="contained"
                    >
                      Purchase this answer for .001 ETH
                    </Button>
                  </Backdrop>
                </>
              )}
            </CardContent>
            {answer && (
              <CardActions>
                <Typography className="feed-timestamp" variant="caption">
                  {new Date(answer?.createdAt).toLocaleString()}
                </Typography>
              </CardActions>
            )}
          </Card>
          {/* {answer && <TweetBtn />} */}
        </>
      )}
    </Container>
  );
};

export default QuestionId;

// Expand component
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));
