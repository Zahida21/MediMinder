const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKey = process.env.TWILIO_VIDEO_API_KEY;
const apiSecret = process.env.TWILIO_VIDEO_API_SECRET;

// Generate a Twilio Video access token for a user
exports.generateAccessToken = (identity, room) => {
  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
  token.addGrant(new VideoGrant({ room }));
  return token.toJwt();
};
