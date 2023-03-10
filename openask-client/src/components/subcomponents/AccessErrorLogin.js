import React from "react";
import { useSelector } from "react-redux";
import { Backdrop, Card, CardContent, Typography, Box } from "@mui/material";
import TwitterButton from "./buttons/TwitterButton";
import { accessErrorLogo } from "../data/VectorSVGs";

const AccessErrorLogin = () => {
  const accessError = useSelector((state) => state.accessErrorSlice);

  return (
    <>
      <Backdrop sx={{ zIndex: "5000" }} open={accessError}>
        <Card className="access-error-container">
          <CardContent>
            <Box className="access-error-logo">{accessErrorLogo}</Box>
          </CardContent>
          <CardContent>
            <Typography className="access-error-text">
              You have been signed out. <br />
              Please sign in again to continue.
            </Typography>
          </CardContent>
          <CardContent>
            <Box className="access-error-btn">
              <TwitterButton />
            </Box>
          </CardContent>
        </Card>
      </Backdrop>
    </>
  );
};

export default AccessErrorLogin;
