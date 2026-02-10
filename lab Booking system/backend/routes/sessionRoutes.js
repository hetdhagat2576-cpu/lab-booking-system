const express = require('express');
const router = express.Router();
const {
  logoutSession,
  getSessionData,
  getProtectedSessionData,
  requireSessionAuth
} = require('../controllers/sessionController');

// Logout route - clears session
router.post('/logout', logoutSession);

// Get current session user
router.get('/me', getSessionData);

// Protected route example
router.get('/protected', requireSessionAuth, getProtectedSessionData);

module.exports = router;
