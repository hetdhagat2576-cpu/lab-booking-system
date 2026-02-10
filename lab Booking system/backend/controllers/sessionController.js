const { clearSessionUser, getSessionUser, requireSessionAuth } = require('../utils/sessionUtils');

// Logout route - clears session
const logoutSession = (req, res) => {
  try {
    clearSessionUser(req);
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
};

// Get current session user
const getSessionData = (req, res) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No active session found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting session data',
      error: error.message
    });
  }
};

// Protected route example
const getProtectedSessionData = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Access granted - you have an active session',
      user: getSessionUser(req)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accessing protected data',
      error: error.message
    });
  }
};

module.exports = {
  logoutSession,
  getSessionData,
  getProtectedSessionData,
  requireSessionAuth
};
