const { ethers } = require("ethers");

// import { ethers } from "ethers";

const escrowAbi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_secret",
        type: "string",
      },
    ],
    name: "receivePayment",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_agent",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "_sensei",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_quesitonId",
        type: "string",
      },
      {
        internalType: "string",
        name: "_secret",
        type: "string",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "deposits",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "matureTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "questionId",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const apiKey = "5GXAG3VT5G5PFS8V9HHTHTP1NK4C2ESRAX";
// const deployerProvider = new ethers.EtherscanProvider("goerli", apiKey);
const { ethersProvider } = require("./provider");

const getEscrowQuestionId = async (contractAddress) => {
  try {
    const contract = new ethers.Contract(
      contractAddress,
      escrowAbi,
      // deployerProvider
      ethersProvider
    );

    // Call the `matureTime` function on the contract
    const questionId = await contract.questionId();
    return questionId;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getEscrowQuestionId };
