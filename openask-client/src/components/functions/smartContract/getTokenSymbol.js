const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider(
  "https://mainnet.infura.io/v3/ad8bc3258461465caec6501141cb764b"
);
const wsProvider = new Web3(provider);

// ETH = 0x0000000000000000000000000000000000000000
const getTokenSymbol = async (addr) => {
  let tokenContract = new wsProvider.eth.Contract(ERC20ABI, addr);
  let symbol = await tokenContract.methods.symbol().call();
  return symbol.toUpperCase();
};

module.exports = { getTokenSymbol };
