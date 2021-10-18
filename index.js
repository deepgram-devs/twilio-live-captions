require('dotenv').config();

const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const Express = require('express');
const app = new Express();

const port = 3000;
const twilioAccountSid = process.env.twilioAccountSid;
const twilioApiKey = process.env.twilioApiKey;
const twilioApiSecret = process.env.twilioApiSecret;
const DG_KEY = process.env.deepgramApiKey;


app.use(Express.static('./public'));

app.get('/token/:room/:name', (req, res) => {
  const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret, { identity: req.params.name });
  const videoGrant = new VideoGrant({ room: req.params.room });

  token.addGrant(videoGrant);

  res.send({ token: token.toJwt(), dg: DG_KEY })
});

app.listen(port, () => console.log(`Listening on port ${port}`));