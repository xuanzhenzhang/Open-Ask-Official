import { configureStore, createSlice } from "@reduxjs/toolkit";

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: () => {
    const storedData = localStorage.getItem("openAskUserData");
    return storedData ? JSON.parse(storedData) : { user: "none" };
  },
  reducers: {
    newUserInfo: (state, action) => {
      return action.payload;
    },
  },
});

export const accessErrorSlice = createSlice({
  name: "accessError",
  initialState: false,
  reducers: {
    setAccessErrorTrue: (state) => true,
    setAccessErrorFalse: (state) => false,
  },
});

export const store = configureStore({
  reducer: {
    userInfoSlice: userInfoSlice.reducer,
    accessErrorSlice: accessErrorSlice.reducer,
  },
});

export const { newUserInfo } = userInfoSlice.actions;
export const { setAccessErrorTrue, setAccessErrorFalse } =
  accessErrorSlice.actions;
