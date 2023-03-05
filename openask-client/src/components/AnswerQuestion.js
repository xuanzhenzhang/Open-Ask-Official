import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
} from "@material-ui/core";
import { TextField, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import axios from "axios";
import PriceButton from "./subcomponents/PriceButton";
import SubmitAnswerButton from "./subcomponents/SubmitAnswerButton";
import { ethBountyReceiveContract } from "./functions/ethBountyReceivePayment";

const AnswerQuestion = (props) => {
  const { userInfo, accessToken, setAccessError } = props;
  const { handleCloseBackdrop } = props;
  const {
    handle,
    avatar,
    displayName,
    rewardAmount,
    answerQuestion,
    questionId,
    bountyId,
  } = props;

  const [answer, setAnswer] = useState();

  const [askLoader, setAskLoader] = useState(false);
  const [askLoaderText, setAskLoaderText] = useState("Continue on Metamask");

  const navigate = useNavigate();
  const location = useLocation();
  const etherAmount = rewardAmount / 10 / 10 ** 17;

  const handleEthBountyReceive = async () => {
    try {
      const contractAddress = "0x34141bE35aC2aB6568D9cD7a23281101Fe79edb3";
      setAskLoader(true);
      // const tokenAmountString = rewardAmount.toString();
      // const tokenAmountUpdated = ethers.utils.parseUnits(
      //   tokenAmountString,
      //   18
      // );
      // const tokenAmountBackend = rewardAmount * 10 ** 18;

      // Add Answer to Backend
      const data = await postAnswer(questionId);

      // Receive Bounty
      const txHash = await ethBountyReceiveContract(
        contractAddress,
        bountyId,
        data.data.answerId,
        rewardAmount,
        setAskLoader
      );

      console.log(`TX Hash: ${txHash}`);

      // Update Answer with TX Hash
      await putAnswer(txHash);

      setAskLoader(false);

      confetti({
        zIndex: "3002",
        particleCount: 300,
        spread: 150,
        shapes: ["circle", "square"],
        origin: {
          y: 0.65,
        },
      });
      // Clear Form
      clearForm();
      // Close Backdrop
      await handleCloseBackdrop();
      refreshPage();
    } catch (error) {
      setAskLoader(false);
      console.log(error);
    }
  };

  // Post unauthorized answer to backend
  const postAnswer = async (questionId) => {
    try {
      const data = await axios.post(
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
      console.log("Answer Posted to Backend.");
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 403) {
        setAccessError(true);
      }
      throw new Error(error);
    }
  };
  // PUT authorized answer to backend
  const putAnswer = async (txHash) => {
    try {
      const data = await axios.put(
        `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/answer/${txHash}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Answer TX Hash added to Backend.");
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 403) {
        setAccessError(true);
      }
      throw new Error(error);
    }
  };

  // Refresh Page
  function refreshPage() {
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
  //Clear Form
  const clearForm = () => {
    setAnswer("");
  };

  return (
    <Card className='ask-question-container'>
      {askLoader && (
        <Box className='ask-question-loader'>
          <CircularProgress />
          <Box className='ask-question-loader-text'>
            <Typography>{askLoaderText}</Typography>
          </Box>
        </Box>
      )}
      {!askLoader && (
        <>
          <CardContent className='ask-question-header'>
            <svg
              cursor='pointer'
              onClick={handleCloseBackdrop}
              width='40'
              height='40'
              viewBox='0 0 40 40'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <rect
                x='0.5'
                y='0.5'
                width='39'
                height='39'
                rx='19.5'
                fill='#FDFDFD'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M16.4642 23.5355C16.1387 23.21 16.1387 22.6824 16.4642 22.357L18.8212 19.9999L16.4642 17.6429C16.1387 17.3175 16.1387 16.7898 16.4642 16.4644C16.7896 16.139 17.3172 16.139 17.6427 16.4644L19.9997 18.8214L22.3567 16.4644C22.6821 16.139 23.2098 16.139 23.5352 16.4644C23.8607 16.7898 23.8607 17.3175 23.5352 17.6429L21.1782 19.9999L23.5352 22.357C23.8607 22.6824 23.8607 23.21 23.5352 23.5355C23.2098 23.8609 22.6821 23.8609 22.3567 23.5355L19.9997 21.1784L17.6427 23.5355C17.3172 23.8609 16.7896 23.8609 16.4642 23.5355Z'
                fill='black'
              />
              <rect
                x='0.5'
                y='0.5'
                width='39'
                height='39'
                rx='19.5'
                stroke='#E8E8E8'
              />
            </svg>
          </CardContent>
          {/* From */}
          <CardContent className='ask-question-from'>
            <Typography className='ask-question-text'>from: </Typography>
            <Avatar className='ask-question-avatar' alt={handle} src={avatar} />
            <Typography> {displayName}</Typography>
            <PriceButton tokenAmount={etherAmount} tokenType='ETH' />
          </CardContent>
          <CardContent className='answer-question-question'>
            <Typography>{answerQuestion}</Typography>
          </CardContent>
          <Divider variant='middle' />
          <CardContent className='answer-question-body'>
            <TextField
              className='ask-question-autocomplete-textfield'
              required
              fullWidth
              label='Your answer...'
              multiline
              minRows={4}
              variant='outlined'
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </CardContent>
          <CardContent className='answer-question-footer'>
            <SubmitAnswerButton
              disabled={answer ? false : true}
              handleEthBountyReceive={handleEthBountyReceive}
            />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default AnswerQuestion;
