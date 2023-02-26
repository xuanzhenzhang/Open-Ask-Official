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
  postOneQuestion,
  postUnactivatedQuestion,
  updateActivateQuestion,
  getQuestion,
  getAllQuestionsForUser,
  getAllQuestionsByUser,
  getAllQuestionPurhcasedByUser,
} = require("./handlers/questions");

const {
  createUserIfNotExist,
  getUser,
  getAllUsers,
  getAllUsersByFollowers,
  getUserWallet,
  setCurrentUserWallet,
  getCurrentUserWallet,
} = require("./handlers/users");

const {
  postAnswerToQuestion,
  purchaseAnswer,
  getAnswer,
  getAnswerToQuestion,
  getAllAnswersByUser,
} = require("./handlers/answers");

app.get("/questions", getAllQuestions);
// app.get("/questions-purchased", FBAuth, getAllQuestionPurhcasedByUser);
// app.get("/questions-by-price", getAllQuestionsByDescPrice);
// app.get("/questions-for/:uid", getAllQuestionsForUser);
// app.get("/questions-by/:uid", getAllQuestionsByUser);
// app.post("/question", FBAuth, postOneQuestion);
// app.get("/question/:questionId", getQuestion);
// app.post("/question", FBAuth, postUnactivatedQuestion);
// app.put("/question/:contractAddress", FBAuth, updateActivateQuestion);

// app.get("/user/:uid", getUser);
// app.post("/login", FBAuth, createUserIfNotExist);
// app.get("/users", getAllUsers);
// app.get("/users-by-followers", getAllUsersByFollowers);
// app.get("/user-wallet/:userId", getUserWallet);
// app.post("/user-wallet", FBAuth, setCurrentUserWallet);
// app.get("/user-wallet", FBAuth, getCurrentUserWallet);

// app.get("/answer/:answerId", FBAuth, getAnswer);
// app.get("/answer-to-question/:questionId", FBAuth, getAnswerToQuestion);
// app.get("/answers-by-user/:userId", FBAuth, getAllAnswersByUser);
// app.post("/answer/:questionId", FBAuth, postAnswerToQuestion);
// app.put("/answer/payment/:answerId", FBAuth, purchaseAnswer);

// app.post("/signup", (req, res) => {
//   const newUser = {
//     twitterHandle: req.body.twitterHandle,
//     twitterPFP: req.body.twitterPFP,
//     twitterDisplayName: req.body.twitterDisplayName,
//   };

//   db.collection("users")
//     .add(newUser)
//     .then((doc) => {
//       res.json({ message: `document ${doc.id} created successfully` });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: "something went wrong" });
//     });
// });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello world!");
// });

// app.get("/questions", (req, res) => {
//   db.collection("questions")
//     .get()
//     .then((docList) => {
//       let questions = [];
//       docList.forEach((doc) => {
//         questions.push(doc.data());
//       });
//       return res.json(questions);
//     })
//     .catch((err) => console.error(err));
// });

// exports.getQuestions = functions.https.onRequest((req, res) => {
//   db.collection("questions")
//     .get()
//     .then((docList) => {
//       let questions = [];
//       docList.forEach((doc) => {
//         questions.push(doc.data());
//       });
//       return res.json(questions);
//     })
//     .catch((err) => console.error(err));
// });

// const { twClient } = require("./util/client");
// twClient
//   .get(
//     "https://api.twitter.com/2/users/1504363325886328835?user.fields=description,profile_image_url,public_metrics"
//   )
//   .then((res) => console.log(res));

exports.api = functions.https.onRequest(app);
