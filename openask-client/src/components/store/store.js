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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["provider/ethereumProvider"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["provider", "providerSlice"],
      },
    }),
});

export const { newUserInfo } = userInfoSlice.actions;
export const { setAccessErrorTrue, setAccessErrorFalse } =
  accessErrorSlice.actions;
export const { ethereumProvider } = providerSlice.actions;
