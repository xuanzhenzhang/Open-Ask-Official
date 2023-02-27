import React from "react";
import { Alert, Snackbar } from "@mui/material";

const SnackbarError = ({snackbarOpen, setSnackbarOpen}) => {

  // Close Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={5000}
      onClose={handleSnackbarClose}
    >
      <Alert onClose={handleSnackbarClose} severity="error">
        Unauthorized Metamask Account
      </Alert>
    </Snackbar>
  );
};

export default SnackbarError;
