import React from "react";
import { CardHeader, Avatar, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HeaderCard = (props) => {
  const {
    questionId,
    twitterPFP,
    twitterHandle,
    twitterDisplayName,
    tokenAmount,
    tokenType,
  } = props;

  const navigate = useNavigate();

  // Navigate to question landing page
  const handleCardClick = (id) => {
    navigate(`/id/${id}`);
  };

  // Navigate to sensei details page
  const handleAvatarClick = (twitter) => {
    navigate(`/sensei/${twitter}`);
  };

  return (
    <CardHeader
      // sx={{ cursor: "pointer" }}
      onClick={() => handleCardClick(questionId)}
      avatar={
        <Avatar
          sx={{ cursor: "pointer" }}
          src={twitterPFP}
          onClick={(event) => {
            event.stopPropagation();
            handleAvatarClick(twitterHandle);
          }}
        ></Avatar>
      }
      title={
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>{twitterDisplayName}</Typography>
            <Typography>{`${tokenAmount} ${tokenType}`}</Typography>
          </div>
        </>
      }
      subheader={
        <Link
          className="feed-link"
          underline="none"
          href={`https://twitter.com/${twitterHandle}`}
          onClick={(event) => {
            event.stopPropagation();
          }}
          target="_blank"
          rel="noreferrer"
        >
          @{twitterHandle}
        </Link>
      }
    ></CardHeader>
  );
};

export default HeaderCard;
