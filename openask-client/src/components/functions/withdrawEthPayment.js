import { ethers } from "ethers";
import { deployEthContractAbi } from "../data/deployContractABI";

const deployerProvider = new ethers.providers.Web3Provider(window.ethereum);
const signer = deployerProvider.getSigner();

export async function withdrawEthPayment(contractAddress, bountyId) {
  if (window.ethereum) {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        deployEthContractAbi,
        signer
      );

      const accounts = await deployerProvider.listAccounts();
      const account = accounts[0];
      let contributionId = [0].length;

      const tx = await contract.refundContributions(
        account,
        bountyId,
        contributionId
      );
      console.log(`Transaction in Progress: ${tx.hash}`);

      const receipt = await tx.wait();

      console.log(receipt);
      return receipt;
    } catch (error) {
      throw new Error("Unauthorized Account");
    }
  } else {
    console.log("Please install MetaMask");
  }
}
