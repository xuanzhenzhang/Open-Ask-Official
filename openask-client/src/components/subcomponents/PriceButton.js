import React from "react";
import { Box, Typography } from "@mui/material";

const PriceButton = (props) => {
  const { tokenAmount, tokenType } = props;
  return (
    <Box className="feed-price">
      <Typography>{`${tokenAmount} ${tokenType}`}</Typography>
    </Box>
  );
};

export default PriceButton;
