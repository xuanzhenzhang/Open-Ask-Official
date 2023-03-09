import React from "react";
import { Box, Typography } from "@mui/material";

const AskButton = ({ disabled, handleDeployEthContract }) => {
  return (
    <Box
      className={disabled ? "answer-ask-btn" : "answer-ask-btn-disabled"}
      onClick={disabled ? handleDeployEthContract : null}
    >
      <Typography>Ask</Typography>
    </Box>
  );
};

export default AskButton;
