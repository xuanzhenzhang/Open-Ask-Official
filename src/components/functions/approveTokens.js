import { ethers } from "ethers";

const deployerProvider = new ethers.providers.Web3Provider(window.ethereum);
const signer = deployerProvider.getSigner();

// Approve tokens to be spent by contract
export const approveTokens = async (
  tokenAddress,
  tokenABI,
  contractAddress,
  amount
) => {

  if (window.ethereum) {
    try {
      const token = new ethers.Contract(tokenAddress, tokenABI, signer);

      const approvalTx = await token.approve(contractAddress, amount);
      console.log(approvalTx);

      const approvalReceipt = await approvalTx.wait();

      console.log(approvalReceipt);
      console.log(
        `Approved ${amount} tokens for the escrow contract`
      );
      //ethers.BigNumber.from(amount.toString()).toNumber()
    } catch (error) {
      console.log(error);
      throw new Error("Token Approval failed");
    }
  } else {
    console.log("Please install MetaMask");
  }
};
