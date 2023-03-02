import React, { useState, useEffect } from "react";
import { getUsers } from "../functions/getUsers";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Divider,
  Typography,
  Link,
  CardActions,
} from "@mui/material";

const QuestionAndAnswer = ({ data }) => {
  const [allUsers, setAllUsers] = useState();

  const navigate = useNavigate();

  // Get all users
  useEffect(() => {
    getUsers().then((users) => {
      const modifiedUsers = users.map((user) => {
        if (user?.profile?.imageUrl?.startsWith("ipfs")) {
          return {
            ...user,
            profile: {
              ...user.profile,
              imageUrl: `https://ipfs.io/ipfs/${
                user.profile.imageUrl.split("/")[2]
              }`,
            },
          };
        } else {
          return user;
        }
      });
      setAllUsers(modifiedUsers);
    });
  }, []);

  // Navigate to sensei details page
  const handleAvatarClick = (twitter) => {
    navigate(`/sensei/${twitter}`);
  };

  // Navigate to question landing page
  const handleCardClick = (id) => {
    navigate(`/id/${id}`);
  };

  return (
    <>
      {data?.map((content) => {
        const user = allUsers?.filter((id) => {
          return id.userId === content.questionerUid;
        });

        const answer = data?.filter((id) => {
          return id.questionId === content.questionId;
        });

        const answerer = allUsers?.filter((id) => {
          return id.userId === content.questioneeUid;
        });

        return (
          <Card className="feed-card" key={content.questionId}>
            <CardHeader
              sx={{ cursor: "pointer" }}
              onClick={() => handleCardClick(content.questionId)}
              avatar={
                <Avatar
                  sx={{ cursor: "pointer" }}
                  src={user && user[0]?.twitterPFPUrl}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAvatarClick(user && user[0]?.twitterHandle);
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
                    <Typography>
                      {user && user[0]?.twitterDisplayName}
                    </Typography>
                    <Typography>{`${content.rewardTokenAmount} ${content.rewardTokenType}`}</Typography>
                  </div>
                </>
              }
              subheader={
                <Link
                  className="feed-link"
                  underline="none"
                  href={`https://twitter.com/${user && user[0]?.twitterHandle}`}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{user && user[0]?.twitterHandle}
                </Link>
              }
            ></CardHeader>
            <CardContent
              sx={{ cursor: "pointer" }}
              onClick={() => handleCardClick(content.questionId)}
            >
              <Typography>{content.body}</Typography>
            </CardContent>
            <CardActions
              className="qa-actions"
              sx={{ cursor: "pointer" }}
              onClick={() => handleCardClick(content.questionId)}
            >
              <Typography variant="caption">
                {new Date(content.createdAt).toLocaleString()}
              </Typography>
            </CardActions>

            <Divider variant="middle" />

            <CardHeader
              sx={{ cursor: "pointer" }}
              onClick={() => handleCardClick(content.questionId)}
              avatar={
                <Avatar
                  sx={{ cursor: "pointer" }}
                  src={answerer && answerer[0]?.twitterPFPUrl}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAvatarClick(answerer && answerer[0]?.twitterHandle);
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
                    <Typography>
                      {answerer && answerer[0]?.twitterDisplayName}
                    </Typography>
                  </div>
                </>
              }
              subheader={
                <Link
                  className="feed-link"
                  underline="none"
                  href={`https://twitter.com/${
                    answerer && answerer[0]?.twitterHandle
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{answerer && answerer[0]?.twitterHandle}
                </Link>
              }
            ></CardHeader>
            <CardContent
              sx={{ cursor: "pointer" }}
              onClick={() => handleCardClick(content.questionId)}
            >
              <Typography>{answer[0]?.answer}</Typography>
            </CardContent>
            <CardActions
              className="qa-actions"
              sx={{ cursor: "pointer" }}
              onClick={() => handleCardClick(content.questionId)}
            >
              <Typography variant="caption">
                {new Date(answer[0]?.createdAt).toLocaleString()}
              </Typography>
            </CardActions>
          </Card>
        );
      })}
    </>
  );
};

export default QuestionAndAnswer;
