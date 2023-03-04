const hre = require("hardhat");
const { ethers } = require("ethers");
require('dotenv').config();

async function main() {

  // Load your custom private key
  const customPrivateKey = process.env.PRIVATE_KEY;
  const deployer = new hre.ethers.Wallet(customPrivateKey, hre.ethers.provider);
//   console.log("Deployer account:", deployer.address);
//   console.log("Deployer balance:", ethers.utils.formatEther(await deployer.getBalance()));

  // load wallet with 1 eth if network is "development"
  if (hre.network.name === "development") {
    await loadDevelopmentWallet(deployer);
  }

  await deployStandardBounties(deployer);
}

async function loadDevelopmentWallet(deployer) {
    const [defaultAccount] = await hre.ethers.getSigners();
    const balance = await defaultAccount.getBalance();
//     console.log("Default account balance:", ethers.utils.formatEther(balance));

    const tx = await defaultAccount.sendTransaction({
        to: deployer.address,
        value: ethers.utils.parseEther("1.0")
    });
    await tx.wait();
//     console.log("Deployer balance:", ethers.utils.formatEther(await deployer.getBalance()));
}

async function deployStandardBounties(deployer) {
  const bountyContractFactory = await hre.ethers.getContractFactory("StandardBounties");
  const bountyContract = await bountyContractFactory.connect(deployer).deploy();
  await bountyContract.deployed();
//   console.log("StandardBounties deployed to address:", bountyContract.address);
  console.log(bountyContract.address);
  return bountyContract;
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
