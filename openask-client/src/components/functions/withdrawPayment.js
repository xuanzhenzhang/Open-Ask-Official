import { deployContractABI } from "../data/deployContractABI";
import { ethers } from "ethers";

const deployerProvider = new ethers.providers.Web3Provider(window.ethereum);
const signer = deployerProvider.getSigner();

export async function withdrawPayment(contractAddress) {
  if (window.ethereum) {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        deployContractABI,
        signer
      );

      const tx = await contract.withdraw();
      console.log(`Transaction in Progress: ${tx.hash}`);

      const receipt = await tx.wait();

      console.log(receipt);
    } catch (error) {
        console.log("Unauthorized Account");
        throw new Error("Unauthorized Account");
    }
  } else {
    console.log("Please install MetaMask");
  }
}
