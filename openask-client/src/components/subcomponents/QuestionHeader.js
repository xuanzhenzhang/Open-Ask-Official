import React from "react";
import { useNavigate } from "react-router-dom";
import { CardHeader, Avatar, Typography, Link, Box } from "@mui/material";
import PriceButton from "./buttons/PriceButton";
import AskSenseiButton from "./buttons/AskSenseiButton";
import { ethers } from "ethers";

const BigNumber = require("bignumber.js");

const QuestionHeader = (props) => {
  const { twitterPfp, twitterHandle, twitterDisplayName } = props;
  const { tokenAmount, tokenType } = props;
  const { onAskQuestion, senseiDisplayName } = props;
  const { price, askSensei } = props;

  const navigate = useNavigate();
  // Navigate to Sensei Detail page
  const handleAvatarClick = (twitter) => {
    navigate(`/sensei/${twitter}`);
  };

  // const etherAmount = Number(tokenAmount / 10 / Math.pow(10, 17));
  let etherAmount = 0;
  // const gweiValue = ethers.utils.parseUnits(tokenAmount.toString(), "gwei");
  // const etherAmount = ethers.utils.formatEther(gweiValue);
  if (tokenAmount) {
    etherAmount = ethers.utils.formatEther(tokenAmount.toString());
  }
  // const etherAmount = BigNumber(tokenAmount).div(BigNumber(Math.pow(10, 18)));
  // const etherAmount = 10;

  const tokenSymbol = (tokenType) => {
    if (tokenType === "0x0000000000000000000000000000000000000000") {
      return "ETH";
    }
  };

  return (
    <CardHeader
      sx={{ pt: "8px" }}
      avatar={
        <Avatar
          sx={{ cursor: "pointer", mt: "10px", width: 48, height: 48 }}
          src={twitterPfp}
          onClick={(event) => {
            event.stopPropagation();
            handleAvatarClick(twitterHandle);
          }}
        ></Avatar>
      }
      title={
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <Typography>{twitterDisplayName}</Typography>
              <Link
                className="feed-link"
                underline="none"
                href={`https://twitter.com/${twitterHandle}`}
                target="_blank"
                rel="noreferrer"
              >
                @{twitterHandle}
              </Link>
            </div>

            {price && (
              <PriceButton
                tokenAmount={etherAmount}
                tokenType={tokenSymbol(tokenType)}
              />
            )}
            {askSensei === true && (
              <AskSenseiButton
                onAskQuestion={onAskQuestion}
                senseiDisplayName={senseiDisplayName}
              />
            )}
          </div>
        </>
      }
    ></CardHeader>
  );
};

export default QuestionHeader;
