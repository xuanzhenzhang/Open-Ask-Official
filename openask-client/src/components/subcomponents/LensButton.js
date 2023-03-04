import React from "react";
import { Box, Typography } from "@mui/material";

const LensButton = ({ answer, question }) => {
  const postToLens = () => {
    console.log("answer: ", answer);
    console.log("question: ", question);
    console.log(localStorage.getItem("lensAccessToken"));
  };

  return (
    <Box onClick={postToLens} className='lens-btn'>
      <Typography>Post To Lens</Typography>
    </Box>
  );
};

export default LensButton;
