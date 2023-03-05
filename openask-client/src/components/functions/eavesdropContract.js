import { ethers } from "ethers";
import { eavesdropABI } from "../data/eavesdropABI";
import { GaslessOnboarding } from "@gelatonetwork/gasless-onboarding";

const contractAddress = "0xD836288Df42e0Df860ec683F2c78702d05eceF02";

const init = async () => {
  const gaslessWalletConfig = {
    apiKey: "Q7E6fPdBQmEA9ArUXXKP_wE_m_v_Y20WkCeU5WLsmxU_",
  };

  const loginConfig = {
    domains: [window.location.origin],
    chain: {
      id: 84531,
      rpcUrl: "https://goerli.base.org",
    },
    openLogin: {
      redirectUrl: `${window.location.origin}`,
    },
  };

  const gelatoLogin = new GaslessOnboarding(loginConfig, gaslessWalletConfig);

  await gelatoLogin.init();

  const providerGelato = gelatoLogin.getProvider();
  return providerGelato;
};

export const eavesdropContract = async (
  questionId,
  payees,
  setAskLoaderEavesdropText
) => {
  // if (window.ethereum) {
  const gelato = await init();
  const provider = new ethers.providers.Web3Provider(gelato);
  const signer = provider.getSigner();
  try {
    const contract = new ethers.Contract(contractAddress, eavesdropABI, signer);

    let shares = [5000, 5000];
    console.log(questionId, payees, shares);

    const tx = await contract.eavesdropEth(1, payees, shares, {
      value: 1000000000000000,
    });

    console.log(`TX Hash: ${tx.hash}`);
    setAskLoaderEavesdropText(`TX in Progress...`);

    // Handle the receipt
    const receipt = await tx.wait();
    console.log(receipt);

    return tx.hash;
  } catch (error) {
    console.log(error);
    throw new Error("Contract deployment failed");
  }
  // } else {
  //   console.log("Please install MetaMask");
  // }
};
