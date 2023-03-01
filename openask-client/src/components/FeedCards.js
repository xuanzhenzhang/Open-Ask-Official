import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";

import { getUsers } from "./functions/getUsers";

import QuestionHeader from "./subcomponents/QuestionHeader";
import QuestionBody from "./subcomponents/QuestionBody";
import QuestionFooter from "./subcomponents/QuestionFooter";

const FeedCards = ({ data, price }) => {
  const [questions, setQuestions] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  const navigate = useNavigate();

  // Navigate to Sensei Detail page
  const handleAvatarClick = (twitter) => {
    navigate(`/sensei/${twitter}`);
  };

  // Navigate to Question landing Page
  const handleCardClick = (id) => {
    navigate(`/id/${id}`);
  };

  // Get all users
  useEffect(() => {
    getUsers().then((response) => {
      setUserInfo(response);
    });
  }, []);

  // Set imported data as question set
  useEffect(() => {
    setQuestions(data);
  }, [data]);

  return (
    <div>
      {questions?.map((content) => {
        const user = userInfo?.filter((id) => {
          return id.userId === content.questionerUid;
        });
        const answerer = userInfo?.filter((id) => {
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
