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

  const eavesdropContract = await deployEavesdrop(deployer);

//   const eavesdropContract = await hre.ethers.getContractAt("Eavesdrop", "0xaE21E3f880A0eFf32e9f21a85f8B89F665E0E240");

  await initialiseEavesdropContract(deployer, eavesdropContract);
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

async function deployEavesdrop(deployer) {
  const eavesdropContractFactory = await hre.ethers.getContractFactory("Eavesdrop");
  const eavesdropContract = await eavesdropContractFactory.connect(deployer).deploy("OpenAsk Eavesdrop Payment Splitter v0.1", "EVE");
  await eavesdropContract.deployed();
//   console.log("Eavesdrop deployed to address:", eavesdropContract.address);
  console.log(eavesdropContract.address);
  return eavesdropContract;
}

async function initialiseEavesdropContract(deployer, eavesdropContract) {
  const eth = "0x0000000000000000000000000000000000000000";
  var usdc = "";
  switch (hre.network.name) {
    case "development":
      break;
    case "mainnet":
      usdc = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
      break;
    case "goerli":
      usdc = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
      break;
    case "optimism":
      usdc = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607";
      break;
    case "arbitrum":
      usdc = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
      break;
    case "base":
      break;
    case "zksync":
      break;
    default:
      usdc = "";
      break;
  }

  const ethFee = ethers.BigNumber.from("637519284958370"); // ~$1 of eth as of 2023-03-02
  const usdcFee = ethers.BigNumber.from("1000000"); // 1 USDC

  // Call the changeEavesdropFee function with the specified parameters
  const ethTx = await eavesdropContract.connect(deployer).changeEavesdropFee(eth, ethFee);
  const ethReceipt = await ethTx.wait();
//   console.log("Set Eavesdrop Fee for ETH to:", ethers.utils.formatEther(ethFee), "ETH");
//   console.log("Transaction hash:", ethReceipt.transactionHash);
  if (usdc != "") {
    const usdcTx = await eavesdropContract.connect(deployer).changeEavesdropFee(usdc, usdcFee);
    const usdcReceipt = await usdcTx.wait();
//     console.log("Set Eavesdrop Fee for USDC to:", ethers.utils.formatUnits(usdcFee, 6), "USDC");
//     console.log("Transaction hash:", usdcReceipt.transactionHash);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
