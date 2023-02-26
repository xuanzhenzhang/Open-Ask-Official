import axios, * as others from "axios";

export const getUsers = async (setData) => {
  try {
    const { data } = await axios.get(
      `https://us-central1-fir-quickask.cloudfunctions.net/api/users`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};
