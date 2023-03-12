import { ethers } from "ethers";
import { ethBountyContractABI } from "../../data/ethBountyContracyABI";

const contractAddress = "0x34141bE35aC2aB6568D9cD7a23281101Fe79edb3";

export const ethBountyContract = async (
  provider,
  approvers,
  deadline,
  depositAmount,
  questionId,
  setText
) => {
  if (provider) {
    const signer = provider.getSigner();

    try {
      const contract = new ethers.Contract(
        contractAddress,
        ethBountyContractABI,
        signer
      );

      const sender = await signer.getAddress();
      const issuers = ["0x0000000000000000000000000000000000000000"];
      const data = questionId;
      const token = "0x0000000000000000000000000000000000000000";
      const tokenVersion = 0;
      //   const depositAmount = ethers.utils.parseEther("1"); // deposit amount in ether

      const transaction = await contract.issueAndContribute(
        sender,
        issuers,
        approvers,
        data,
        deadline,
        token,
        tokenVersion,
        depositAmount,
        {
          value: depositAmount,
        }
      );
      console.log(`TX Hash: ${transaction.hash}`);
      setText(`TX in Progress...`);

      // Handle the receipt
      const receipt = await transaction.wait();
      console.log(receipt);

      const bountyId = receipt.events[0].args[0].toNumber();
      console.log("Bounty ID:", bountyId);
      return transaction.hash;
    } catch (error) {
      console.log(error);
      throw new Error("Question Failed");
    }
  } else {
    throw new Error("No Ethereum Wallet Detected");
  }
};
