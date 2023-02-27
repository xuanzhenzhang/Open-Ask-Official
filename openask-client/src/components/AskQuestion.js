import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Avatar, Typography } from "@material-ui/core";
import { Autocomplete, TextField, Chip, CircularProgress } from "@mui/material";
import { getUsers } from "./functions/getUsers";
import { useNavigate } from "react-router-dom";
import { deployEthContract } from "./functions/ethContract";
import { ethMatureTime } from "./functions/ethMatureTime";
import AskButton from "./subcomponents/AskButton";
import { ethers } from "ethers";
import confetti from "canvas-confetti";
import axios from "axios";

const AskQuestion = (props) => {
  const { userInfo, accessToken, setAccessError } = props;
  const { handleCloseBackdrop } = props;

  const [allSenseis, setAllSenseis] = useState([]);

  const [askLoader, setAskLoader] = useState(false);

  const [question, setQuestion] = useState("");
  const [sensei, setSensei] = useState();
  const [tokenType, setTokenType] = useState("ETH");
  const [tokenAmount, setTokenAmount] = useState();
  const [senseiId, setSenseiId] = useState();
  const [senseiName, setSenseiName] = useState("");

  const navigate = useNavigate();

  // Get all users
  useEffect(() => {
    getUsers().then((response) => {
      const filteredResponse = response.filter(
        (user) => user.userId !== userInfo?.userUid
      );
      setAllSenseis(filteredResponse);
    });
  }, []);

  // Set sensei ID #
  useEffect(() => {
    const questionee = allSenseis?.find((user) => {
      return user.twitterDisplayName === sensei;
    });
    setSenseiId(questionee?.userId);
  }, [sensei]);

  // Set token type
  const handleTokenTypeChange = (e) => {
    e.preventDefault();
    setTokenType(e.target.value);
  };

  // Set token amount
  const handleTokenAmountChange = (e) => {
    e.preventDefault();
    setTokenAmount(e.target.value);
  };

  // Set Sensei Name from Sensei page

  // ETH Contract
  const handleDeployEthContract = async () => {
    // Check sensei wallet address
    const paymentSensei = allSenseis.find((data) => {
      return data.twitterDisplayName === sensei;
    });

    if (paymentSensei.walletAddress) {
      try {
        setAskLoader(true);
        const tokenAmountString = tokenAmount.toString();
        const tokenAmountUpdated = ethers.utils.parseUnits(
          tokenAmountString,
          18
        );

        // // Find Sensei Wallet Address
        // const paymentSensei = allSenseis.find((data) => {
        //   return data.twitterDisplayName === sensei;
        // });

        const deployedAddress = await deployEthContract(
          paymentSensei.walletAddress, // Sensei Address
          tokenAmountUpdated, // Token Amount
          172800 //48 Hours
        );
        console.log(`Contract Deployed: ${deployedAddress}`);

        // // POST maturity date to backend
        // const maturityDate = await ethMatureTime(deployedAddress);

        await askQuestion(deployedAddress);
        setAskLoader(false);

        confetti({
          zIndex: "3002",
          particleCount: 300,
          spread: 150,
          shapes: ["circle", "square"],
          origin: {
            y: 0.65,
          },
        });
        // Clear Form
        setQuestion("");
        setSensei("");
        setTokenAmount();
        // Close Backdrop
        await handleCloseBackdrop();
        navigate("/questions");
      } catch (error) {
        setAskLoader(false);
        console.log(error);
      }
    } else {
      alert(
        "This Sensei does not have a wallet address. Please select another Sensei."
      );
    }
  };

  // POST question to sensei
  const askQuestion = async (ethContractAddress) => {
    try {
      await axios.post(
        `https://us-central1-fir-quickask.cloudfunctions.net/api/question`,
        {
          body: question,
          questioneeUid: senseiId,
          rewardTokenType: tokenType,
          rewardTokenAmount: tokenAmount,
          contractAddress: ethContractAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Question Added to Backend");
    } catch (error) {
      if (error.response.status === 403) {
        setAccessError(true);
      }
      throw new Error(error);
    }
  };

  return (
    <>
      <Card className="ask-question-container">
        {askLoader && (
          <Box className="ask-question-loader">
            <CircularProgress />
            <Typography>Continue on Metamask</Typography>
          </Box>
        )}
        {!askLoader && (
          <>
            <CardContent className="ask-question-header">
              <svg
                cursor="pointer"
                onClick={handleCloseBackdrop}
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="39"
                  height="39"
                  rx="19.5"
                  fill="#FDFDFD"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.4642 23.5355C16.1387 23.21 16.1387 22.6824 16.4642 22.357L18.8212 19.9999L16.4642 17.6429C16.1387 17.3175 16.1387 16.7898 16.4642 16.4644C16.7896 16.139 17.3172 16.139 17.6427 16.4644L19.9997 18.8214L22.3567 16.4644C22.6821 16.139 23.2098 16.139 23.5352 16.4644C23.8607 16.7898 23.8607 17.3175 23.5352 17.6429L21.1782 19.9999L23.5352 22.357C23.8607 22.6824 23.8607 23.21 23.5352 23.5355C23.2098 23.8609 22.6821 23.8609 22.3567 23.5355L19.9997 21.1784L17.6427 23.5355C17.3172 23.8609 16.7896 23.8609 16.4642 23.5355Z"
                  fill="black"
                />
                <rect
                  x="0.5"
                  y="0.5"
                  width="39"
                  height="39"
                  rx="19.5"
                  stroke="#E8E8E8"
                />
              </svg>
            </CardContent>

            {/* From */}
            <CardContent className="ask-question-from">
              <Typography className="ask-question-text">from: </Typography>
              <Avatar
                className="ask-question-avatar"
                alt={userInfo.twitterHandle}
                src={userInfo.twitterPFPUrl}
              />
              <Typography> {userInfo.twitterDisplayName}</Typography>
            </CardContent>

            {/* To */}
            <CardContent className="ask-question-from">
              <Typography className="ask-question-text">to: </Typography>
              <Autocomplete
                className="ask-question-autocomplete"
                options={allSenseis}
                getOptionLabel={(option) => {
                  return option.twitterDisplayName;
                }}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Avatar
                      className="ask-question-avatar"
                      alt={option.twitterHandle}
                      src={option.twitterPFPUrl}
                    />
                    {option.twitterDisplayName}
                  </Box>
                )}
                inputValue={senseiName}
                onInputChange={(event, newInputValue) => {
                  //   if (location?.state?.displayName) {
                  //     return newInputValue === senseiName;
                  //   }
                  setSenseiName(newInputValue);
                }}
                renderInput={(params) => {
                  const displayName = params?.inputProps?.value;
                  const sensei = allSenseis?.find(
                    (profile) => profile?.twitterDisplayName === displayName
                  );

                  return (
                    <TextField
                      className="ask-question-autocomplete-textfield"
                      required
                      size="small"
                      variant="outlined"
                      {...params}
                      label="Sensei"
                      onSelect={(e) => setSensei(e.target.value)}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: sensei && (
                          <Avatar
                            className="ask-question-avatar"
                            alt={sensei?.twitterHandle}
                            src={sensei?.twitterPFPUrl}
                          />
                        ),
                      }}
                    />
                  );
                }}
              />
            </CardContent>
            <CardContent className="ask-question-from">
              <TextField
                className="ask-question-autocomplete-textfield"
                required
                fullWidth
                label={
                  sensei
                    ? `What is your question for ${sensei}?`
                    : "What is your question for the Sensei?"
                }
                multiline
                minRows={4}
                variant="outlined"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </CardContent>
            <CardContent className="ask-question-footer">
              <TextField
                className="ask-question-autocomplete-textfield"
                required
                size="small"
                id="outlined-number"
                label={`Token Amount`}
                type="number"
                variant="outlined"
                value={tokenAmount}
                onChange={handleTokenAmountChange}
                inputProps={{ min: 0.01, step: "0.01" }}
              />
              <Chip
                // icon={

                // }
                sx={{ marginRight: "auto" }}
                label="ETH"
                variant="outlined"
              />
              <AskButton
                disabled={tokenAmount > 0 && sensei && question ? true : false}
                handleDeployEthContract={handleDeployEthContract}
              />
            </CardContent>
          </>
        )}
      </Card>
    </>
  );
};

export default AskQuestion;
