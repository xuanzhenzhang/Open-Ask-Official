import { ethers } from "ethers";
import {
  deployEthContractAbi,
  deployEthContractBytecode,
} from "../data/deployContractABI";

const deployerProvider = new ethers.providers.Web3Provider(window.ethereum);
const signer = deployerProvider.getSigner();

export const deployEthContract = async (sensei, ethAmount, duration, questionId, secret, setText) => {
  if (window.ethereum) {
    try {
      const contract = new ethers.ContractFactory(
        deployEthContractAbi,
        deployEthContractBytecode,
        signer
      );

      const agent = await signer.getAddress();

      // Call the `deploy` function on the contract
      const deployedContract = await contract.deploy(agent, sensei, duration, questionId, secret, {
        value: ethAmount,
      });
      console.log(`TX Hash: ${deployedContract.deployTransaction.hash}`);
      setText(`TX in Progress...`)

      const receipt = await deployedContract.deployTransaction.wait();

      // POST Contract Address to Backend
      console.log(`Contract created: ${receipt.contractAddress}`);
      return receipt.contractAddress;
    } catch (error) {
      console.log(error);
      throw new Error("Contract deployment failed");
    }
  } else {
    console.log("Please install MetaMask");
  }
};
