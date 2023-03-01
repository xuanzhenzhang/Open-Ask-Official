import React from "react";
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
import PriceButton from "./subcomponents/PriceButton";

const TransactionHistory = () => {
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
      <TableContainer sx={{ maxWidth: "100%" }} component={Paper} className="table-container">
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
            {questions?.map((row) => (
              <TableRow key={row.id}>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  component="th"
                  scope="row"
                  onClick={() => handleQuestionClick(row.id)}
                >
                  {row.question}
                </TableCell>
                <TableCell align="left">
                  <Box className="tx-sensei">
                    <Avatar
                      src={row.userAvatar}
                      onClick={() => handleSenseiClick(row.questionUser)}
                    ></Avatar>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box className="tx-sensei">
                    <Avatar
                      src={row.answerAvatar}
                      onClick={() => handleSenseiClick(row.answerUser)}
                    ></Avatar>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <PriceButton
                    tokenAmount={row.price}
                    tokenType={row.paymentType}
                    txPrice
                  />
                </TableCell>
                <TableCell align="left">
                  <Link
                    className="tx-link"
                    underline="none"
                    href={`https://etherscan.io/tx/${row.txHash}`}
                    target="_blank"
                  >
                    Etherscan
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TransactionHistory;
