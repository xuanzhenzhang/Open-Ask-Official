// import {
//   GaslessOnboarding,
//   GaslessWalletConfig,
//   GaslessWalletInterface,
//   LoginConfig,
// } from "@gelatonetwork/gasless-onboarding";

// const init = async () => {
//   const gaslessWalletConfig = {
//     apiKey: "Q7E6fPdBQmEA9ArUXXKP_wE_m_v_Y20WkCeU5WLsmxU_",
//   };

//   const loginConfig = {
//     domains: [window.location.origin],
//     chain: {
//       id: 84531,
//       rpcUrl: "https://goerli.base.org",
//     },
//     openLogin: {
//       redirectUrl: `${window.location.origin}`,
//     },
//   };

//   const gelatoLogin = new GaslessOnboarding(loginConfig, gaslessWalletConfig);

//   await gelatoLogin.init();

//   await gelatoLogin.login();

//   const gelato = gelatoLogin.getProvider();

//   const provider = new ethers.providers.Web3Provider(gelato);
//   const signer = provider.getSigner();
//   const addr = await signer.getAddress();
//   localStorage.setItem("walletAddress", addr);
//   window.location.reload();
// };

// Connect wallet method
// const connectWallet = async () => {
//   try {
//     const { ethereum } = window;

//     if (!ethereum) {
//       console.log("Need to install MetaMask");
//       setErrorMessage(
//         "Please install MetaMask browser extension to interact."
//       );
//       return;
//     }
//     // Request account access
//     const accounts = await ethereum.request({
//       method: "eth_requestAccounts",
//     });
//     console.log("Connected", accounts[0]);
//     checkNetwork();
//     setCurrentAccount(currentAccountString(accounts[0]));
//     // const profileResponse = await profileQuery(
//     //   currentAccountString(accounts[0])
//     // );
//     // console.log("profileResponse:1!! ", profileResponse);
//     // setLensProfile(profileResponse.defaultProfile);
//     setupEventListener();
//     setUserWallet(accounts[0]);
//   } catch (error) {
//     console.log(error);
//   }
// };
