const Web3 = require("web3");

const baseUrl = "https://goerli.base.org";
// const goerliUrl = "https://goerli.infura.io/v3/ad8bc3258461465caec6501141cb764b";
const provider = new Web3.providers.HttpProvider(baseUrl);

module.exports = { provider };
