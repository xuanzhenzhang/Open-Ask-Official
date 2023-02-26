import { ethers } from "ethers";
import {
  deployEthContractAbi,
  deployEthContractBytecode,
} from "../data/deployContractABI";

const deployerProvider = new ethers.providers.Web3Provider(window.ethereum);
const signer = deployerProvider.getSigner();

export const ethMatureTime = async (contractAddress) => {
  if (window.ethereum) {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        deployEthContractAbi,
        deployerProvider
      );

      // Call the `matureTime` function on the contract
      const matureTime = await contract.matureTime();
      console.log(matureTime);
      const date = new Date(matureTime * 1000);
      const dateString = date.toLocaleString();
      console.log(dateString);

      return dateString;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to Retrieve Mature Time");
    }
  } else {
    console.log("Please install MetaMask");
  }
};
