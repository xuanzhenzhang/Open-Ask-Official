import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Button, Divider, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUsers } from "./functions/getUsers.js";
import Loader from "./Loader.js";

import axios, * as others from "axios";

const QuestionsAnswered = ({ userInfo, accessToken, setAccessError }) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [questionsCount, setQuestionsCount] = useState();
  const [allUsers, setAllUsers] = useState();

  const [waitingQuestions, setWaitingQuestions] = useState();
  const [completedQuestions, setCompletedQuestions] = useState();
  const [completedAnswers, setCompletedAnswers] = useState([]);

  // Get all questions asked to user
  useEffect(() => {
    setLoading(true);
    const getQuestionsFor = async () => {
      if (userInfo) {
        try {
          const { data } = await axios.get(
            `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/questions-for/${userInfo.userUid}`
          );
          // Sort questions by waiting and completed
          const waiting = data.filter((question) => {
            return !question.answerId;
          });
          const completed = data.filter((question) => {
            return question.answerId;
          });
          // Set waiting and completed questions
          setWaitingQuestions(waiting);
          setCompletedQuestions(completed);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("No ID");
      }
    };

    getQuestionsFor();
  }, [userInfo]);

  // Get all users
  useEffect(() => {
    getUsers().then((response) => {
      setAllUsers(response);
    });
  }, []);

  // Count waiting questions to be answered
  useEffect(() => {
    if (waitingQuestions) {
      const totalQuestions = waitingQuestions.length;
      setQuestionsCount(totalQuestions);
    }
  }, [waitingQuestions]);

  // Find answer for each completed question
  useEffect(() => {
    const getAnswer = async () => {
      completedQuestions?.map(async (question) => {
        try {
          const { data } = await axios.get(
            `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/answer/${question.answerId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setCompletedAnswers((prevCompletedAnswers) => [
            ...prevCompletedAnswers,
            data,
          ]);
          setLoading(false);
        } catch (error) {
          if (error.response.status === 403) {
            setAccessError(true);
          }
          setLoading(false);
          console.log(error);
        }
      });
    };

    getAnswer();
  }, [completedQuestions]);

  // Set tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();

  // Open page to answer question
  const handleAnswer = (
    questionToAnswer,
    questionId,
    questionAvatar,
    questionTwitter,
    questionDisplayName,
    questionTokenType,
    questionTokenAmount,
    questionContractAddress,
    questionTimestamp
  ) => {
    navigate("/answer_question", {
      state: {
        question: questionToAnswer,
        questionId: questionId,
        avatar: questionAvatar,
        twitter: questionTwitter,
        displayName: questionDisplayName,
        tokenType: questionTokenType,
        tokenAmount: questionTokenAmount,
        contractAddress: questionContractAddress,
        timestamp: questionTimestamp,
      },
    });
  };

  // Navigate to sensei details page
  const handleAvatarClick = (twitter) => {
    navigate(`/sensei/${twitter}`);
  };

  // Navigate to question landing page
  const handleCardClick = (id) => {
    navigate(`/id/${id}`);
  };

  return (
    <Container
      sx={{
        width: { md: `calc(100% - 300px)` },
        ml: { md: `300px` },
        mt: "74px",
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab
                label={`Waiting (${questionsCount || ""})`}
                {...a11yProps(0)}
              />
              <Tab label="Completed" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {waitingQuestions?.map((content) => {
              const user = allUsers?.filter((id) => {
                return id.userId === content.questionerUid;
              });
              return (
                <Card className="feed-card" key={content.questionId}>
                  <CardHeader
                    // sx={{ cursor: "pointer" }}
                    // onClick={() => handleCardClick(content.questionId)}
                    avatar={
                      <Avatar
                        sx={{ cursor: "pointer" }}
                        src={user[0]?.twitterPFPUrl}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAvatarClick(user[0]?.twitterHandle);
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
                          <Typography>{user[0]?.twitterDisplayName}</Typography>
                          <Typography>{`${content.rewardTokenAmount} ${content.rewardTokenType}`}</Typography>
                        </div>
                      </>
                    }
                    subheader={
                      <Link
                        className="feed-link"
                        underline="none"
                        href={`https://twitter.com/${user[0]?.twitterHandle}`}
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        @{user[0]?.twitterHandle}
                      </Link>
                    }
                  ></CardHeader>
                  <CardContent>
                    <Typography>{content.body}</Typography>
                  </CardContent>
                  <CardActions className="answered-actions">
                    <Button
                      onClick={() =>
                        handleAnswer(
                          content.body,
                          content.questionId,
                          user[0]?.twitterPFPUrl,
                          user[0]?.twitterHandle,
                          user[0]?.twitterDisplayName,
                          content.rewardTokenType,
                          content.rewardTokenAmount,
                          content.contractAddress,
                          new Date(content.createdAt).toLocaleString()
                        )
                      }
                    >
                      Answer
                    </Button>
                    <Typography variant="caption">
                      {new Date(content.createdAt).toLocaleString()}
                    </Typography>
                  </CardActions>
                </Card>
              );
            })}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {completedQuestions?.map((content) => {
              const user = allUsers?.filter((id) => {
                return id.userId === content.questionerUid;
              });

              const answer = completedAnswers?.filter((id) => {
                return id.questionId === content.questionId;
              });

              const myUser = allUsers?.filter((id) => {
                return id.userId === userInfo?.userUid;
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
                        href={`https://twitter.com/${
                          user && user[0]?.twitterHandle
                        }`}
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
                        src={myUser && myUser[0]?.twitterPFPUrl}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAvatarClick(myUser && myUser[0]?.twitterHandle);
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
                            {myUser && myUser[0]?.twitterDisplayName}
                          </Typography>
                        </div>
                      </>
                    }
                    subheader={
                      <Link
                        className="feed-link"
                        underline="none"
                        href={`https://twitter.com/${
                          myUser && myUser[0]?.twitterHandle
                        }`}
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        @{myUser && myUser[0]?.twitterHandle}
                      </Link>
                    }
                  ></CardHeader>
                  <CardContent
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleCardClick(content.questionId)}
                  >
                    <Typography>{answer[0]?.body}</Typography>
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
          </TabPanel>
        </>
      )}
    </Container>
  );
};

export default QuestionsAnswered;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
