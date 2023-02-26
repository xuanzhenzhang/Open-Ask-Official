const { TwitterApi } = require("twitter-api-v2");
const twClient = new TwitterApi({
  appKey: "syY1dfeF84qwiYiqD38Tal4SV",
  appSecret: "If4vQf5PpfCW9meGVM09qMR6TTL9YMG0vxcB7hpgxJnM1FBMMI",
  accessToken: "1504363325886328835-NbPITuTE86AUDlyBYB0CHblM3ZKFKa",
  accessSecret: "hrlUmkpVHrd6P3vX7KycQyyoxEG5dFeVapoVy3ie3URKi",
});

module.exports = { twClient };
