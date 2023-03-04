import { ethers } from "ethers";
import { eavesdropABI } from "../data/eavesdropABI";

const contractAddress = "0x836f653E7F1015D9f78D50CAeC0f8c6C71075E84";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export const eavesdropContract = async (questionId, payees, setAskLoaderEavesdropText) => {
  if (window.ethereum) {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        eavesdropABI,
        signer
      );

      let shares = [5000, 5000];
      console.log(questionId, payees, shares);

      const tx = await contract
        .eavesdropEth(1, payees, shares, { value: 1000000000000000 })

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
    console.log("Please install MetaMask");
  }
};
