import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Link,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import questions from "./data/questionsData";
import PriceButton from "./subcomponents/buttons/PriceButton";
import { getUsers } from "./functions/getUsers";
import axios from "axios";
import { ethers } from "../../node_modules/ethers/lib/index";
import Loader from "./subcomponents/Loader";
import { endpoint } from "./data/endpoint";

const TransactionHistory = () => {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [questions, setQuestions] = useState();

  // Get Completed Questions and Answers
  useEffect(() => {
    const getQuestions = async () => {
      try {
        const { data } = await axios
          .get(`${endpoint}/questions`)
          .catch((error) => {
            console.log(error);
          });

        // Filter out questions without answers
        const filteredData = data?.filter((question) => {
          return question.answerId;
        });

        // Set feed data
        setQuestions(filteredData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getQuestions();
  }, []);

  // Get all users
  useEffect(() => {
    getUsers().then((users) => {
      const modifiedUsers = users.map((user) => {
        if (user?.profile?.imageUrl?.startsWith("ipfs")) {
          return {
            ...user,
            profile: {
              ...user.profile,
              // https://ipfs.io/ipfs/
              imageUrl: `https://gateway.pinata.cloud/ipfs/${
                user.profile.imageUrl.split("/")[2]
              }`,
            },
          };
        } else {
          return user;
        }
      });
      setAllUsers(modifiedUsers);
    });
  }, []);

  const navigate = useNavigate();

  const handleQuestionClick = (id) => {
    navigate(`/id/${id}`);
  };
  const handleSenseiClick = (sensei) => {
    navigate(`/sensei/${sensei}`);
  };

  return (
    <Container
      className="main-container"
      sx={{
        width: { md: `calc(100% - 300px)` },
        mr: { md: `276px` },
        mt: "24px",
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <TableContainer
          sx={{ maxWidth: "100%", height: "calc(100vh - 24px)" }}
          component={Paper}
          className="content-container table-container"
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="left">Question</TableCell>
                <TableCell align="left">Asked</TableCell>
                <TableCell align="left">Answered</TableCell>
                <TableCell align="left">Price</TableCell>
                <TableCell align="left">TX Hash</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions?.map((content) => {
                const rewardTokenAmount = content.rewardTokenAmount.toString();
                const formattedTokenAmount =
                  ethers.utils.formatEther(rewardTokenAmount);
                const roundedTokenAmount = Math.min(
                  parseFloat(formattedTokenAmount).toFixed(3),
                  parseFloat(formattedTokenAmount)
                );

                const user = allUsers.find(
                  (questioner) => questioner.userId === content.questionerUid
                );
                const answer = allUsers.find(
                  (answerer) => answerer.userId === content.questioneeUid
                );

                return (
                  <TableRow key={content.questionId}>
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      component="th"
                      scope="row"
                      onClick={() => handleQuestionClick(content.questionId)}
                    >
                      {content.body}
                    </TableCell>
                    <TableCell align="left">
                      <Box className="tx-sensei">
                        <Avatar
                          src={user && user.profile.imageUrl}
                          onClick={() =>
                            handleSenseiClick(user && user.profile.handle)
                          }
                        ></Avatar>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Box className="tx-sensei">
                        <Avatar
                          src={answer && answer.profile.imageUrl}
                          onClick={() =>
                            handleSenseiClick(answer && answer.profile.handle)
                          }
                        ></Avatar>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <PriceButton
                        tokenAmount={roundedTokenAmount}
                        tokenType={
                          content.rewardTokenType ===
                          "0x0000000000000000000000000000000000000000"
                            ? "ETH"
                            : "N/A"
                        }
                        txPrice
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Link
                        className="tx-link"
                        underline="none"
                        href={`https://goerli.basescan.org/tx/${content.txHash}`}
                        target="_blank"
                      >
                        Etherscan
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default TransactionHistory;
