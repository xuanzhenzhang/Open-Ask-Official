import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import AppProvider from "./components/context/AppProvider";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";

import { initializeApp } from "firebase/app";

// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDT15ZSVlGn7LeiKfZ1aT_U47bVgx4DiEw",
  authDomain: "open-ask-dbbe2.firebaseapp.com",
  projectId: "open-ask-dbbe2",
  storageBucket: "open-ask-dbbe2.appspot.com",
  messagingSenderId: "295827151242",
  appId: "1:295827151242:web:2e44d60787c08ca18b1073",
  measurementId: "G-K8X4BV069M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Breakpoints
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 750,
      lg: 1200,
      xl: 1536,
    },
  },
});

const App = require("./App").default;

function renderApp() {
  ReactDOM.render(
    <AppProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter
          basename={inIframe() ? window.location.pathname : undefined}
        >
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </AppProvider>,
    document.getElementById("root")
  );
}
function inIframe() {
  return window.self !== window.top;
}

async function run() {
  if (inIframe()) {
    console.log("in iframe");
    await window.FBMiniapp?.initializeAsync();
    await window.FBMiniapp?.startAppletAsync();
  }
  renderApp();
}

run();
