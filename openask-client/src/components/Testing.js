import React from "react";
import { Container, Button } from "@mui/material";

import { balanceOf } from "./functions/contract";
import { transferFunds } from "./functions/contract";

import { receivePayment } from "./functions/receivePayment";
import { deployContract } from "./functions/deployContract";
import { approveTokens } from "./functions/approveTokens";
import { depositToContract } from "./functions/depositToContract";
import { withdrawPayment } from "./functions/withdrawPayment";

import { tonyABI } from "./data/tokenABI";

import { ethers } from "ethers";

const address = "0x10A0FD7fb3396D2Cae703609323d655bC8ADf2B0";
const toSensei = "0xc8fB0913A8E36487710F838a08D4E66367D07924";

const transferAmount = "5";
const amount = ethers.utils.parseUnits(transferAmount, 18);
const integerAmount = amount._hex;
const tokenABI = tonyABI;

const tokenAddress = "0x1BB4919B12bbec20A0FcebdfAC0B7Bf9aad2Ac3B";
// const duration = 86400; //24 Hours
const duration = 60

const contractAddress = "0xf8e895208C77449099eDE7E6810458c8be99b9ba";

const Testing = () => {
  return (
    <Container
      sx={{
        width: { md: `calc(100% - 300px)` },
        ml: { md: `300px` },
        mt: "84px",
      }}
    >
      <Button onClick={() => balanceOf(address)}>Check Balance</Button>
      <Button onClick={() => transferFunds(toSensei, integerAmount)}>
        Transfer
      </Button>

      <Button onClick={() => deployContract(toSensei, tokenAddress, duration)}>
        Deploy Contract
      </Button>
      <Button onClick={() => approveTokens(tokenAddress, tokenABI, contractAddress, integerAmount)}>
        Approve Tokens
      </Button>
      <Button onClick={() => depositToContract(contractAddress, integerAmount)}>
        Deposit To Contract
      </Button>
      <Button onClick={() => receivePayment(contractAddress)}>
        Receive Payment
      </Button>
      <Button onClick={() => withdrawPayment(contractAddress)}>
        Withdraw
      </Button>
    </Container>
  );
};

export default Testing;
