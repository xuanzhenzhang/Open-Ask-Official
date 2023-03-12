import { ethers } from "ethers";
import { ethBountyContractABI } from "../../data/ethBountyContracyABI";

export async function withdrawEthPayment(
  provider,
  contractAddress,
  bountyId,
  contributionId,
  setAskLoaderWithdrawText
) {
  if (provider) {
    const signer = provider.getSigner();
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
    throw new Error("No Ethereum Wallet Detected");
  }
}
