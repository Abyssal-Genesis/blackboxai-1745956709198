const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { verifyBiometric } = require('../services/humanVerification');
const { User } = require('../models');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET;

// POST /auth/google-login
router.post('/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    let user = await User.findOne({ where: { gmail_email: email } });
    if (!user) {
      user = await User.create({
        gmail_email: email,
        name: payload.name,
        human_verified: false,
      });
    }
    const jwtToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ jwt: jwtToken, user: { id: user.id, email: user.gmail_email, name: user.name, human_verified: user.human_verified } });
  } catch (error) {
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// POST /auth/human-verification
router.post('/human-verification', async (req, res) => {
  const { userId, biometricData } = req.body;
  try {
    const verified = await verifyBiometric(biometricData);
    if (verified) {
      await User.update({ human_verified: true }, { where: { id: userId } });
    }
    res.json({ verified });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
