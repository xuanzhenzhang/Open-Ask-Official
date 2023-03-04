import { ethers } from "ethers";
import { ethBountyContractABI } from "../data/ethBountyContracyABI";

const deployerProvider = new ethers.providers.Web3Provider(window.ethereum);
const signer = deployerProvider.getSigner();

export async function withdrawEthPayment(
  contractAddress,
  bountyId,
  contributionId,
  setAskLoaderWithdrawText
) {
  if (window.ethereum) {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        ethBountyContractABI,
        signer
      );

      const sender = await signer.getAddress();

      const tx = await contract.refundMyContributions(sender, bountyId, [
        contributionId,
      ]);
      setAskLoaderWithdrawText("TX in Progress...");
      console.log(`Transaction in Progress: ${tx.hash}`);

      const receipt = await tx.wait();

      console.log(receipt);
      return tx.hash;
    } catch (error) {
      console.log(error);
      throw new Error("Withdraw failed");
    }
  } else {
    console.log("Please install MetaMask");
  }
}
