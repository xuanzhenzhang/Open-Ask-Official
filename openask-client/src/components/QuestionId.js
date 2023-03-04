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
import { backSvg } from "./subcomponents/VectorSVGs";
import QuestionHeader from "./subcomponents/QuestionHeader";
import QuestionBody from "./subcomponents/QuestionBody";
import QuestionFooter from "./subcomponents/QuestionFooter";

import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Loader from "./Loader";
import TweetBtn from "./TweetBtn";

import axios, * as others from "axios";
import { payForAnswer } from "./functions/payForAnswer.js";
import LensButton from "./subcomponents/LensButton";

const QuestionId = ({ accessToken, setAccessError }) => {
  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [user, setUser] = useState(null);
  const [answerer, setAnswerer] = useState(null);

  const [answerExists, setAnswerExists] = useState(true);
  const [open, setOpen] = useState(false);

  const params = useParams();
  const { id } = params;

  // Get question by ID
  useEffect(() => {
    setLoading(true);
    const getQuestion = async () => {
      try {
        const { data } = await axios.get(
          `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/question/${id}`
        );
        console.log(data);
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
          console.log(data);
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
        } else if (error.response.status === 404) {
          setAnswerExists(false);
        }
        setAnswer(null);
        console.log("Unauthorized Answer");
      }
      setLoading(false);
    };

    getAnswerToQuestion();
  }, [question]);

  // Confetti, Pay to See Answer Request
  const handlePurchaseAnswer = (id, answerId, toAddress, tokenAmount) => {
    payForAnswer(accessToken, id, answerId, toAddress, tokenAmount);
  };

  const navigate = useNavigate();

  // Go Back Function
  function handleGoBack() {
    navigate(-1);
  }

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
      className='main-container'
      sx={{
        width: { md: `calc(100% - 300px)` },
        mr: { md: `276px` },
        mt: "24px",
      }}>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Back Header */}
          <Box className='sensei-details-header'>
            <Box className='sensei-details-header-box' onClick={handleGoBack}>
              {backSvg}
            </Box>
          </Box>
          {/* Question and Answer Card */}
          <Box
            className='content-container'
            sx={{ height: "calc(100vh - 98px)" }}>
            <Card className='question-landing-card'>
              <QuestionHeader
                twitterPfp={user?.profile.imageUrl}
                twitterHandle={user?.profile.handle}
                twitterDisplayName={user?.profile.displayName}
                price
                tokenAmount={question?.rewardTokenAmount}
                tokenType={question?.rewardTokenType}
              />

              <QuestionBody
                body={question?.body}
                createdAt={question?.createdAt}
              />
              {answer && <CardContent />}
              {!answerExists && !answer && <CardContent />}
              {!answer && answerExists && (
                <QuestionFooter
                  answeredBy
                  notAnswered
                  twitterHandle={answerer?.profile.handle}
                />
              )}
            </Card>
            {answer && answerExists && (
              <>
                <Card className='question-landing-card'>
                  <QuestionHeader
                    twitterPfp={answerer?.profile.imageUrl}
                    twitterHandle={answerer?.profile.handle}
                    twitterDisplayName={answerer?.profile.displayName}
                  />
                  <QuestionBody
                    body={answer?.body}
                    createdAt={answer?.createdAt}
                  />
                  <QuestionFooter eavesdrop eavesdropCount={answer} />
                </Card>
                <Box className='lens-btn-container'>
                  <LensButton />
                </Box>
              </>
            )}
          </Box>
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
