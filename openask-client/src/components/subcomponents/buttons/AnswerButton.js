import React, { useState } from "react";
import { Box, Typography, Backdrop } from "@mui/material";
import AnswerQuestion from "../../AnswerQuestion";

const AnswerButton = (props) => {
  const {
    setOpenAnswer,
    setAnswerAvatar,
    setAnswerDisplayName,
    setAnswerHandle,
    setAnswerRewardAmount,
    setAnswerQuestion,
    setAnswerQuestionId,
    setAnswerBountyId,
  } = props;
  const {
    handle,
    avatar,
    displayName,
    rewardAmount,
    answerQuestion,
    questionId,
    bountyId,
  } = props;

  // const onAskQuestion = () => {
  //   setOpen(!open);
  // };

  // const handleCloseBackdrop = () => {
  //   setOpen(false);
  // };

  return (
    <>
      <Box
        className="question-answer-btn"
        onClick={(event) => {
          event.stopPropagation();
          setOpenAnswer(true);
          setAnswerHandle(handle);
          setAnswerAvatar(avatar);
          setAnswerDisplayName(displayName);
          setAnswerRewardAmount(rewardAmount);
          setAnswerQuestion(answerQuestion);
          setAnswerQuestionId(questionId);
          setAnswerBountyId(bountyId);
        }}
      >
        <Typography>Answer</Typography>
      </Box>
    </>
  );
};

export default AnswerButton;
