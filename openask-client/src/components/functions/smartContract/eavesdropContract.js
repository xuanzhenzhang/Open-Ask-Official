import { ethers } from "ethers";
import { eavesdropABI } from "../../data/eavesdropABI";

const contractAddress = "0xD836288Df42e0Df860ec683F2c78702d05eceF02";

export const eavesdropContract = async (
  provider,
  questionId,
  payees,
  setAskLoaderEavesdropText
) => {
  if (provider) {
    // const balance = await provider.getNetwork();
    // console.log(balance);

    const signer = provider.getSigner();
    try {
      const contract = new ethers.Contract(
        contractAddress,
        eavesdropABI,
        signer
      );

      let shares = [5000, 5000];

      const tx = await contract.eavesdropETH(1, payees, shares, {
        value: 1000000000000000,
      });

      console.log(`TX Hash: ${tx.hash}`);
      setAskLoaderEavesdropText(`TX in Progress...`);

      // Handle the receipt
      const receipt = await tx.wait();
      console.log(receipt);

      return tx.hash;
    } catch (error) {
      console.log(error);
      throw new Error("Contract deployment failed");
    }
  } else {
    throw new Error("No Ethereum Wallet Detected");
  }
};
