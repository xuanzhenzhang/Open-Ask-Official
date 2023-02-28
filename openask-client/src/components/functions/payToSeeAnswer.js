import axios from "axios";
import reloadPage from "./reloadPage";

export const payToSeeAnswer = async (answerId, accessToken) => {
  try {
    await axios.put(
      `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/answer/payment/${answerId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Answer Purchased!");
    // Reload Page
    reloadPage();
  } catch (error) {
    console.error(error);
  }
};
