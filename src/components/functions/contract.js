import {
  deployContractABI,
  deployContractBytecode,
} from "../data/deployContractABI";
import { tonyABI } from "../data/tokenABI";

const ethers = require("ethers");
// const provider = new ethers.getDefaultProvider(
//   "https://goerli.infura.io/v3/ad8bc3258461465caec6501141cb764b"
// );

const deployerProvider = new ethers.providers.Web3Provider(window.ethereum);
const signer = deployerProvider.getSigner();

const tokenAbi = tonyABI
const oneDay = 0x5265c00;

const tokenAddress = "0x1BB4919B12bbec20A0FcebdfAC0B7Bf9aad2Ac3B";
let contract = new ethers.Contract(tokenAddress, tokenAbi, deployerProvider);
// const address = "0x10A0FD7fb3396D2Cae703609323d655bC8ADf2B0";

export const balanceOf = async (address) => {
  try {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const balance = await contract.balanceOf(accounts[0]);
      const balanceInEther = ethers.utils.formatEther(balance);
      console.log("balanceOf: ", balanceInEther);
    } else {
      console.log("Please install MetaMask");
    }
  } catch (error) {
    console.log(error);
  }
};

// Transfer funds
const provider1 = new ethers.providers.Web3Provider(window.ethereum);

export const transferFunds = async (address, amount) => {
  let contract = new ethers.Contract(
    tokenAddress,
    tokenAbi,
    provider1.getSigner()
  );

  try {
    if (window.ethereum) {
      const tx = await contract.transfer(address, amount);
      const receipt = await tx.wait();
      console.log(tx);
      console.log(receipt);
    } else {
      console.log("Please install MetaMask");
    }
  } catch (error) {
    console.log(error);
  }
};

// Contract deployment






