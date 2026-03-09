const session = require('express-session');

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'fallback-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true for HTTPS in production
    httpOnly: true, // prevents client-side JS from reading the cookie
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin in production
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined // For cross-subdomain cookies
  },
  name: 'sessionId', // custom session cookie name
  proxy: true, // Trust the reverse proxy when in production
  rolling: true // Reset cookie expiration on each request
});

module.exports = sessionConfig;
