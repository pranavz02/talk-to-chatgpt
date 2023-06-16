import express from 'express'
import querystring from 'querystring';
const router = express.Router()

// OAuth 2.0 Configuration
const clientId = '7L4u6wczSUyIoQdTfO1zCw';
const clientSecret = 'EQsWQeKrdGEeMbaaK6v9QivxqxMGi9FR';
const redirectUri = 'https://08cf-106-212-115-248.ngrok-free.app/oauth/callback';

// Join Meeting Configuration
const meetingId = '81172228910';
const passcode = 'vsNg4S';
const participantName = 'YOUR_NAME';
const participantEmail = 'pranavzinzurde@gmail.com';
const zoomApiBaseUrl = 'https://api.zoom.us/v2';

// OAuth 2.0 Routes
router.get('/oauth', (req, res) => {
  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
  });
  const authorizationUrl = `https://zoom.us/oauth/authorize?${queryParams}`;
  res.redirect(authorizationUrl);
});

router.get('/oauth/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post(
      `${zoomApiBaseUrl}/oauth/token`,
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: clientId,
          password: clientSecret,
        },
      }
    );

    const { access_token } = tokenResponse.data;
    // Store the access_token securely for subsequent API calls

    res.send('OAuth authentication successful');
  } catch (error) {
    console.error('Failed to authenticate with Zoom:', error.response.data);
    res.status(500).send('Failed to authenticate with Zoom');
  }
});

// Join Meeting Route
router.post('/join-meeting', async (req, res) => {
    try {
      const response = await axios.post(
        `${zoomApiBaseUrl}/meetings/${meetingId}/registrants`,
        {
          email: participantEmail,
          first_name: participantName,
          meeting_password: passcode,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer YOUR_ACCESS_TOKEN`,
          },
        }
      );
      res.send('Successfully joined the meeting');
    } catch (error) {
      console.error('Failed to join the meeting:', error.response.data);
      res.status(500).send('Failed to join the meeting');
    }
  });

export default router