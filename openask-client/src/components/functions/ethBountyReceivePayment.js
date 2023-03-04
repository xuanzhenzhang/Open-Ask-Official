import { ethers } from "ethers";
import {
  ethBountyContractABI,
} from "../data/ethBountyContracyABI";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export const ethBountyReceiveContract = async (
  contractAddress,
  bountyId,
  answerId,
  tokenAmounts,
  setText
) => {
  if (window.ethereum) {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        ethBountyContractABI,
        signer
      );

      const sender = await signer.getAddress();
      const approverId = 0;

      const fulfillers = [sender];
      const numbers = [tokenAmounts.toString()];

      const transaction = await contract.fulfillAndAccept(
        sender,
        bountyId,
        fulfillers,
        answerId,
        approverId,
        numbers
      );

      console.log(`TX Hash: ${transaction.hash}`);
      setText(`TX in Progress...`);

      // Handle the receipt
      const receipt = await transaction.wait();
      console.log(receipt);

      return transaction.hash;
    } catch (error) {
      console.log(error);
      throw new Error("Contract deployment failed");
    }
  } else {
    console.log("Please install MetaMask");
  }
};
