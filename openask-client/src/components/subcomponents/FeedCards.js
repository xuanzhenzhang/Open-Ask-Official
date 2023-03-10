import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";

import { getUsers } from "../functions/getUsers";

import QuestionHeader from "./card/QuestionHeader";
import QuestionBody from "./card/QuestionBody";
import QuestionFooter from "./card/QuestionFooter";

const FeedCards = ({ data, price }) => {
  const [questions, setQuestions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const navigate = useNavigate();

  // Navigate to Question landing Page
  const handleCardClick = useCallback(
    (id) => {
      navigate(`/id/${id}`);
    },
    [navigate]
  );

  // Get all users
  useEffect(() => {
    let isMounted = true;
    getUsers().then((users) => {
      const modifiedUsers = users.map((user) => {
        if (user?.profile?.imageUrl?.startsWith("ipfs")) {
          return {
            ...user,
            profile: {
              ...user.profile,
              imageUrl: `https://gateway.pinata.cloud/ipfs/${
                user.profile.imageUrl.split("/")[2]
              }`,
            },
          };
        } else {
          return user;
        }
      });
      if (isMounted) {
        setAllUsers(modifiedUsers);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Set imported data as question set
  useEffect(() => {
    setQuestions(data);
  }, [data]);

  return (
    <div>
      {questions?.map((content) => {
        const user = allUsers?.filter((id) => {
          return id.userId === content.questionerUid;
        });
        const answerer = allUsers?.filter((id) => {
          return id.userId === content.questioneeUid;
        });

        return (
          <Card
            className="feed-card"
            key={content.questionId}
            onClick={() => handleCardClick(content.questionId)}
          >
            <QuestionHeader
              twitterPfp={user[0]?.profile.imageUrl}
              twitterHandle={user[0]?.profile.handle}
              twitterDisplayName={user[0]?.profile.displayName}
              price
              tokenAmount={content.rewardTokenAmount}
              tokenType={content.rewardTokenType}
            />

            <QuestionBody body={content.body} createdAt={content.createdAt} />

            <QuestionFooter
              answeredBy
              twitterHandle={answerer[0]?.profile.handle}
            />
          </Card>
        );
      })}
    </div>
  );
};

export default FeedCards;
