import React from "react";
import { Box, Typography } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useTwitterSignIn } from "../../functions/useTwitterSignIn";
const TwitterButton = ({ sidebar }) => {
  const { signInTwitter } = useTwitterSignIn();

  return (
    <Box
      className={`twitter-btn ${sidebar && "twitter-sidebar"}`}
      onClick={() => signInTwitter(true)}
    >
      <TwitterIcon fontSize="large" />
      <Typography>Sign In</Typography>
    </Box>
  );
};

export default TwitterButton;
