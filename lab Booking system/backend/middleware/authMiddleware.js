const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config(); // Ensure environment variables are loaded

const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';

// Protect middleware: allow requests with a valid Bearer token or an active session
const protect = async (req, res, next) => {
  try {
    // Check Authorization header first
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ success: false, message: 'Invalid token: user not found' });
        }
        req.user = user;
        return next();
      } catch (err) {
        // fall through to session check
        console.warn('JWT verification failed:', err.message);
      }
    }

    // Fallback: check session user
    if (req.session && req.session.user && req.session.user.id) {
      const user = await User.findById(req.session.user.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Session invalid: user not found' });
      }
      req.user = user;
      return next();
    }

    return res.status(401).json({ success: false, message: 'Not authorized, token or session required' });
  } catch (error) {
    console.error('Auth protect error:', error);
    return res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

// authorize middleware: check user role(s)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};

module.exports = { protect, authorize };
