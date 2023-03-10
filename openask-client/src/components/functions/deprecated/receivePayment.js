import { deployContractABI } from "../data/deployContractABI";
import { ethers } from "ethers";

const deployerProvider = new ethers.providers.Web3Provider(window.ethereum);
const signer = deployerProvider.getSigner();

// Sensei Receive Payment
export async function receivePayment(contractAddress) {
  if (window.ethereum) {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        deployContractABI,
        signer
      );

      // Get the balance of tokens held in the contract
      //   const balance = await contract.balanceOf(contract.address);
      //   if (balance.isZero()) {
      //     console.log("No tokens to receive from escrow");
      //     return;
      //   }

      // Call the `receivePayment` function on the contract
      const tx = await contract.receivePayment();
      console.log(`Transaction in Progress: ${tx.hash}`);

      const receipt = await tx.wait();

      console.log(receipt);
      console.log(`Transaction hash: ${receipt.transactionHash}`);
      console.log("Payment Received");
    } catch (error) {
      console.log(error);
      throw new Error("Unauthorized Account");
    }
  } else {
    console.log("Please install MetaMask");
  }
}
