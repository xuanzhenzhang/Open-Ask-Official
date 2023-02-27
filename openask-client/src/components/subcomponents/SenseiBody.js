import React from "react";
import { CardContent, Typography } from "@mui/material";

const SenseiBody = (props) => {
    const { followers, questionsAsked, twitterDescription } = props;
  return (
    <CardContent
      sx={{
        pl: "72px",
        pt: "0px",
        borderBottom: "1px solid #D6D6D6",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <Typography className="sensei-subtext" component="p">
          <span>{followers}</span>{" "}
          Followers
        </Typography>
        <Typography className="sensei-subtext" component="p">
          <span>{questionsAsked}</span> Answered
        </Typography>
      </div>
      <Typography className="sensei-description">
        {twitterDescription}
      </Typography>
    </CardContent>
  );
};

export default SenseiBody;
