import React from "react";
import { CardContent, Typography } from "@mui/material";

const QuestionBody = (props) => {
  const { body, createdAt } = props;
  return (
    <>
      <CardContent sx={{ pl: "72px !important", pt: "0px !important" }}>
        <Typography>{body}</Typography>
      </CardContent>
      <CardContent className="feed-timestamp">
        {" "}
        {new Date(createdAt).toLocaleString()}
      </CardContent>
    </>
  );
};

export default QuestionBody;
