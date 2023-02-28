import React, { useState } from "react";
import {
  Container,
  Card,
  Typography,
  CardContent,
  CardHeader,
  Avatar,
  CardActions,
  Button,
  TextField,
  Stack,
  Backdrop,
  Link,
  InputAdornment,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Congratulations from "./Congratulations.js";
import confetti from "canvas-confetti";
import axios, * as others from "axios";

import { receivePayment } from "./functions/receivePayment.js";
import { receiveEthPayment } from "./functions/receiveEthPayment.js";
import Loader from "./Loader.js";
import SnackbarError from "./subcomponents/SnackbarError.js";

const AnswerQuestion = ({ accessToken, setAccessError }) => {
  const location = useLocation();
  const {
    question,
    questionId,
    avatar,
    twitter,
    displayName,
    tokenType,
    tokenAmount,
    contractAddress,
    timestamp,
  } = location.state;

  const [answer, setAnswer] = useState("");
  const [tokenPayAmount, setTokenPayAmount] = useState(0.001);

  const [open, setOpen] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);

  const [congrats, setCongrats] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  const handleTokenAmountChange = (e) => {
    e.preventDefault();
    setTokenPayAmount(e.target.value);
  };

  const handleCloseBackdrop = () => {
    setOpen(false);
  };
  const handleOpenBackdrop = () => {
    setOpen(!open);
  };

  // Receive payment from Smart Contract
  const handleCongrats = async () => {
    try {
      setOpenLoader(true);
      console.log(tokenType);
      tokenType === "ETH"
        ? await receivePayment(contractAddress)
        : await receiveEthPayment(contractAddress);

      await answerQuestion();
      setOpenLoader(false);
      setCongrats(!congrats);
      confetti({
        zIndex: "3002",
        particleCount: 300,
        spread: 150,
        shapes: ["circle", "square"],
        origin: {
          y: 0.65,
        },
      });
    } catch (error) {
      console.log(error);
      setOpenLoader(false);
      setSnackbarOpen(true);
    }
  };

  const handleCloseCongrats = () => {
    setCongrats(false);
    navigate("/questions_answered");
  };

  // POST answer to question
  const answerQuestion = async () => {
    try {
      await axios.post(
        `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/answer/${questionId}`,
        {
          body: answer,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Question answered successfully!");
    } catch (error) {
      if (error.response.status === 403) {
        setAccessError(true);
      }
      throw new Error(error);
    }
  };

  return (
    <>
      <Container
        sx={{
          width: { md: `calc(100% - 300px)` },
          ml: { md: `300px` },
          mt: "74px",
        }}
      >
        <Card className="answer-card-full">
          <CardHeader
            avatar={
              <Avatar
                // sx={{ cursor: "pointer" }}
                src={avatar}
                // onClick={(event) => {
                //   event.stopPropagation();
                //   handleAvatarClick(user && user[0]?.twitterHandle);
                // }}
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
                  <Typography>{displayName}</Typography>
                  <Typography>{`${tokenAmount} ${tokenType}`}</Typography>
                </div>
              </>
            }
            subheader={
              <Link
                className="feed-link"
                underline="none"
                href={`https://twitter.com/${twitter}`}
                target="_blank"
                rel="noreferrer"
              >
                @{twitter}
              </Link>
            }
          ></CardHeader>
          <CardContent>
            <Typography>{question}</Typography>
          </CardContent>
          <CardActions className="answered-actions-backdrop">
            <Typography variant="caption">{timestamp}</Typography>
          </CardActions>
        </Card>
        <Stack direction="column" spacing={2} justifyContent="center">
          <TextField
            required
            label={"Answer..."}
            multiline
            rows={5}
            variant="outlined"
            value={answer}
            fullWidth
            onChange={(e) => setAnswer(e.target.value)}
          />
          <TextField
            required
            disabled
            label="ETH Payment Amount"
            type="number"
            variant="outlined"
            value={`${tokenPayAmount}`}
            onChange={handleTokenAmountChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
              inputProps: {
                step: 0.001,
              },
            }}
          />
          <Button
            disabled={answer === "" || tokenPayAmount === ""}
            className="answer-btn"
            variant="contained"
            onClick={handleOpenBackdrop}
          >
            Submit
          </Button>
        </Stack>
      </Container>

      <Backdrop
        className="backdrop-ask"
        open={open}
        onClick={handleCloseBackdrop}
      >
        <Card className="answer-card">
          <CardHeader
            avatar={
              <Avatar
                // sx={{ cursor: "pointer" }}
                src={avatar}
                // onClick={(event) => {
                //   event.stopPropagation();
                //   handleAvatarClick(user && user[0]?.twitterHandle);
                // }}
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
                  <Typography>{displayName}</Typography>
                  <Typography>{`${tokenAmount} ${tokenType}`}</Typography>
                </div>
              </>
            }
            subheader={
              <Link
                className="feed-link"
                underline="none"
                href={`https://twitter.com/${twitter}`}
                target="_blank"
                rel="noreferrer"
              >
                @{twitter}
              </Link>
            }
          ></CardHeader>
          <CardContent>
            <Typography>{question}</Typography>
          </CardContent>
          <CardActions className="answered-actions-backdrop">
            <Typography variant="caption">{timestamp}</Typography>
          </CardActions>
        </Card>
        <Card className="answer-card">
          <CardHeader title="Your Answer:" />
          <CardContent>
            <Typography>{answer}</Typography>
          </CardContent>
        </Card>

        <Button color="success" variant="contained" onClick={handleCongrats}>
          Confirm
        </Button>
      </Backdrop>

      <Backdrop open={openLoader} sx={{ zIndex: "5000" }}>
        <Loader />
      </Backdrop>

      {congrats && (
        <Congratulations handleCloseCongrats={handleCloseCongrats} answer />
      )}
      <SnackbarError
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
      />
    </>
  );
};

export default AnswerQuestion;
