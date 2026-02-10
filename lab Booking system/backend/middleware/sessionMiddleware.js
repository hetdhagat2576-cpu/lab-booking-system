const session = require('express-session');

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true for HTTPS in production
    httpOnly: true, // prevents client-side JS from reading the cookie
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  name: 'sessionId' // custom session cookie name
});

module.exports = sessionConfig;
