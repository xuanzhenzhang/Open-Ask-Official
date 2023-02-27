import React from "react";
import { AppHeader } from "./AppHeader";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TwitterIcon from "@mui/icons-material/Twitter";

const LoginPage = ({ signInTwitter, signInGuest }) => {
  return (
    <>
      {/* <AppHeader canGoBack={false} /> */}
      <Container className="container login-container"
      sx={{
        mt: "74px"
      }}>
        <Button
          className="btn-login"
          onClick={signInTwitter}
          variant="contained"
          size="large"
          startIcon={<TwitterIcon />}
        >
          {" "}
          Sign in
        </Button>
        <Button
          className="btn-guest"
          onClick={signInGuest}
          variant="contained"
          size="large"
          // startIcon={<TwitterIcon />}
        >
          {" "}
          Continue as Guest
        </Button>
      </Container>
    </>
  );
};

export default LoginPage;
