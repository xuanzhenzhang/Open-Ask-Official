import { ethers } from "ethers";
import confetti from "canvas-confetti";
import { payToSeeAnswer } from "./payToSeeAnswer";
import reloadPage from "./reloadPage";

export const payForAnswer = async (
  accessToken,
  id,
  answerId,
  toAddress,
  tokenAmount
) => {
  try {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const fromAddress = accounts[0];

      const result = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: fromAddress,
            to: toAddress,
            value: ethers.utils.parseEther(tokenAmount).toString(),
          },
        ],
      });

      console.log(`Transaction successful: ${result}`);
      // Confetti
      confetti({
        zIndex: "3002",
        particleCount: 300,
        spread: 150,
        shapes: ["circle", "square"],
        origin: {
          y: 0.65,
        },
      });

      // Post Request
      await payToSeeAnswer(answerId, accessToken);

      // Resolve the promise
      // return Promise.resolve();
    } else {
      console.log("MetaMask not detected");
      // reject(new Error("MetaMask not detected"));
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
    return Promise.reject(error);
  }
};
