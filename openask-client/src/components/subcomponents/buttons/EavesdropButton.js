import React from "react";
import { Box, Typography } from "@mui/material";
import { eavesdropContract } from "../../functions/eavesdropContract";
import axios from "axios";
import confetti from "canvas-confetti";

const EavesdropButton = (props) => {
  const {
    id,
    payees,
    setAskLoaderEavesdropText,
    setOpenEavesdrop,
    answerId,
    accessToken,
    setAccessError,
  } = props;

  const handleEavesdrop = async () => {
    try {
      setOpenEavesdrop(true);
      const txHash = await eavesdropContract(
        id,
        payees,
        setAskLoaderEavesdropText
      );

      const data = await putEavesdrop(answerId);

      setOpenEavesdrop(false);

      confetti({
        zIndex: "3002",
        particleCount: 300,
        spread: 150,
        shapes: ["circle", "square"],
        origin: {
          y: 0.65,
        },
      });
      refreshPage();
    } catch (error) {
      console.log(error);
      setOpenEavesdrop(false);
      throw new Error(error);
    }
  };

  const putEavesdrop = async (answerId) => {
    try {
      const data = await axios.put(
        `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/answer/payment/${answerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("User added to Allowlist");
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

  return (
    <Box
      className="eavesdrop-btn"
      onClick={(event) => {
        event.stopPropagation();
        handleEavesdrop();
      }}
    >
      <Typography>Eavesdrop</Typography>
    </Box>
  );
};

export default EavesdropButton;
