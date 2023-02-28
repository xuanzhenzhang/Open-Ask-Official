// require("dotenv").config({ path: require("find-config")(".env") });
// const dotenv = require("dotenv");
// dotenv.config({ path: "../.env" });

const { TwitterApi } = require("twitter-api-v2");

const twClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// twClient
//   .get(
//     "https://api.twitter.com/2/users/1504363325886328835?user.fields=description,profile_image_url,public_metrics"
//   )
//   .then((res) => console.log(res));

module.exports = { twClient };
