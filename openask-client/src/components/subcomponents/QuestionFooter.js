import React from "react";
import { CardActions, Typography, Link } from "@mui/material";
import WithdrawButton from "./WithdrawButton";
import AnswerButton from "./AnswerButton";
import PurchasedButton from "./PurchasedButton";
import EavesdropButton from "./EavesdropButton";

const QuestionFooter = (props) => {
  const { answeredBy, waiting, expired, eavesdrop, notAnswered } = props;
  const { answered, toAnswer, userExpired } = props;
  const { purchased } = props;
  const { waitingTime } = props;
  const { twitterHandle } = props;
  const {
    setOpenAnswer,
    setAnswerAvatar,
    setAnswerDisplayName,
    setAnswerHandle,
    setAnswerRewardAmount,
    setAnswerQuestion,
    setAnswerQuestionId,
    setAnswerBountyId,
    setOpenWithdraw,
    setAskLoaderWithdrawText,
    avatar,
    displayName,
    handle,
    rewardAmount,
    answerQuestion,
    questionId,
    bountyId,
    withdrawn,
  } = props;
  const { setAccessError, accessToken } = props;
  // Eavesdrop Props
  const { id, payees, setAskLoaderEavesdropText, setOpenEavesdrop, answerId } =
    props;

  return (
    <>
      {/* Questions Asked */}
      {answeredBy && (
        <CardActions className="feed-see-answer" sx={{ pb: "16px" }}>
          <Typography className="feed-purchase">Answered by</Typography>
          <Typography className="feed-purchase-link">
            <Link
              href={`https://twitter.com/${twitterHandle}`}
              target="_blank"
              rel="noreferrer"
              underline="none"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              @{twitterHandle}
            </Link>
          </Typography>
          {notAnswered && (
            <EavesdropButton
              id={id}
              payees={payees}
              setAskLoaderEavesdropText={setAskLoaderEavesdropText}
              setOpenEavesdrop={setOpenEavesdrop}
              answerId={answerId}
              accessToken={accessToken}
              setAccessError={setAccessError}
            />
          )}
        </CardActions>
      )}

      {waiting && (
        <CardActions className="feed-see-answer" sx={{ pb: "16px" }}>
          <Typography className="feed-purchase">To be answered by</Typography>
          <Typography className="feed-purchase-link">
            <Link
              href={`https://twitter.com/${twitterHandle}`}
              target="_blank"
              rel="noreferrer"
              underline="none"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              @{twitterHandle}
            </Link>
          </Typography>
          <Typography className="feed-time-left">{waitingTime}</Typography>
        </CardActions>
      )}

      {expired && (
        <CardActions className="feed-see-answer" sx={{ pb: "16px" }}>
          <Typography className="feed-purchase">To</Typography>
          <Typography className="feed-purchase-link">
            <Link
              href={`https://twitter.com/${twitterHandle}`}
              target="_blank"
              rel="noreferrer"
              underline="none"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              @{twitterHandle}
            </Link>
          </Typography>
          <Typography className="feed-expired">Expired</Typography>
          <WithdrawButton
            contractAddress={"0x34141bE35aC2aB6568D9cD7a23281101Fe79edb3"}
            bountyId={bountyId}
            contributionId={0}
            questionId={questionId}
            accessToken={accessToken}
            setAccessError={setAccessError}
            setOpenWithdraw={setOpenWithdraw}
            setAskLoaderWithdrawText={setAskLoaderWithdrawText}
            withdrawn={withdrawn}
          />
        </CardActions>
      )}

      {/* // Questions for me */}
      {answered && (
        <CardActions className="feed-see-answer" sx={{ pb: "16px" }}>
          <Typography className="feed-complete">Completed</Typography>
        </CardActions>
      )}
      {toAnswer && (
        <CardActions className="feed-see-answer" sx={{ pb: "16px" }}>
          <Typography className="feed-time-left">{waitingTime}</Typography>
          <AnswerButton
            setOpenAnswer={setOpenAnswer}
            setAnswerAvatar={setAnswerAvatar}
            setAnswerHandle={setAnswerHandle}
            setAnswerDisplayName={setAnswerDisplayName}
            setAnswerRewardAmount={setAnswerRewardAmount}
            setAnswerQuestion={setAnswerQuestion}
            setAnswerQuestionId={setAnswerQuestionId}
            setAnswerBountyId={setAnswerBountyId}
            avatar={avatar}
            displayName={displayName}
            handle={handle}
            rewardAmount={rewardAmount}
            answerQuestion={answerQuestion}
            questionId={questionId}
            bountyId={bountyId}
          />
        </CardActions>
      )}
      {userExpired && (
        <CardActions className="feed-see-answer" sx={{ pb: "16px" }}>
          <Typography className="feed-expired">Expired</Typography>
        </CardActions>
      )}

      {/* Purchased */}
      {purchased && (
        <CardActions className="feed-see-answer" sx={{ pb: "16px" }}>
          <Typography className="feed-purchase">Answered by</Typography>
          <Typography className="feed-purchase-link">
            <Link
              href={`https://twitter.com/${twitterHandle}`}
              target="_blank"
              rel="noreferrer"
              underline="none"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              @{twitterHandle}
            </Link>
          </Typography>
          {/* <PurchasedButton /> */}
        </CardActions>
      )}

      {/* Eavesdrop */}
      {eavesdrop && (
        <CardActions className="feed-see-answer" sx={{ pb: "16px" }}>
          <Typography>Eavesdropped by () users</Typography>
          {/* <EavesdropButton /> */}
        </CardActions>
      )}
    </>
  );
};

export default QuestionFooter;
