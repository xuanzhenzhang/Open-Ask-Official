import React from "react";
import { Box, Typography } from "@mui/material";

const AskSenseiButton = ({ onAskQuestion, senseiDisplayName }) => {
  return (
    <Box
      className="ask-sensei"
      onClick={(event) => {
        event.stopPropagation();
        onAskQuestion(senseiDisplayName);
      }}
    >
      <Typography>Ask Sensei</Typography>
    </Box>
  );
};

export default AskSenseiButton;
