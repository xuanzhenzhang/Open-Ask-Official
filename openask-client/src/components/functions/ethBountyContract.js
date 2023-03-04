import { ethers } from "ethers";
import {
  ethBountyContractABI,
} from "../data/ethBountyContracyABI";
import { Web3Auth } from "@web3auth/modal";
const web3auth = new Web3Auth({
  uiConfig: {
    appLogo: "https://images.web3auth.io/web3auth-logo-w.svg",
    theme: "light",
    loginMethodsOrder: ["twitter"],
    defaultLanguage: "en",
  },
  clientId:
    "BJsOkD91JES7aVales0sTJYBsRxwlofa9YsWs_y2KIjyOgdRlk41Sgfmpt8luQE52UaKp2pD9ajDNy7yjaaYQvc", // Get your Client ID from Web3Auth Dashboard
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x5", // Please use 0x5 for Goerli Testnet
  },
});

const contractAddress = "0x5AE8138B79ad83184Eb484Ba3C0889F297820482";
const provider = new ethers.providers.Web3Provider(window.ethereum);
// const provider = new ethers.providers.Web3Provider(web3auth.provider);

const signer = provider.getSigner();

export const ethBountyContract = async (
  approvers,
  deadline,
  depositAmount,
  questionId,
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
      throw new Error("Contract deployment failed");
    }
  } else {
    console.log("Please install MetaMask");
  }
};
