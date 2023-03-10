import { ethers } from "ethers";
import { deployContractABI } from "../data/deployContractABI";
import { deployContractBytecode } from "../data/deployContractABI";

const deployerProvider = new ethers.providers.Web3Provider(window.ethereum);
const signer = deployerProvider.getSigner();

// Deploy Contract
export const deployContract = async (senseiAddress, tokenAddress, duration) => {
  if (window.ethereum) {
    try {
      const contract = new ethers.ContractFactory(
        deployContractABI,
        deployContractBytecode,
        signer
      );

      // Call the `deploy` function on the contract
      const deployedContract = await contract.deploy(
        senseiAddress,
        tokenAddress,
        duration
      );
      console.log(deployedContract);

      const receipt = await deployedContract.deployTransaction.wait();

      console.log(receipt);
      // POST Contract Address to Backend
      console.log(`Contract created: ${receipt.contractAddress}`);
      return receipt.contractAddress;
      // POST Token Address to Backend?
    } catch (error) {
      console.log(error);
      throw new Error("Contract deployment failed");
    }
  } else {
    console.log("Please install MetaMask");
  }
};
