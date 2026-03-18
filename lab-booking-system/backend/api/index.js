// Load environment variables first
require('dotenv').config();

// Import express and create a new app instance
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Global database connection state
let isConnected = false;

// Database connection function for serverless environment
const connectDB = async () => {
  if (isConnected) {
    console.log('🔄 Using existing database connection');
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    };
    
    await mongoose.connect(mongoURI, options);
    isConnected = true;
    
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
      isConnected = false;
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    isConnected = false;
    throw error;
  }
};

// Load all models after connection setup
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

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced CORS middleware for Vercel
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
    "http://127.0.0.1:5173",
    "*" // Allow all origins for debugging
  ].filter(Boolean);

  const origin = req.headers.origin;
  
  // Set origin if allowed, otherwise don't set header
  if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || "*");
  }
  
  // Required CORS headers
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Import controllers
const { getHomeWhyBook, getHomeHowItWorks, getFaq, getLegal } = require('../controllers/contentController');
const { getReviewedFeedbacks } = require('../controllers/feedbackController');

// Simple database middleware
const withDB = (handler) => {
  return async (req, res) => {
    try {
      await connectDB();
      return await handler(req, res);
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Database operation failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Service unavailable'
      });
    }
  };
};

// Routes with database connection middleware
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: isConnected ? 'connected' : 'disconnected'
  });
});

// Content routes - simplified without auth middleware
app.get('/api/content/home/why-book', withDB(async (req, res) => {
  try {
    await getHomeWhyBook(req, res);
  } catch (error) {
    console.error('Why Book route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch why book content',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}));

app.get('/api/content/home/how-it-works', withDB(async (req, res) => {
  try {
    await getHomeHowItWorks(req, res);
  } catch (error) {
    console.error('How It Works route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch how it works content',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}));

app.get('/api/content/faq', withDB(async (req, res) => {
  try {
    await getFaq(req, res);
  } catch (error) {
    console.error('FAQ route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ content',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}));

app.get('/api/content/legal', withDB(async (req, res) => {
  try {
    await getLegal(req, res);
  } catch (error) {
    console.error('Legal route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch legal content',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}));

// Feedback routes
app.get('/api/feedback/reviewed', withDB(async (req, res) => {
  try {
    await getReviewedFeedbacks(req, res);
  } catch (error) {
    console.error('Feedback route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviewed feedbacks',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Lab Booking System Backend API',
    status: 'Running',
    version: '1.0.0',
    endpoints: [
      '/health',
      '/api/content/home/why-book',
      '/api/content/home/how-it-works',
      '/api/content/faq',
      '/api/content/legal',
      '/api/feedback/reviewed'
    ]
  });
});

// Enhanced 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    url: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      '/health',
      '/api/content/home/why-book',
      '/api/content/home/how-it-works',
      '/api/content/faq',
      '/api/content/legal',
      '/api/feedback/reviewed'
    ]
  });
});

// Enhanced global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  // Don't send error stack in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(isDevelopment && { 
      stack: error.stack,
      details: error 
    }),
    timestamp: new Date().toISOString()
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Export for Vercel serverless deployment
module.exports = app;