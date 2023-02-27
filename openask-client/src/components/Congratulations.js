import React from "react";
import { Button, Typography } from "@mui/material";

const Congratulations = ({
  handleCloseCongrats,
  question,
  answer,
  purchase,
}) => {
  return (
    <>
      <div className="congratulations">
        <div className="congratulations-paper">
          <Typography className="congratulations-text" variant="h2">
            Congratulations!
          </Typography>
          <Typography className="congratulations-text" variant="h5">
            {answer && "Your answer was submitted!"}
            {question && "Your question was submitted!"}
            {purchase && "The answer was purchased!"}
          </Typography>
          <Button
            variant="filled"
            className="back-btn"
            onClick={handleCloseCongrats}
          >
            Back
          </Button>
        </div>
      </div>
    </>
  );
};

export default Congratulations;
