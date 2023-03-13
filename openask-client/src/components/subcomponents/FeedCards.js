import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";

import QuestionHeader from "./card/QuestionHeader";
import QuestionBody from "./card/QuestionBody";
import QuestionFooter from "./card/QuestionFooter";

const FeedCards = ({ questions, allUsers }) => {
  const navigate = useNavigate();

  // Navigate to Question landing Page
  const handleCardClick = useCallback(
    (id) => {
      navigate(`/id/${id}`);
    },
    [navigate]
  );

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
