import React from "react";
import { Box, Typography } from "@mui/material";

const SubmitAnswerButton = (props) => {
  const { disabled, handleEthBountyReceive } = props;
  return (
    <Box
      className={disabled ? "submit-answer-btn-disabled" : "submit-answer-btn"}
      onClick={disabled ? null : handleEthBountyReceive}
    >
      <Typography>Submit Answer</Typography>
    </Box>
  );
};

export default SubmitAnswerButton;
