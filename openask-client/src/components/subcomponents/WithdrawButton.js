import React from "react";
import { Box, Typography } from "@mui/material";
import { withdrawEthPayment } from "../functions/withdrawEthPayment";

const WithdrawButton = (props) => {
  const { contractAddress, bountyId, contributionId } = props;
  
  const withdraw = async () => {
    const receipt = await withdrawEthPayment(
      contractAddress,
      bountyId,
      contributionId
    );
    alert("Payment Withdrawn");
  };

  return (
    <Box className="withdraw">
      <Typography>Withdraw</Typography>
    </Box>
  );
};

export default WithdrawButton;
