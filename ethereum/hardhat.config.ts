import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
          {
            version: "0.5.12"
          },
          {
            version: "0.8.17"
          }
        ]
    },
    etherscan: {
      apiKey: {
        goerli: process.env.ETHERSCAN_API_KEY,
        scroll_alpha: process.env.SCROLL_API_KEY,
      },
      customChains: [
          {
            network: "scroll_alpha",
            chainId: 534353,
            urls: {
              apiURL: "https://blockscout.scroll.io/api",
              browserURL: "https://blockscout.scroll.io/"
            }
          }
        ]
    },
    networks: {
      development: {
              url: "http://127.0.0.1:8545/",
    //            logLevel: "debug",
      },
      goerli: {
        url: process.env.GOERLI_URL || "",
        accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      },
      ropsten: {
        url: process.env.ROPSTEN_URL || "",
        accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      },
      scroll_alpha: {
        url: process.env.SCROLL_TESTNET_URL || "",
        accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      },
      scroll_prealpha: {
        url: process.env.SCROLL_PREALPHA_TESTNET_URL || "",
        accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      },
      optimism: {
        url: process.env.OPTIMISM_MAINNET_URL || "",
        accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      },
      // for testnet
      optimism_goerli: {
        url: process.env.OPTIMISM_GOERLI_URL || "",
        accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      },
      // for the local dev environment
      optimism_local: {
        url: process.env.OPTIMISM_LOCAL_URL || "",
        accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      },
      base: {
        url: process.env.BASE_URL || "",
        accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      },
    },
};

export default config;
