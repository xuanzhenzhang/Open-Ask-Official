import { ethers } from "ethers";
import { ethBountyContractABI } from "../../data/ethBountyContracyABI";
import { GaslessOnboarding } from "@gelatonetwork/gasless-onboarding";

// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();
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

export const ethBountyReceiveContract = async (
  contractAddress,
  bountyId,
  answerId,
  tokenAmounts,
  setText
) => {
  const gelato = await init();
  const provider = new ethers.providers.Web3Provider(gelato);
  const signer = provider.getSigner();
  try {
    const contract = new ethers.Contract(
      contractAddress,
      ethBountyContractABI,
      signer
    );

    const sender = await signer.getAddress();
    const approverId = 0;

    const fulfillers = [sender];
    const numbers = [tokenAmounts.toString()];

    const transaction = await contract.fulfillAndAccept(
      sender,
      bountyId,
      fulfillers,
      answerId,
      approverId,
      numbers
    );

    console.log(`TX Hash: ${transaction.hash}`);
    setText(`TX in Progress...`);

    // Handle the receipt
    const receipt = await transaction.wait();
    console.log(receipt);

    return transaction.hash;
  } catch (error) {
    console.log(error);
    throw new Error("Contract deployment failed");
  }
};
