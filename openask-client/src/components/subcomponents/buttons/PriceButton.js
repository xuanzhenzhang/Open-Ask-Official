import React from "react";
import { Box, Typography } from "@mui/material";
import { ethereumSVG } from "../VectorSVGs";

const PriceButton = (props) => {
  const { tokenAmount, tokenType } = props;
  const { txPrice } = props;

  return (
    <Box className={`feed-price ${txPrice ? "tx-price" : ""}`}>
      {ethereumSVG}
      <Typography>{`${tokenAmount} ${tokenType}`}</Typography>
    </Box>
  );
};

export default PriceButton;
