require("dotenv").config({ path: require("find-config")(".env") });

const { TwitterApi } = require("twitter-api-v2");
const twClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SERECT,
});

module.exports = { twClient };
