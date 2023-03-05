import { ethers } from "ethers";
import { ethBountyContractABI } from "../data/ethBountyContracyABI";
import { GaslessOnboarding } from "@gelatonetwork/gasless-onboarding";

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

export async function withdrawEthPayment(
  contractAddress,
  bountyId,
  contributionId,
  setAskLoaderWithdrawText
) {
  // if (window.ethereum) {
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

    const tx = await contract.refundMyContributions(sender, bountyId, [
      contributionId,
    ]);
    setAskLoaderWithdrawText("TX in Progress...");
    console.log(`Transaction in Progress: ${tx.hash}`);

    const receipt = await tx.wait();

    console.log(receipt);
    return tx.hash;
  } catch (error) {
    console.log(error);
    throw new Error("Withdraw failed");
  }
  // } else {
  //   console.log("Please install MetaMask");
  // }
}
