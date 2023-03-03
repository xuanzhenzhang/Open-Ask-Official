const functions = require("firebase-functions");
// const admin = require("firebase-admin");
const { db } = require("./util/admin");
const app = require("express")();
var cors = require("cors");
const FBAuth = require("./util/fbAuth");
app.use(cors());

const {
  getAllQuestions,
  getAllQuestionsByDescPrice,
  // postOneQuestion,
  postUnactivatedQuestion,
  updateActivateQuestion,
  getQuestion,
  getAllQuestionsForUser,
  getAllQuestionsByUser,
  getAllQuestionPurhcasedByUser,
} = require("./handlers/questions");

const {
  createUserIfNotExist,
  updateUserProfile,
  getUser,
  getAllUsers,
  getAllUsersByFollowers,
  getUserWallet,
  setCurrentUserWallet,
  getCurrentUserWallet,
} = require("./handlers/users");

const {
  // postAnswerToQuestion,
  purchaseAnswer,
  getAnswer,
  getAnswerToQuestion,
  getAllAnswersByUser,
  // updateAnswerTxHash,
  postUnactivatedAnswerToQuestion,
  updateActivateAnswer,
} = require("./handlers/answers");

app.get("/questions", getAllQuestions);
app.get("/questions-purchased", FBAuth, getAllQuestionPurhcasedByUser);
app.get("/questions-by-price", getAllQuestionsByDescPrice);
app.get("/questions-for/:uid", getAllQuestionsForUser);
app.get("/questions-by/:uid", getAllQuestionsByUser);
// app.post("/question", FBAuth, postOneQuestion);
app.get("/question/:questionId", getQuestion);
app.post("/question", FBAuth, postUnactivatedQuestion);
app.put("/question/:txHash", FBAuth, updateActivateQuestion);

app.get("/user/:uid", getUser);
app.post("/login", FBAuth, createUserIfNotExist);
app.get("/users", getAllUsers);
app.get("/users-by-followers", getAllUsersByFollowers);
app.get("/user-wallet/:userId", getUserWallet);
app.post("/user-wallet", FBAuth, setCurrentUserWallet);
app.get("/user-wallet", FBAuth, getCurrentUserWallet);
app.put("/user/:profileType", FBAuth, updateUserProfile);

app.get("/answer/:answerId", FBAuth, getAnswer);
app.get("/answer-to-question/:questionId", FBAuth, getAnswerToQuestion);
app.get("/answers-by-user/:userId", FBAuth, getAllAnswersByUser);
// app.post("/answer/:questionId", FBAuth, postAnswerToQuestion);
app.post("/answer/:questionId", FBAuth, postUnactivatedAnswerToQuestion);
app.put("answer/:answerId", FBAuth, updateActivateAnswer);
app.put("/answer/payment/:answerId", FBAuth, purchaseAnswer);
// app.put("/answer/tx/:answerId", FBAuth, updateAnswerTxHash);

exports.api = functions
  .runWith({
    secrets: [
      "TWITTER_APP_KEY",
      "TWITTER_APP_SECRET",
      "TWITTER_ACCESS_TOKEN",
      "TWITTER_ACCESS_SECRET",
    ],
  })
  .https.onRequest(app);
