import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
} from "@mui/material";
import { getUsers } from "../functions/getUsers";
import { useNavigate } from "react-router-dom";
import { ethBountyContract } from "../functions/smartContract/ethBountyContract";
import AskButton from "./buttons/AskButton";
import confetti from "canvas-confetti";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setAccessErrorTrue } from "../store/store";
import { endpoint } from "../data/endpoint";

const AskQuestion = (props) => {
  const { handleCloseBackdrop } = props;
  const { askedSensei } = props;

  const [allSenseis, setAllSenseis] = useState([]);

  const [askLoader, setAskLoader] = useState(false);
  const [askLoaderText, setAskLoaderText] = useState("Continue on Wallet");

  const [question, setQuestion] = useState("");
  const [sensei, setSensei] = useState();
  const [tokenType, setTokenType] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [tokenAmount, setTokenAmount] = useState();
  const [senseiId, setSenseiId] = useState();
  const [senseiName, setSenseiName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.userInfoSlice);
  const { accessToken } = userInfo;

  const provider = useSelector((state) => state.providerSlice);

  // Set Sensei Name if Available
  useEffect(() => {
    if (askedSensei) {
      setSenseiName(askedSensei);
    }
  }, [askedSensei]);

  // Get all users
  useEffect(() => {
    let isMounted = true;
    getUsers().then((users) => {
      const modifiedUsers = users.map((user) => {
        if (user?.profile?.imageUrl?.startsWith("ipfs")) {
          return {
            ...user,
            profile: {
              ...user.profile,
              imageUrl: `https://ipfs.io/ipfs/${
                user.profile.imageUrl.split("/")[2]
              }`,
            },
          };
        } else {
          return user;
        }
      });
      const filteredResponse = modifiedUsers.filter(
        (user) => user.userId !== userInfo?.userUid
      );
      if (isMounted) {
        setAllSenseis(filteredResponse);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Set sensei ID #
  useEffect(() => {
    if (sensei) {
      const questionee = allSenseis?.find((user) => {
        return user.profile.displayName === sensei;
      });
      setSenseiId(questionee?.userId);
    } else if (senseiName) {
      const questionee = allSenseis?.find((user) => {
        return user.profile.displayName === senseiName;
      });
      setSenseiId(questionee?.userId);
    } else if (askedSensei && allSenseis) {
      const questionee = allSenseis?.find((user) => {
        return user.profile.displayName === askedSensei;
      });
    }
  }, [sensei, senseiName, askedSensei]);

  // // Set token type
  // const handleTokenTypeChange = (e) => {
  //   e.preventDefault();
  //   setTokenType(e.target.value);
  // };

  // Set token amount
  const handleTokenAmountChange = (e) => {
    e.preventDefault();
    setTokenAmount(e.target.value);
  };

  // Refresh Page
  function refreshPage() {
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
  //Clear Form
  const clearForm = () => {
    setQuestion("");
    setSensei("");
    setTokenAmount("");
  };

  // NEW ETH Contract
  const handleEthBountyContract = async () => {
    // Check sensei wallet address
    const paymentSensei = allSenseis.find((data) => {
      if (sensei) {
        return data.profile.displayName === sensei;
      } else if (askedSensei) {
        const questionee = allSenseis?.find((user) => {
          return user.profile.displayName === askedSensei;
        });
        setSenseiId(questionee.userId);
        return data.profile.displayName === senseiName;
      }
    });

    if (paymentSensei.walletAddress) {
      try {
        setAskLoader(true);
        const tokenAmountBackend = Number(tokenAmount * Math.pow(10, 18));

        const bountyToken = tokenAmountBackend.toString();

        const data = await askQuestion(tokenAmountBackend);

        const currentTimestamp = Math.floor(Date.now() / 1000);
        const futureTimestamp = currentTimestamp + 172800; // 48 Hours

        // Add Bounty
        const txHash = await ethBountyContract(
          provider, // Provider
          [`${paymentSensei.walletAddress}`], // Sensei Address
          futureTimestamp, //48 Hours
          bountyToken, // Token Amount
          data.data.questionId, // Data
          setAskLoaderText // Set Loader Text
        );

        console.log(`TX Hash: ${txHash}`);

        // Update Question with TX Hash
        await updateQuestion(txHash);

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
        clearForm();
        // Close Backdrop
        await handleCloseBackdrop();
        if (location.pathname === "/questions") {
          refreshPage();
        } else {
          navigate("/questions");
        }
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
  const askQuestion = async (tokenAmountBackend) => {
    try {
      const data = await axios.post(
        `${endpoint}/question`,
        {
          body: question,
          questioneeUid: senseiId,
          rewardTokenType: tokenType,
          rewardTokenAmount: tokenAmountBackend,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Question Posted to Backend");
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 403) {
        dispatch(setAccessErrorTrue());
      }
      throw new Error(error);
    }
  };
  // PUT question to sensei
  const updateQuestion = async (txHash) => {
    try {
      const data = await axios.put(
        `${endpoint}/question/${txHash}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("TX hash added to Backend.");
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.status === 403) {
        dispatch(setAccessErrorTrue());
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
            <Box className="ask-question-loader-text">
              <Typography>{askLoaderText}</Typography>
            </Box>
          </Box>
        )}
        {!askLoader && (
          <>
            <CardContent className="ask-question-header">
              <svg
                cursor="pointer"
                onClick={() => {
                  handleCloseBackdrop();
                  clearForm();
                }}
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
                alt={userInfo?.profile?.handle}
                src={userInfo?.profile?.imageUrl}
              />
              <Typography> {userInfo?.profile?.displayName}</Typography>
            </CardContent>

            {/* To */}
            <CardContent className="ask-question-from">
              <Typography className="ask-question-text">to: </Typography>
              <Autocomplete
                className="ask-question-autocomplete"
                options={allSenseis}
                getOptionLabel={(option) => {
                  return option.profile.displayName;
                }}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Avatar
                      className="ask-question-avatar"
                      alt={option.profile.displayName}
                      src={option.profile.imageUrl}
                    />
                    {option.profile.displayName}
                  </Box>
                )}
                inputValue={senseiName}
                onInputChange={(event, newInputValue) => {
                  if (askedSensei) {
                    return newInputValue === askedSensei;
                  } else {
                    setSenseiName(newInputValue);
                  }
                }}
                renderInput={(params) => {
                  const displayName = params?.inputProps?.value;
                  const sensei = allSenseis?.find(
                    (sensei) => sensei?.profile.displayName === displayName
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
                            alt={sensei?.profile.handle}
                            src={sensei?.profile.imageUrl}
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
                // id="outlined-number"
                label={`Token Amount`}
                type="number"
                variant="outlined"
                value={tokenAmount}
                onChange={handleTokenAmountChange}
                inputProps={{ min: 0.01, step: "0.01" }}
              />
              <Box className="feed-price">
                {/* {ethereumSVG} */}
                <Typography>ETH</Typography>
              </Box>
              <AskButton
                disabled={
                  tokenAmount > 0 && senseiName && question ? true : false
                }
                handleDeployEthContract={handleEthBountyContract}
              />
            </CardContent>
          </>
        )}
      </Card>
    </>
  );
};

export default AskQuestion;
