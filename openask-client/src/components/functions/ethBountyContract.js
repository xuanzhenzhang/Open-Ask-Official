import { ethers } from "ethers";
import { ethBountyContractABI } from "../data/ethBountyContracyABI";
import { GaslessOnboarding } from "@gelatonetwork/gasless-onboarding";

const contractAddress = "0x5AE8138B79ad83184Eb484Ba3C0889F297820482";

const init = async () => {
  const gaslessWalletConfig = {
    apiKey: "Q7E6fPdBQmEA9ArUXXKP_wE_m_v_Y20WkCeU5WLsmxU_",
  };

  const loginConfig = {
    domains: [window.location.origin],
    chain: {
      id: 5,
      rpcUrl: "https://goerli.infura.io/v3/ad8bc3258461465caec6501141cb764b",
    },
    openLogin: {
      redirectUrl: `${window.location.origin}`,
    },
  };

  const gelatoLogin = new GaslessOnboarding(loginConfig, gaslessWalletConfig);

  await gelatoLogin.init();

  const providerGelato = gelatoLogin.getProvider();
  return providerGelato
};

export const ethBountyContract = async (
  approvers,
  deadline,
  depositAmount,
  questionId,
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
    const issuers = ["0x0000000000000000000000000000000000000000"];
    const data = questionId;
    const token = "0x0000000000000000000000000000000000000000";
    const tokenVersion = 0;
    //   const depositAmount = ethers.utils.parseEther("1"); // deposit amount in ether

    const transaction = await contract.issueAndContribute(
      sender,
      issuers,
      approvers,
      data,
      deadline,
      token,
      tokenVersion,
      depositAmount,
      {
        value: depositAmount,
      }
    );
    console.log(`TX Hash: ${transaction.hash}`);
    setText(`TX in Progress...`);

    // Handle the receipt
    const receipt = await transaction.wait();
    console.log(receipt);

    const bountyId = receipt.events[0].args[0].toNumber();
    console.log("Bounty ID:", bountyId);
    return transaction.hash;
  } catch (error) {
    console.log(error);
    throw new Error("Question Failed");
  }
};
