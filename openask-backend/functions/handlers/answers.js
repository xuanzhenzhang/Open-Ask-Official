const { db } = require("../util/admin");

exports.postAnswerToQuestion = (req, res) => {
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
      // add answer
      const allowList = [req.user.uid, question.data().questionerUid];

      answer = {
        body: req.body.body,
        allowList: allowList,
        questionId: req.params.questionId,
        quesitonerUid: question.data().questionerUid,
        questioneeUid: question.data().questioneeUid,
        createdAt: new Date().toISOString(),
        secretToken: question.data().secretToken,
      };
      return db.collection("answers").add(answer);
    })
    .then((doc) => {
      resAnswer = answer;
      resAnswer.answerId = doc.id;
      return question.ref.update({
        answerId: resAnswer.answerId,
      });
    })
    .then(() => {
      return res.status(200).json(resAnswer);
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
        quesitonerUid: doc.data().quesitonerUid,
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
            quesitonerUid: doc.data().quesitonerUid,
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
      quesitonerUid: updatedAnswer.quesitonerUid,
    });
  } catch {
    res.status(500).json({ error: "something went wrong" });
  }
};
