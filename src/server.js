// server.js
const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow cross-origin requests

// Agora credentials (make sure to replace these with your actual credentials)
const APP_ID =process.env.REACT_APP_AGORA_APP_ID; //Put your Agora app Id.
const APP_CERTIFICATE = process.env.REACT_APP_AGORA_APP_CERTIFICATE; //Put the agora app certificate.

app.get('/generate-token', (req, res) => {
  const channelName = req.query.channelName;
  const uid = req.query.uid || 0; // Use 0 for automatic UID assignment

  if (!APP_ID || !APP_CERTIFICATE) {
    return res.status(500).json({ error: 'Agora credentials are not set.' });
  }

  const role = RtcRole.PUBLISHER;
  const expireTime = 3600; // Token expiration time in seconds

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTimestamp + expireTime;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpireTime
    );
    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
