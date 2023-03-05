import React from "react";
import TwitterButton from "./subcomponents/TwitterButton";
import { Card, Box } from "@mui/material";

const LoginPage = ({ signInTwitter }) => {
  return (
    <>
      <Card>
        <Card className="ask-question-container">
          <Box className="ask-question-loader">
            <TwitterButton signInTwitter={signInTwitter} />
          </Box>
        </Card>
      </Card>
    </>
  );
};

export default LoginPage;
