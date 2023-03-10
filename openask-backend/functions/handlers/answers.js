const { DocumentBuilder } = require("firebase-functions/v1/firestore");
const { db } = require("../util/admin");
const { getAnswerIdFromBountyFulfillHash } = require("../util/hash");

/**
 * (not secure!!!)
 * post answer
 * return answerId (no answer url)
 * send me back the tx hash, there is answerId in the input (no need event)
 */

exports.postUnactivatedAnswerToQuestion = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }
  let answer, question, resAnswer;

  db.doc(`/questions/${req.params.questionId}`)
    .get()
    .then((doc) => {
      question = doc;
      if (question.data().answerId != null) {
        return res.status(400).json({ error: "Question already answered" });
      } else if (question.data().questioneeUid != req.user.uid) {
        return res
          .status(400)
          .json({ error: "Question is asked to a different user" });
      }
      answer = {
        body: req.body.body,
        allowList: null,
        questionId: req.params.questionId,
        questionerUid: question.data().questionerUid,
        questioneeUid: question.data().questioneeUid,
        createdAt: new Date().toISOString(),
        txHash: null,
      };
      return db.collection("answers").add(answer);
    })
    .then((doc) => {
      resAnswer = answer;
      resAnswer.answerId = doc.id;
      return res.status(200).json(resAnswer);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

exports.updateActivateAnswer = async (req, res) => {
  // get hash and read the answerId
  const txHash = req.params.txHash;
  const answerId = await getAnswerIdFromBountyFulfillHash(txHash);
  let questionId, newAnswer;
  db.doc(`/answers/${answerId}`)
    .get()
    .then((doc) => {
      const questionerUid = doc.data().questionerUid;
      const questioneeUid = doc.data().questioneeUid;
      questionId = doc.data().questionId;
      const allowList = [questionerUid, questioneeUid];
      newAnswer = {
        answerId: answerId,
        body: doc.data().body,
        allowList: allowList,
        questionId: doc.data().questionId,
        questionerUid: questionerUid,
        questioneeUid: questioneeUid,
        createdAt: new Date().toISOString(),
        txHash: txHash,
      };
      return doc.ref.update({ allowList: allowList, txHash: txHash });
    })
    .then(() => {
      return db.doc(`/questions/${questionId}`).get();
    })
    .then((doc) => {
      return doc.ref.update({
        answerId: answerId,
      });
    })
    .then(() => {
      return res.status(200).json(newAnswer);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

// const allowList = [req.user.uid, question.data().questionerUid];

//       answer = {
//         body: req.body.body,
//         allowList: allowList,
//         questionId: req.params.questionId,
//         questionerUid: question.data().questionerUid,
//         questioneeUid: question.data().questioneeUid,
//         createdAt: new Date().toISOString(),
//         secretToken: question.data().secretToken,
//         txHash: null,
//       };
//       return db.collection("answers").add(answer);
//     })
//     .then((doc) => {
//       resAnswer = answer;
//       resAnswer.answerId = doc.id;
//       return question.ref.update({
//         answerId: resAnswer.answerId,
//       });
//     })

// exports.postAnswerToQuestion = (req, res) => {
//   if (req.body.body.trim() === "") {
//     return res.status(400).json({ body: "Body must not be empty" });
//   }
//   let answer, question, resAnswer;

//   db.doc(`/questions/${req.params.questionId}`)
//     .get()
//     .then((doc) => {
//       question = doc;
//       if (question.data().answerId != null) {
//         return res.status(400).json({ error: "Question already answered" });
//       } else if (question.data().questioneeUid != req.user.uid) {
//         return res
//           .status(400)
//           .json({ error: "Question is asked to a different user" });
//       }
//       // add answer
//       const allowList = [req.user.uid, question.data().questionerUid];

//       answer = {
//         body: req.body.body,
//         allowList: allowList,
//         questionId: req.params.questionId,
//         questionerUid: question.data().questionerUid,
//         questioneeUid: question.data().questioneeUid,
//         createdAt: new Date().toISOString(),
//         secretToken: question.data().secretToken,
//         txHash: null,
//       };
//       return db.collection("answers").add(answer);
//     })
//     .then((doc) => {
//       resAnswer = answer;
//       resAnswer.answerId = doc.id;
//       return question.ref.update({
//         answerId: resAnswer.answerId,
//       });
//     })
//     .then(() => {
//       return res.status(200).json(resAnswer);
//     })
//     .catch((err) => {
//       res.status(500).json({ error: "something went wrong" });
//       console.error(err);
//     });
// };

// exports.updateAnswerTxHash = (req, res) => {
//   let updatedAnswerWithTxHash;

//   db.doc(`/answer/${answerId}`)
//     .get()
//     .then((doc) => {
//       if (!doc.exists) {
//         return res.status(404).json({ error: "Answer not found." });
//       }
//       updatedAnswerWithTxHash = doc;
//       updatedAnswerWithTxHash.txHash = req.params.txHash;
//       return doc.ref.update({ txHash: req.params.txHash });
//     })
//     .then(() => {
//       return res.status(200).json({ updatedAnswerWithTxHash });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: "something went wrong" });
//       console.error(err);
//     });
// };

/**
 * For transactions page
 * Note that we DO NOT return the content of answer
 */
exports.getAllAnswersByDescTimestamp = (req, res) => {
  db.collection("answers")
    .orderBy("createdAt", "desc")
    .get()
    .then((docList) => {
      let answers = [];
      docList.forEach((doc) => {
        answers.push({
          answerId: doc.id,
          questionId: doc.data().questionId,
          questionerUid: doc.data().questionerUid,
          questioneeUid: doc.data().questioneeUid,
          createdAt: doc.data().createdAt,
          txHash: doc.data().txHash,
        });
      });
      return res.status(200).json(answers);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

exports.getAnswer = (req, res) => {
  db.doc(`/answers/${req.params.answerId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Answer not found" });
      }
      if (!doc.data().allowList.includes(req.user.uid)) {
        return res.status(404).json({ error: "Answer not permitted to user" });
      }
      // user should not be able to see who puchased answer (no allowlist in response)
      const answer = {
        questionId: doc.data().questionId,
        questioneeUid: doc.data().questioneeUid,
        createdAt: doc.data().createdAt,
        body: doc.data().body,
        questionerUid: doc.data().questionerUid,
        txHash: doc.data().txHash,
      };
      return res.status(200).json(answer);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getAllAnswersByUser = (req, res) => {
  db.collection("answers")
    .where("questioneeUid", "==", req.params.userId)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res
          .status(404)
          .json({ error: "No answers found for given user" });
      }
      // user should be able to see who puchased answer, since this user answered the question
      return res.status(200).json(doc.data());
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getAnswerToQuestion = (req, res) => {
  db.doc(`/questions/${req.params.questionId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Question not found" });
      }
      const answerId = doc.data().answerId;
      if (!answerId) {
        return res.status(404).json({ error: "No answer for question yet" });
      }
      return answerId;
    })
    .then((answereId) => {
      db.doc(`/answers/${answereId}`)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            return res.status(404).json({ error: "Answer not found" });
          }
          if (!doc.data().allowList.includes(req.user.uid)) {
            return res
              .status(404)
              .json({ error: "Answer not permitted to user" });
          }
          // user should not be able to see who puchased answer (no allowlist in response)
          const answer = {
            questionId: doc.data().questionId,
            questioneeUid: doc.data().questioneeUid,
            createdAt: doc.data().createdAt,
            body: doc.data().body,
            questionerUid: doc.data().questionerUid,
            txHash: doc.data().txHash,
          };
          return res.status(200).json(answer);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: err.code });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.purchaseAnswer = async (req, res) => {
  const batch = db.batch();
  let updatedAnswer;
  const answerAndUserPromises = [];
  const answerRef = db.doc(`/answers/${req.params.answerId}`);
  const userRef = db.doc(`/users/${req.user.uid}`);
  answerAndUserPromises.push(answerRef.get());
  answerAndUserPromises.push(userRef.get());
  try {
    const answerAndUser = await Promise.all(answerAndUserPromises);
    const answer = answerAndUser[0];
    // assert allowList includes == quesstionsPurchased includes answer.questionId
    if (answer.data().allowList.includes(req.user.uid)) {
      return res
        .status(400)
        .json({ error: "User already permitted to see answer" });
    }
    const newAllowList = answer.data().allowList;
    newAllowList.push(req.user.uid);
    updatedAnswer = answer.data();
    updatedAnswer.allowList = newAllowList;
    batch.update(answerRef, { allowList: newAllowList });

    const user = answerAndUser[1];
    const newQuestionsPurchased = user.data().questionsPurchased;
    newQuestionsPurchased.push(answer.data().questionId);
    batch.update(userRef, { questionsPurchased: newQuestionsPurchased });
    await batch.commit();
    // user should not be able to see who puchased answer (no allowlist in response)
    return res.status(200).json({
      questionId: updatedAnswer.questionId,
      questioneeUid: updatedAnswer.questioneeUid,
      createdAt: updatedAnswer.createdAt,
      body: updatedAnswer.body,
      questionerUid: updatedAnswer.questionerUid,
    });
  } catch {
    res.status(500).json({ error: "something went wrong" });
  }
};

// exports.purchaseAnswer = async (req, res) => {
//   const batch = db.batch();
//   let updatedAnswer;
//   const answerAndUserPromises = [];
//   const answerRef = db.doc(`/answers/${req.params.answerId}`);
//   const userRef = db.doc(`/users/${req.user.uid}`);
//   answerAndUserPromises.push(answerRef.get());
//   answerAndUserPromises.push(userRef.get());
//   try {
//     const answerAndUser = await Promise.all(answerAndUserPromises);
//     const answer = answerAndUser[0];
//     // assert allowList includes == quesstionsPurchased includes answer.questionId
//     if (answer.data().allowList.includes(req.user.uid)) {
//       return res
//         .status(400)
//         .json({ error: "User already permitted to see answer" });
//     }
//     const newAllowList = answer.data().allowList;
//     newAllowList.push(req.user.uid);
//     updatedAnswer = answer.data();
//     updatedAnswer.allowList = newAllowList;
//     batch.update(answerRef, { allowList: newAllowList });

//     const user = answerAndUser[1];
//     const newQuestionsPurchased = user.data().questionsPurchased;
//     newQuestionsPurchased.push(answer.data().questionId);
//     batch.update(userRef, { questionsPurchased: newQuestionsPurchased });
//     await batch.commit();
//     // user should not be able to see who puchased answer (no allowlist in response)
//     return res.status(200).json({
//       questionId: updatedAnswer.questionId,
//       questioneeUid: updatedAnswer.questioneeUid,
//       createdAt: updatedAnswer.createdAt,
//       body: updatedAnswer.body,
//       questionerUid: updatedAnswer.questionerUid,
//     });
//   } catch {
//     res.status(500).json({ error: "something went wrong" });
//   }
// };
