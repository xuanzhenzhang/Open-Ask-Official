const { db } = require("../util/admin");
// const { twClient } = require("../util/client");
const { TwitterApi } = require("twitter-api-v2");
const PROFILE = {
  TWITTER: "twitter",
  LENS: "lens",
};
const { gql } = require("@apollo/client");
const { apolloClient } = require("../util/lensClient");

exports.createUserIfNotExist = (req, res) => {
  let updatedUser;
  const twitterId = req.user.firebase.identities["twitter.com"][0];
  db.doc(`/users/${req.user.uid}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return updateUserProfileHelper(req, res, doc.data().profile.type);
      } else {
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
              questionsAsked: [],
              questionsFor: [],
              questionsPurchased: [],
              walletAddress: "",
              createdAt: new Date().toISOString(),
            };
            return db.doc(`/users/${req.user.uid}`).set(updatedUser);
          })
          .then(() => {
            return res.status(201).json(updatedUser);
          })
          .catch((err) => {
            res.status(500).json({ error: err.code });
          });
      }
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

exports.updateUserProfile = async (req, res) => {
  // new profile type use query params
  const newProfileType = req.params.profile;
  return updateUserProfileHelper(req, res, newProfileType);
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
    .orderBy("profile.followers_count", "desc")
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

const updateUserProfileHelper = async (req, res, newProfileType) => {
  let updatedUser;
  // Can add facebook login later, we don't need gmail.
  const twitterId = req.user.firebase.identities["twitter.com"][0];
  db.doc(`/users/${req.user.uid}`)
    .get()
    .then((doc) => {
      // update user profile info even if twitter => twitter (i.e. followcount udpate)
      if (newProfileType.toLowerCase() == PROFILE.TWITTER) {
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
      } else if (newProfileType.toLowerCase() == PROFILE.LENS) {
        /**
         * LENS integration
         */
        if (doc.data().walletAddress == "") {
          return res
            .status(400)
            .json({ error: "No wallet exists for this user" });
        }
        const profileQuery = `
                  query DefaultProfile {
                      defaultProfile(request: { ethereumAddress: "0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3"}) {
                        id
                        name
                        bio
                        handle
                        picture {
                          ... on NftImage {
                            contractAddress
                            tokenId
                            uri
                            chainId
                            verified
                          }
                          ... on MediaSet {
                            original {
                              url
                              mimeType
                            }
                          }
                        }
                        stats {
                          totalFollowers
                          totalFollowing
                          totalPosts
                        }
                      }
                    }
                  `;
        apolloClient
          .query({
            query: gql(profileQuery),
          })
          .then((response) => {
            const defaultProfile = response.data.defaultProfile;
            if (defaultProfile == null) {
              console.log("defaultProfile is null");
              return res
                .status(400)
                .json({ error: "No lens profile exists for this user" });
            }
            const profile = {
              type: PROFILE.LENS,
              id: defaultProfile.id,
              handle: defaultProfile.handle,
              displayName: defaultProfile.name,
              imageUrl: defaultProfile.picture.original.url,
              bio: defaultProfile.bio,
              followers_count: defaultProfile.stats.totalFollowers,
              following_count: defaultProfile.stats.totalFollowing,
              posts_count: defaultProfile.stats.totalPosts,
            };
            updatedUser = {
              profile,
              questionsAsked: doc.data().questionsAsked,
              questionsFor: doc.data().questionsFor,
              questionsPurchased: doc.data().questionsPurchased,
              walletAddress: doc.data().walletAddress,
              createdAt: doc.data().createdAt,
            };
            console.log("updatedUser", updatedUser);
            return db.doc(`/users/${req.user.uid}`).set(updatedUser);
          })
          .then(() => {
            return res.status(201).json(updatedUser);
          })
          .catch((err) => {
            res.status(500).json({ error: err.code });
          });
      } else {
        return res.status(400).json({ error: "No profile type exists" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
