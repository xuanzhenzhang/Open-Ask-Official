const { db } = require("../util/admin");
const { twClient } = require("../util/client");

exports.createUserIfNotExist = (req, res) => {
  let updatedUser;
  let userAlreadyExists = false;
  const twitterId = req.user.firebase.identities["twitter.com"][0];
  db.doc(`/users/${req.user.uid}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userAlreadyExists = true;
      }
      // Update twitter info when user logs in.
      twClient
        .get(
          `https://api.twitter.com/2/users/${twitterId}?user.fields=description,profile_image_url,public_metrics`
        )
        .then((user) => {
          updatedUser = {
            twitterHandle: user.data.username,
            twitterDisplayName: user.data.name,
            twitterPFPUrl: user.data.profile_image_url,
            twitterDescription: user.data.description,
            publicMetrics: user.data.public_metrics,
            questionsAsked: userAlreadyExists ? doc.data().questionsAsked : [],
            questionsFor: userAlreadyExists ? doc.data().questionsFor : [],
            questionsPurchased: userAlreadyExists
              ? doc.data().questionsPurchased
              : [],
            walletAddress:
              userAlreadyExists && doc.data().walletAddress
                ? doc.data().walletAddress
                : "",
            createdAt: userAlreadyExists
              ? doc.data().createdAt
              : new Date().toISOString(),
          };
          return db.doc(`/users/${req.user.uid}`).set(updatedUser);
        })
        .then(() => {
          if (userAlreadyExists) {
            res.status(200).json(updatedUser);
          } else {
            return res.status(201).json(updatedUser);
          }
        })
        .catch((err) => {
          res.status(500).json({ error: err.code });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getUser = (req, res) => {
  db.doc(`/users/${req.params.uid}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(doc.data());
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.setCurrentUserWallet = (req, res) => {
  let updatedUserWithWallet;
  db.doc(`/users/${req.user.uid}`)
    .get()
    .then((doc) => {
      updatedUserWithWallet = doc.data();
      updatedUserWithWallet.walletAddress = req.body.body;
      return db.doc(`/users/${req.user.uid}`).set(updatedUserWithWallet);
    })
    .then(() => {
      return res.status(201).json(updatedUserWithWallet);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getUserWallet = (req, res) => {
  db.doc(`/users/${req.params.userId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!doc.get("walletAddress")) {
        return res
          .status(404)
          .json({ error: "User does not have a wallet address yet" });
      }
      return res.status(200).json(doc.data().walletAddress);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getCurrentUserWallet = (req, res) => {
  db.doc(`/users/${req.user.uid}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!doc.get("walletAddress")) {
        return res
          .status(404)
          .json({ error: "User does not have a wallet address yet" });
      }
      return res.status(200).json(doc.data().walletAddress);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getAllUsers = (req, res) => {
  db.collection("users")
    .orderBy("createdAt", "desc")
    .get()
    .then((docList) => {
      let users = [];
      docList.forEach((doc) => {
        users.push({
          userId: doc.id,
          questionsAsked: doc.data().questionsAsked,
          questionsFor: doc.data().questionsFor,
          questionsPurchased: doc.data().questionsPurchased,
          twitterDisplayName: doc.data().twitterDisplayName,
          twitterDescription: doc.data().twitterDescription,
          twitterHandle: doc.data().twitterHandle,
          twitterPFPUrl: doc.data().twitterPFPUrl,
          publicMetrics: doc.data().publicMetrics,
          createdAt: doc.data().createdAt,
          walletAddress: doc.data().walletAddress,
        });
      });
      return res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getAllUsersByFollowers = (req, res) => {
  db.collection("users")
    .orderBy("publicMetrics.followers_count", "desc")
    .get()
    .then((docList) => {
      let users = [];
      docList.forEach((doc) => {
        users.push({
          userId: doc.id,
          questionsAsked: doc.data().questionsAsked,
          questionsFor: doc.data().questionsFor,
          questionsPurchased: doc.data().questionsPurchased,
          twitterDisplayName: doc.data().twitterDisplayName,
          twitterDescription: doc.data().twitterDescription,
          twitterHandle: doc.data().twitterHandle,
          twitterPFPUrl: doc.data().twitterPFPUrl,
          publicMetrics: doc.data().publicMetrics,
          createdAt: doc.data().createdAt,
          walletAddress: doc.data().walletAddress,
        });
      });
      return res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
