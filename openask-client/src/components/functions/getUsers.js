import axios from "axios";
import { endpoint } from "../data/endpoint";

export const getUsers = async (setData) => {
  try {
    const { data } = await axios.get(`${endpoint}/users`);
    return data;
  } catch (error) {
    console.error(error);
  }
};
