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

export const providerSlice = createSlice({
  name: "provider",
  initialState: null,
  reducers: {
    ethereumProvider: (state, action) => {
      console.log(action);
      return action.payload;
    },
  },
});

export const store = configureStore({
  reducer: {
    userInfoSlice: userInfoSlice.reducer,
    accessErrorSlice: accessErrorSlice.reducer,
    providerSlice: providerSlice.reducer,
  },
});

export const { newUserInfo } = userInfoSlice.actions;
export const { setAccessErrorTrue, setAccessErrorFalse } =
  accessErrorSlice.actions;
export const { ethereumProvider } = providerSlice.actions;
