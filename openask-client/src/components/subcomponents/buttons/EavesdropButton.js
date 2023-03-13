import React from "react";
import { useDispatch } from "react-redux";
import { setAccessErrorTrue } from "../../store/store";
import { Box, Typography } from "@mui/material";
import { eavesdropContract } from "../../functions/smartContract/eavesdropContract";
import axios from "axios";
import confetti from "canvas-confetti";
import { useSelector } from "react-redux";
import { endpoint } from "../../data/endpoint";

const EavesdropButton = (props) => {
  const { id, payees, setAskLoaderEavesdropText, setOpenEavesdrop, answerId } =
    props;

  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.userInfoSlice);
  const { accessToken } = userInfo;

  const provider = useSelector((state) => state.providerSlice);

  const handleEavesdrop = async () => {
    try {
      setOpenEavesdrop(true);
      const txHash = await eavesdropContract(
        provider,
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
        `${endpoint}/answer/payment/${answerId}`,
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
        dispatch(setAccessErrorTrue());
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
