import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, CardContent, Box, Backdrop } from "@mui/material";
import { styled } from "@mui/material/styles";
import { backSvg } from "./data/VectorSVGs";
import QuestionHeader from "./subcomponents/card/QuestionHeader";
import QuestionBody from "./subcomponents/card/QuestionBody";
import QuestionFooter from "./subcomponents/card/QuestionFooter";
import EavesdropQuestion from "./subcomponents/EavesdropQuestion";

import IconButton from "@mui/material/IconButton";
import Loader from "./subcomponents/Loader";

import axios from "axios";
import LensButton from "./subcomponents/buttons/LensButton";

const QuestionId = ({ accessToken, setAccessError }) => {
  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [user, setUser] = useState(null);
  const [answerer, setAnswerer] = useState(null);

  const [answerExists, setAnswerExists] = useState(true);
  const [open, setOpen] = useState(false);

  const [askLoaderEavesdropText, setAskLoaderEavesdropText] = useState(
    "Continue on Metamask"
  );
  const [openEavesdrop, setOpenEavesdrop] = useState(false);

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

          let modifiedUser = data?.profile?.imageUrl?.startsWith("ipfs")
            ? {
                ...data,
                profile: {
                  ...data.profile,
                  imageUrl: `https://ipfs.io/ipfs/${
                    data.profile.imageUrl.split("/")[2]
                  }`,
                },
              }
            : data;

          setUser(modifiedUser);
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
      if (question.answerId) {
        try {
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
        } catch (error) {
          if (error.response.status === 403) {
            setAccessError(true);
          }
          setAnswer(null);
          setLoading(false);
          console.log("Unauthorized Answer");
        }
      } else {
        setAnswerExists(false);
        setLoading(false);
      }
    };

    getAnswerToQuestion();
  }, [question]);

  const navigate = useNavigate();

  // Go Back Function
  function handleGoBack() {
    navigate(-1);
  }

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
          {/* Back Header */}
          <Box className="sensei-details-header">
            <Box className="sensei-details-header-box" onClick={handleGoBack}>
              {backSvg}
            </Box>
          </Box>
          {/* Question and Answer Card */}
          <Box
            className="content-container"
            sx={{ height: "calc(100vh - 98px)" }}
          >
            <Card className="question-landing-card">
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
                  id={id}
                  payees={[user?.walletAddress, answerer?.walletAddress]}
                  setAskLoaderEavesdropText={setAskLoaderEavesdropText}
                  setOpenEavesdrop={setOpenEavesdrop}
                  accessToken={accessToken}
                  setAccessError={setAccessError}
                  answerId={question?.answerId}
                />
              )}
            </Card>
            {answer && answerExists && (
              <>
                <Card className="question-landing-card">
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
                <Box className="lens-btn-container">
                  <LensButton questionId={id} />
                </Box>
              </>
            )}
          </Box>
          <Backdrop
            className="ask-question-backdrop"
            open={openEavesdrop}
            sx={{ ml: "0px !important" }}
          >
            <EavesdropQuestion
              askLoaderEavesdropText={askLoaderEavesdropText}
            />
          </Backdrop>
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
