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
      sx={{
        width: { md: `calc(100% - 300px)` },
        ml: { md: `300px` },
        mt: "84px",
      }}
    >
      <TableContainer sx={{ maxWidth: "100%" }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Question</TableCell>
              <TableCell align="left">Question Sensei</TableCell>
              <TableCell align="left">Answer Sensei</TableCell>
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
                <TableCell
                  sx={{ cursor: "pointer" }}
                  align="left"
                  onClick={() => handleSenseiClick(row.questionUser)}
                >
                  <Box className="tx-sensei">
                    <Avatar
                      sx={{ width: "20px", height: "20px" }}
                      src={row.userAvatar}
                    ></Avatar>
                    <Typography variant="body2">{row.displayName}</Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  align="left"
                  onClick={() => handleSenseiClick(row.answerUser)}
                >
                  <Box className="tx-sensei">
                    <Avatar
                      sx={{ width: "20px", height: "20px" }}
                      src={row.answerAvatar}
                    ></Avatar>
                    <Typography variant="body2">
                      {row.answerDisplayName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  {row.price} {row.paymentType}
                </TableCell>
                <TableCell align="left">
                  <Link
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
