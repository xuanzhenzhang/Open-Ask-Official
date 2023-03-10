import { ethers } from "ethers";
import { deployContractABI } from "../data/deployContractABI";

const deployerProvider = new ethers.providers.Web3Provider(window.ethereum);
const signer = deployerProvider.getSigner();

// Deposit into Contract
export const depositToContract = async (contractAddress, amount) => {
  if (window.ethereum) {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        deployContractABI,
        signer
      );

      // Call the `deposit` function on the contract
      const tx = await contract.deposit(amount);
      console.log(`Transaction in Progress: ${tx.hash}`);

      const receipt = await tx.wait();

      console.log(receipt);
      console.log(`${amount} deposited to contract`);
      // ${ethers.BigNumber.from(amount.toString()).toNumber()}
    } catch (error) {
      console.log(error.reason);
      throw new Error("Token deposit failed");
    }
  } else {
    console.log("Please install MetaMask");
  }
};
