const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// Global connection to avoid reconnecting on every request
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://hetdhagat2576:hN5tCKK9auWfZpZx@labbooking.q9gns.mongodb.net/labbooking?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Connection pooling
      serverSelectionTimeoutMS: 5000, // How long MongoDB tries to find a server
      socketTimeoutMS: 45000, // How long a send or receive on a socket can take
    });
    isConnected = true;
    console.log('MongoDB connected for serverless function');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = async (req, res) => {
  // Dynamic CORS handling
  const allowedOrigins = [
    'https://lab-booking-frontend.vercel.app',
    'https://lab-booking-frontend-l2ki0uzr8-hetdhagat2576-8656s-projects.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173'
  ];
  
  const origin = req.headers.origin;
  
  // Set single origin based on request
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Connect to database
    await connectDB();

    // Basic routing
    const { url, method } = req;
    
    // Health check
    if (url === '/health' && method === 'GET') {
      res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: 'production'
      });
      return;
    }

    // CORS test
    if (url === '/api/cors-test' && method === 'GET') {
      res.status(200).json({ 
        message: 'CORS test successful',
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Debug models
    if (url === '/api/debug/models' && method === 'GET') {
      try {
        // Load models dynamically
        require('../models/user');
        const Feedback = require('../models/feedback');
        const HomeHowItWorks = require('../models/homeHowItWorks');
        
        res.status(200).json({
          success: true,
          message: 'Models loaded successfully',
          models: {
            Feedback: !!Feedback,
            HomeHowItWorks: !!HomeHowItWorks,
            User: !!require('../models/user')
          },
          connectionState: mongoose.connection.readyState
        });
        return;
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error loading models',
          error: error.message
        });
        return;
      }
    }

    // Feedback reviewed endpoint
    if (url === '/api/feedback/reviewed' && method === 'GET') {
      try {
        // Load models dynamically
        require('../models/user');
        const Feedback = require('../models/feedback');
        
        // Simple query without populate for now
        const feedbacks = await Feedback.find({ status: { $in: ['reviewed', 'new', 'pending', 'positive'] } })
          .sort({ createdAt: -1 })
          .lean(); // Use lean() for better performance
        
        res.status(200).json({
          success: true,
          data: feedbacks,
          count: feedbacks.length
        });
        return;
      } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({
          success: false,
          message: 'Error fetching reviewed feedbacks',
          error: error.message
        });
        return;
      }
    }

    // Home how it works endpoint
    if (url === '/api/content/home/how-it-works' && method === 'GET') {
      try {
        // Load model dynamically
        const HomeHowItWorks = require('../models/homeHowItWorks');
        const howItWorksData = await HomeHowItWorks.find({ isActive: true })
          .sort({ order: 1, stepNumber: 1 })
          .lean(); // Use lean() for better performance
        
        res.status(200).json({
          success: true,
          data: howItWorksData
        });
        return;
      } catch (error) {
        console.error('How it works error:', error);
        res.status(500).json({
          success: false,
          message: 'Error fetching how it works',
          error: error.message
        });
        return;
      }
    }

    // 404 for unknown routes
    res.status(404).json({
      success: false,
      message: 'Route not found',
      url: url,
      method: method
    });

  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
