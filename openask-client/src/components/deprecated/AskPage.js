import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { deployContract } from "../functions/deployContract";
import { approveTokens } from "../functions/approveTokens";
import { depositToContract } from "../functions/depositToContract";
import { deployEthContract } from "../functions/ethContract";
import { ethMatureTime } from "../functions/ethMatureTime";
import { tonyABI } from "../data/tokenABI";
import { ethers } from "ethers";
import Loader from "../Loader";

import { Backdrop, TextField, Paper } from "@material-ui/core";
import {
  Autocomplete,
  CardContent,
  Typography,
  Box,
  Avatar,
  Select,
  Container,
  Stack,
  InputLabel,
  MenuItem,
  FormControl,
  Button,
  Card,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import confetti from "canvas-confetti";
import Congratulations from "../Congratulations";
import { getUsers } from "../functions/getUsers";
import axios, * as others from "axios";

const AskPage = ({ userInfo, accessToken, setAccessError }) => {
  const [allSenseis, setAllSenseis] = useState([]);
  const [sensei, setSensei] = useState("");
  const [senseiId, setSenseiId] = useState();
  const [question, setQuestion] = useState("");
  const [tokenType, setTokenType] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [hoursToAnswer, setHoursToAnswer] = useState("48 Hours");
  const [senseiMinimum, setSenseiMinimum] = useState(0.03); //Get from Backend
  const [contractAddress, setContractAddress] = useState();

  const [open, setOpen] = useState(false);

  const [questionContent, setQuestionContent] = useState(true);
  const [askLoader, setAskLoader] = useState(false);
  const [openDeploy, setOpenDeploy] = useState(false);
  const [openApprove, setOpenApprove] = useState(true);
  const [openDeposit, setOpenDeposit] = useState(true);

  const [congrats, setCongrats] = useState();

  const [senseiName, setSenseiName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Get all users
  useEffect(() => {
    getUsers().then((response) => {
      const filteredResponse = response.filter(
        (user) => user.userId !== userInfo?.userUid
      );
      setAllSenseis(filteredResponse);
    });
  }, []);

  // Set Sensei Name from Sensei page
  useEffect(() => {
    if (location.state) {
      const { displayName } = location?.state;
      setSenseiName(displayName);
    }
  }, []);

  // ERC 20 Contract

  // const handleCongrats = async () => {
  //   try {
  //     const tokenAmountString = tokenAmount.toString();
  //     const tokenAmountUpdated = ethers.utils.parseUnits(tokenAmountString, 18);

  //     const deployedAddress = await deployContract(
  //       "0xc8fB0913A8E36487710F838a08D4E66367D07924", // Sensei Address
  //       "0x1BB4919B12bbec20A0FcebdfAC0B7Bf9aad2Ac3B", // Token Address
  //       60 //Duration
  //     );
  //     console.log("Contract Deployed");

  //     await approveTokens(
  //       "0x1BB4919B12bbec20A0FcebdfAC0B7Bf9aad2Ac3B", //Token Address
  //       tonyABI, // Token ABI
  //       deployedAddress, //Contract Address
  //       tokenAmountUpdated //Token Amount (Smallest Unit)
  //     );
  //     console.log("Tokens Approved");

  //     await depositToContract(deployedAddress, tokenAmountUpdated);
  //     console.log("Tokens Deposited");

  //     await askQuestion(contractAddress);

  //     setCongrats(!congrats);
  //     confetti({
  //       zIndex: "3002",
  //       particleCount: 300,
  //       spread: 150,
  //       shapes: ["circle", "square"],
  //       origin: {
  //         y: 0.65,
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // ERC 20 Deploy
  const handleDeploy = async () => {
    try {
      setQuestionContent(false);
      setAskLoader(true);
      const deployedAddress = await deployContract(
        "0xc8fB0913A8E36487710F838a08D4E66367D07924", // Sensei Address
        "0x1BB4919B12bbec20A0FcebdfAC0B7Bf9aad2Ac3B", // Token Address
        86400 //Duration
      );
      setContractAddress(deployedAddress);
      console.log("Contract Deployed");
      setAskLoader(false);
      setOpenDeploy(true);
      setOpenApprove(false);
    } catch (error) {
      setAskLoader(false);
      setQuestionContent(true);
      console.log(error);
    }
  };

  // ERC 20 Approve
  const handleApprove = async () => {
    try {
      const tokenAmountString = tokenAmount.toString();
      const tokenAmountUpdated = ethers.utils.parseUnits(tokenAmountString, 18);
      setAskLoader(true);
      await approveTokens(
        "0x1BB4919B12bbec20A0FcebdfAC0B7Bf9aad2Ac3B", //Token Address
        tonyABI, // Token ABI
        contractAddress, //Contract Address
        tokenAmountUpdated //Token Amount (Smallest Unit)
      );
      console.log("Tokens Approved");
      setAskLoader(false);
      setOpenApprove(true);
      setOpenDeposit(false);
    } catch (error) {
      setAskLoader(false);
      console.log(error);
    }
  };

  // ERC 20 Deposit
  const handleDeposit = async () => {
    try {
      const tokenAmountString = tokenAmount.toString();
      const tokenAmountUpdated = ethers.utils.parseUnits(tokenAmountString, 18);
      setAskLoader(true);
      await depositToContract(contractAddress, tokenAmountUpdated);
      console.log("Tokens Deposited");

      await askQuestion(contractAddress);
      setAskLoader(false);

      setCongrats(!congrats);
      confetti({
        zIndex: "3002",
        particleCount: 300,
        spread: 150,
        shapes: ["circle", "square"],
        origin: {
          y: 0.65,
        },
      });
    } catch (error) {
      setAskLoader(false);
      console.log(error);
    }
  };

  // ETH Contract
  const handleDeployEthContract = async () => {
    try {
      setAskLoader(true);
      const tokenAmountString = tokenAmount.toString();
      const tokenAmountUpdated = ethers.utils.parseUnits(tokenAmountString, 18);

      // Find Sensei Wallet Address
      const paymentSensei = allSenseis.find((data) => {
        return data.twitterDisplayName === sensei;
      });

      const deployedAddress = await deployEthContract(
        paymentSensei.walletAddress, // Sensei Address
        tokenAmountUpdated,
        172800 //48 Hours
      );
      console.log(`Contract Deployed: ${deployedAddress}`);

      const maturityDate = await ethMatureTime(deployedAddress);
      // POST maturity date to backend

      await askQuestion(deployedAddress);
      setAskLoader(false);

      setCongrats(!congrats);
      confetti({
        zIndex: "3002",
        particleCount: 300,
        spread: 150,
        shapes: ["circle", "square"],
        origin: {
          y: 0.65,
        },
      });
    } catch (error) {
      setAskLoader(false);
      console.log(error);
    }
  };

  // Close Congrats Modal
  const handleCloseCongrats = () => {
    setCongrats(false);
    navigate("/questions");
    window.location.reload();
  };

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

  // Set token minimum blur
  const handleTokenAmountBlur = (event) => {
    if (event.target.value < senseiMinimum) {
      setTokenAmount(senseiMinimum);
    }
  };

  // Close Backdrop
  const handleCloseBackdrop = () => {
    setOpen(false);
  };

  // Open Backdrop
  const handleOpenBackdrop = () => {
    setOpen(!open);
  };

  // POST question to sensei
  const askQuestion = async (ethContractAddress) => {
    try {
      await axios.post(
        `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/question`,
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
      <Container
        sx={{
          mt: 2,
          width: { md: `calc(100% - 300px)` },
          ml: { md: `300px` },
          mt: "84px",
        }}
      >
        <Stack direction="column" spacing={2} justifyContent="center">
          <Autocomplete
            // disablePortal
            // id="combo-box-demo"
            // value={senseiName}
            options={allSenseis}
            getOptionLabel={(option) => {
              return option.twitterDisplayName;
            }}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Avatar
                  sx={{ mr: "5px" }}
                  alt={option.twitterHandle}
                  src={option.twitterPFPUrl}
                />
                {option.twitterDisplayName}
              </Box>
            )}
            inputValue={senseiName}
            onInputChange={(event, newInputValue) => {
              if (location?.state?.displayName) {
                return newInputValue === senseiName;
              }
              setSenseiName(newInputValue);
            }}
            renderInput={(params) => {
              const displayName = params?.inputProps?.value;
              const sensei = allSenseis?.find(
                (profile) => profile?.twitterDisplayName === displayName
              );

              return (
                <TextField
                  required
                  variant="outlined"
                  {...params}
                  label="Sensei"
                  onSelect={(e) => setSensei(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: sensei && (
                      <Avatar
                        sx={{ mr: "5px" }}
                        alt={sensei?.twitterHandle}
                        src={sensei?.twitterPFPUrl}
                      />
                    ),
                  }}
                />
              );
            }}
          />
          <TextField
            required
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
          <FormControl fullWidth>
            <InputLabel required>Payment Token Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tokenType}
              label="Payment Token Type"
              onChange={handleTokenTypeChange}
            >
              <MenuItem value={"ETH"}>ETH</MenuItem>
              {/* <MenuItem value={"DOGE"}>DOGE</MenuItem>
              <MenuItem value={"USDC"}>USDC</MenuItem> */}
            </Select>
          </FormControl>
          <TextField
            required
            id="outlined-number"
            label={`Token Amount (${senseiMinimum} Minimum)`}
            type="number"
            variant="outlined"
            value={tokenAmount}
            onChange={handleTokenAmountChange}
            onBlur={handleTokenAmountBlur}
            inputProps={{ min: senseiMinimum, step: "0.01" }}
          />
          <TextField
            required
            disabled
            label="Hours to Answer"
            type="Text"
            variant="outlined"
            value={hoursToAnswer}
          />
          <Button
            disabled={
              question === "" ||
              sensei === "" ||
              tokenAmount === "" ||
              tokenType === ""
            }
            variant="contained"
            onClick={handleOpenBackdrop}
          >
            Ask
          </Button>
        </Stack>
      </Container>

      <Backdrop
        className="backdrop-ask"
        open={open}
        // onClick={handleCloseBackdrop}
      >
        {/* <Paper elevation={3} className="askpage-paper"> */}
        {questionContent && (
          <Button
            sx={{ backgroundColor: "white", alignSelf: "" }}
            type="contained"
            onClick={handleCloseBackdrop}
          >
            <CloseIcon />
          </Button>
        )}
        {questionContent && (
          <>
            <Card className="askpage-card">
              <CardContent>
                <Typography align="center" variant="h5">
                  Confirm your question for{" "}
                  <span className="askpage-sensei">{sensei}</span>
                </Typography>
                <Typography align="center">
                  Cost: {tokenAmount} {tokenType}
                </Typography>
              </CardContent>
            </Card>
            <Card className="askpage-card">
              <CardContent>
                {/* <Typography
      align="center"
      variant="h5"
      sx={{ fontWeight: "700", pb: "10px" }}
    >
      Question
    </Typography>
    <Divider variant="middle" /> */}
                <Typography sx={{ pt: "10px" }}>{question}</Typography>
              </CardContent>
            </Card>
          </>
        )}
        {/* </Paper> */}
        {askLoader && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CircularProgress />
            {/* <Typography>Deploying...</Typography> */}
          </Box>
        )}

        <Box sx={{ display: "flex", gap: "25px" }}>
          {/* <Button color="success" variant="contained" onClick={handleCongrats}>
            Confirm
          </Button> */}
          {tokenType === "ETH" ? (
            <Button
              color="success"
              disabled={openDeploy}
              variant="contained"
              onClick={handleDeployEthContract}
            >
              Confirm
            </Button>
          ) : (
            <>
              <Button
                color="success"
                disabled={openDeploy}
                variant="contained"
                onClick={handleDeploy}
              >
                Deploy
              </Button>
              <Button
                color="success"
                disabled={openApprove}
                variant="contained"
                onClick={handleApprove}
              >
                Approve
              </Button>
              <Button
                color="success"
                disabled={openDeposit}
                variant="contained"
                onClick={handleDeposit}
              >
                Deposit
              </Button>
            </>
          )}
        </Box>

        {/* <Backdrop open={openLoader} sx={{ zIndex: "5000" }}>
          <Loader />
        </Backdrop> */}
      </Backdrop>
      {congrats && (
        <Congratulations handleCloseCongrats={handleCloseCongrats} question />
      )}
    </>
  );
};

export default AskPage;
