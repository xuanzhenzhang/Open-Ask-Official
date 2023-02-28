import axios, * as others from "axios";

export const getUsers = async (setData) => {
  try {
    const { data } = await axios.get(
      `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/users`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};
