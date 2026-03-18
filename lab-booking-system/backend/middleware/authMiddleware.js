const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config(); // Ensure environment variables are loaded

// Enhanced JWT secret validation
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.warn('WARNING: JWT_SECRET is not set in environment variables. Using fallback for development only.');
}

const fallbackSecret = 'fallback_secret_key_for_development_only_change_in_production';
const finalJwtSecret = jwtSecret || fallbackSecret;

// Optional authentication middleware - allows public access
const optionalAuth = async (req, res, next) => {
  try {
    // Try to authenticate user but don't fail if no credentials
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, finalJwtSecret);
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
        }
      } catch (err) {
        console.warn('JWT verification failed in optional auth:', err.message);
      }
    }

    // Also check session as fallback
    if (req.session && req.session.user && req.session.user.id && !req.user) {
      try {
        const user = await User.findById(req.session.user.id).select('-password');
        if (user) {
          req.user = user;
        }
      } catch (err) {
        console.warn('Session verification failed in optional auth:', err.message);
      }
    }

    // Always continue - this is optional auth
    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    // Continue without authentication for public endpoints
    next();
  }
};

// Protect middleware: require valid authentication
const protect = async (req, res, next) => {
  try {
    // Check Authorization header first
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Access token is required',
          error: 'MISSING_TOKEN'
        });
      }

      try {
        const decoded = jwt.verify(token, finalJwtSecret);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
          return res.status(401).json({ 
            success: false, 
            message: 'Invalid token: user not found',
            error: 'USER_NOT_FOUND'
          });
        }
        
        req.user = user;
        return next();
        
      } catch (jwtError) {
        let errorMessage = 'Invalid token';
        let errorType = 'INVALID_TOKEN';
        
        if (jwtError.name === 'TokenExpiredError') {
          errorMessage = 'Token expired';
          errorType = 'TOKEN_EXPIRED';
        } else if (jwtError.name === 'JsonWebTokenError') {
          errorMessage = 'Malformed token';
          errorType = 'MALFORMED_TOKEN';
        }
        
        return res.status(401).json({ 
          success: false, 
          message: errorMessage,
          error: errorType,
          details: process.env.NODE_ENV === 'development' ? jwtError.message : undefined
        });
      }
    }

    // Fallback: check session user
    if (req.session && req.session.user && req.session.user.id) {
      const user = await User.findById(req.session.user.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Session invalid: user not found',
          error: 'SESSION_INVALID'
        });
      }
      
      req.user = user;
      return next();
    }

    // No authentication found
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required. Please provide a valid Bearer token or active session.',
      error: 'AUTHENTICATION_REQUIRED',
      hint: 'Include Authorization: Bearer <token> header'
    });
    
  } catch (error) {
    console.error('Auth protect error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication service error',
      error: 'SERVICE_ERROR'
    });
  }
};

// authorize middleware: check user role(s)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required for role-based access',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: insufficient permissions',
        error: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: req.user.role
      });
    }
    
    next();
  };
};

module.exports = { protect, authorize, optionalAuth };
