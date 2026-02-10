// Session utility functions for managing user sessions

/**
 * Store user data in session
 * @param {Object} req - Express request object
 * @param {Object} userData - User data to store in session
 */
const setSessionUser = (req, userData) => {
  req.session.user = {
    id: userData._id || userData.id,
    email: userData.email,
    name: userData.name,
    role: userData.role || 'user',
    isLoggedIn: true
  };
  req.session.save();
};

/**
 * Get user data from session
 * @param {Object} req - Express request object
 * @returns {Object|null} User data from session or null
 */
const getSessionUser = (req) => {
  return req.session.user || null;
};

/**
 * Check if user is logged in via session
 * @param {Object} req - Express request object
 * @returns {boolean} True if user is logged in
 */
const isUserLoggedIn = (req) => {
  return req.session.user && req.session.user.isLoggedIn;
};

/**
 * Clear user session
 * @param {Object} req - Express request object
 */
const clearSessionUser = (req) => {
  req.session.user = null;
  req.session.destroy();
};

/**
 * Session-based authentication middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireSessionAuth = (req, res, next) => {
  if (!isUserLoggedIn(req)) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please login to continue.'
    });
  }
  next();
};

module.exports = {
  setSessionUser,
  getSessionUser,
  isUserLoggedIn,
  clearSessionUser,
  requireSessionAuth
};
