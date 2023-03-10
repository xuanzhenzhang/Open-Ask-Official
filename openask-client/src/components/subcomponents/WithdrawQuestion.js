import React from "react";
import { Box, Typography, CircularProgress, Card } from "@mui/material";

const WithdrawQuestion = ({ askLoaderWithdrawText }) => {
  return (
    <Card className="ask-question-container">
      <Box className="ask-question-loader">
        <CircularProgress />
        <Box className="ask-question-loader-text">
          <Typography>{askLoaderWithdrawText}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default WithdrawQuestion;
