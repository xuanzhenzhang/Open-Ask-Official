const { db } = require("../util/admin");
// const { twClient } = require("../util/client");
const { TwitterApi } = require("twitter-api-v2");
const PROFILE = {
  TWITTER: "twitter",
  LENS: "lens",
};

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
      const twClient = new TwitterApi({
        appKey: process.env.TWITTER_APP_KEY,
        appSecret: process.env.TWITTER_APP_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
      });
      // Update twitter info when user logs in.
      twClient
        .get(
          `https://api.twitter.com/2/users/${twitterId}?user.fields=description,profile_image_url,public_metrics`
        )
        .then((user) => {
          updatedUser = {
            profile: {
              type: PROFILE.TWITTER,
              id: twitterId,
              handle: user.data.username,
              displayName: user.data.name,
              imageUrl: user.data.profile_image_url,
              bio: user.data.description,
              followers_count: user.data.public_metrics.followers_count,
              following_count: user.data.public_metrics.following_count,
              posts_count: user.data.public_metrics.tweet_count,
            },
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

/**
 * Switch profile to lens
 * connect wallet ? set wallet address
 * query wallet address on backend to update
 */

exports.updateUserProfile = (req, res) => {
  let updatedUser;
  // Can add facebook login later, we don't need gmail.
  const twitterId = req.user.firebase.identities["twitter.com"][0];
  // new profile type use query params
  const newProfileType = req.params.profile;
  db.doc(`/users/${req.user.uid}`)
    .get()
    .then((doc) => {
      const crProfileType = doc.data().profile.type;
      if (newProfileType == crProfileType) {
        return res.status(200).json(doc.data());
      }
      if (newProfileType.toLowercase() == PROFILE.TWITTER) {
        const twClient = new TwitterApi({
          appKey: process.env.TWITTER_APP_KEY,
          appSecret: process.env.TWITTER_APP_SECRET,
          accessToken: process.env.TWITTER_ACCESS_TOKEN,
          accessSecret: process.env.TWITTER_ACCESS_SECRET,
        });
        twClient
          .get(
            `https://api.twitter.com/2/users/${twitterId}?user.fields=description,profile_image_url,public_metrics`
          )
          .then((user) => {
            updatedUser = {
              profile: {
                type: PROFILE.TWITTER,
                id: twitterId,
                handle: user.data.username,
                displayName: user.data.name,
                imageUrl: user.data.profile_image_url,
                bio: user.data.description,
                followers_count: user.data.public_metrics.followers_count,
                following_count: user.data.public_metrics.following_count,
                posts_count: user.data.public_metrics.tweet_count,
              },
              questionsAsked: doc.data().questionsAsked,
              questionsFor: doc.data().questionsFor,
              questionsPurchased: doc.data().questionsPurchased,
              walletAddress: doc.data().walletAddress,
              createdAt: doc.data().createdAt,
            };
            return db.doc(`/users/${req.user.uid}`).set(updatedUser);
          })
          .then(() => {
            return res.status(201).json(updatedUser);
          })
          .catch((err) => {
            res.status(500).json({ error: err.code });
          });
      } else if (newProfileType.toLowercase() == PROFILE.LENS) {
        /**
         * LENS integration
         */
      } else {
        return res.status(400).json({ error: "No profile type exists" });
      }
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
          profile: doc.data().profile,
          questionsAsked: doc.data().questionsAsked,
          questionsFor: doc.data().questionsFor,
          questionsPurchased: doc.data().questionsPurchased,
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
          profile: doc.data().profile,
          questionsAsked: doc.data().questionsAsked,
          questionsFor: doc.data().questionsFor,
          questionsPurchased: doc.data().questionsPurchased,
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
