import { useState, useEffect } from "react";
import {
  GaslessOnboarding,
  GaslessWalletConfig,
  GaslessWalletInterface,
  LoginConfig,
} from "@gelatonetwork/gasless-onboarding";

const apiKey = "BJsOkD91JES7aVales0sTJYBsRxwlofa9YsWs_y2KIjyOgdRlk41Sgfmpt8luQE52UaKp2pD9ajDNy7yjaaYQvc";
const CHAIN_ID = 5; // Replace with your desired chain ID
const RPC_URL = "https://goerli.infura.io/v3/ad8bc3258461465caec6501141cb764b"; // Replace with your desired RPC URL

function GaslessOnboardingComponent() {
  const [gaslessOnboarding, setGaslessOnboarding] = useState(null);
  const [gaslessWallet, setGaslessWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Initialize the gasless wallet configuration
    const gaslessWalletConfig = { apiKey };

    // Initialize the login configuration
    const loginConfig = {
      domains: [window.location.origin],
      chain: {
        id: CHAIN_ID,
        rpcUrl: RPC_URL,
      },
    };

    // Initialize the GaslessOnboarding object
    const gaslessOnboarding = new GaslessOnboarding(
      loginConfig,
      gaslessWalletConfig
    );

    // Initialize the GaslessOnboarding object
    gaslessOnboarding.init().then(() => {
      setGaslessOnboarding(gaslessOnboarding);
      setGaslessWallet(gaslessOnboarding.getGaslessWallet());
      setProvider(gaslessOnboarding.getProvider());
      gaslessOnboarding.getUserInfo().then((info) => {
        setUserInfo(info);
      });
    });
  }, []);

  const handleLogin = async () => {
    await gaslessOnboarding.login();
    setUserInfo(await gaslessOnboarding.getUserInfo());
  };

  const handleLogout = async () => {
    await gaslessOnboarding.logout();
    setUserInfo(null);
  };

  return (
    <div>
      <h1>Gasless Onboarding Example</h1>
      {gaslessOnboarding ? (
        <div>
          <p>
            Logged in as {userInfo?.name} ({userInfo?.email})
          </p>
          {userInfo ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default GaslessOnboardingComponent;
