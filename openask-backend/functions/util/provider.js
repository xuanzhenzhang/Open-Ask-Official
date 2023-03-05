const Web3 = require("web3");

const baseUrl = "https://api-goerli.basescan.org/api";
// const goerliUrl = "https://goerli.infura.io/v3/ad8bc3258461465caec6501141cb764b";
const provider = new Web3.providers.HttpProvider(baseUrl);

module.exports = { provider };
