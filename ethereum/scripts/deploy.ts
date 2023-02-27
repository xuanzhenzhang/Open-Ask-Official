const hre = require("hardhat");
const { ethers } = require("ethers");
require('dotenv').config();

async function main() {

  // Load your custom private key
  const customPrivateKey = process.env.PRIVATE_KEY;
  const customSigner = new hre.ethers.Wallet(customPrivateKey, hre.ethers.provider);

  // load wallet with 1000 eth if network is "development"
  if (hre.network.name === "development") {
      const [defaultAccount] = await hre.ethers.getSigners();
      const balance = await defaultAccount.getBalance();
      console.log("Default account balance:", ethers.utils.formatEther(balance));

      const tx = await defaultAccount.sendTransaction({
          to: customSigner.address,
          value: ethers.utils.parseEther("1000.0")
      });
      await tx.wait();
      console.log("Deployer balance:", ethers.utils.formatEther(await customSigner.getBalance()));
  }
  // Use the custom signer as the deployer
  const deployer = customSigner;

  // Get the contract factory and deploy the contract using the deployer
  const contractFactory = await hre.ethers.getContractFactory("StandardBounties");
  const contract = await contractFactory.connect(deployer).deploy();
  await contract.deployed();

  console.log("Contract deployed to address:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
