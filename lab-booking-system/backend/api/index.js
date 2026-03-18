// Load environment variables first
require('dotenv').config();

// Load all models to ensure they are registered
require('../models/user');
require('../models/feedback');
require('../models/homeHowItWorks');
require('../models/homeWhyBook');
require('../models/booking');
require('../models/test');
require('../models/package');
require('../models/faq');
require('../models/serviceContent');
require('../models/termsContent');
require('../models/privacyPolicy');
require('../models/AboutContent');
require('../models/healthConcern');

// Import express and create a new app instance
const express = require('express');
const cors = require('cors')();
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://lab-booking-frontend-l2ki0uzr8-hetdhagat2576-8656s-projects.vercel.app",
    "https://lab-booking-frontend.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5173"
  ].filter(Boolean);

  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Import controllers
const { getHomeWhyBook, getHomeHowItWorks, getFaq, getLegal } = require('../controllers/contentController');

// Import middleware
const { optionalAuth } = require('../middleware/authMiddleware');

// Connect to MongoDB
const connectDB = require('../config/db');

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Content routes
app.get('/api/content/home/why-book', optionalAuth, getHomeWhyBook);
app.get('/api/content/home/how-it-works', optionalAuth, getHomeHowItWorks);
app.get('/api/content/faq', optionalAuth, getFaq);
app.get('/api/content/legal', optionalAuth, getLegal);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Lab Booking System Backend API',
    status: 'Running',
    version: '1.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    url: req.originalUrl,
    method: req.method
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
});

// Export for Vercel serverless deployment
module.exports = app;