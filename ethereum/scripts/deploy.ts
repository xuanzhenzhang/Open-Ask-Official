const hre = require("hardhat");
require('dotenv').config();

async function main() {
    const [deployer] = await hre.ethers.getSigners();
//   const privateKey = process.env.PRIVATE_KEY;
    const contractFactory = await hre.ethers.getContractFactory("StandardBounties");
    const contract = await contractFactory.deploy();
    await contract.deployed();
//   const contract = await contractFactory.connect(new ethers.Wallet(privateKey)).deploy();

  console.log("Contract deployed to address:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
