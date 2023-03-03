const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider(
  "https://goerli.infura.io/v3/ad8bc3258461465caec6501141cb764b"
);

module.exports = { provider };
