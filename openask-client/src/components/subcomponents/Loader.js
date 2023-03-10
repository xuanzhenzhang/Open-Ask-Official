import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: { xs: "calc(100vh - 84px)", sm: "calc(100vh - 84px)" },
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
