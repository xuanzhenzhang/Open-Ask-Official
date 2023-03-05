const Web3 = require("web3");
const { ethers } = require("ethers");

const baseUrl = "https://goerli.base.org";
// const goerliUrl = "https://goerli.infura.io/v3/ad8bc3258461465caec6501141cb764b";
const provider = new Web3.providers.HttpProvider(baseUrl);

const ethersProvider = new ethers.JsonRpcProvider(baseUrl);

module.exports = { ethersProvider, provider };
