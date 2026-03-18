const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        'mongodb+srv://hetdhagat2576:hN5tCKK9auWfZpZx@labbooking.q9gns.mongodb.net/labbooking?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    );

    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB error:', error);
    throw error;
  }
};

module.exports = async (req, res) => {
  // ✅ CORS FIX START - Dynamic single-origin CORS
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://lab-booking-frontend.vercel.app',
    'https://lab-booking-frontend-l2ki0uzr8-hetdhagat2576-8656s-projects.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173'
  ].filter(Boolean);

  const origin = req.headers.origin;

  // Set single origin or no header if not allowed
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Required headers
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  // ✅ CORS FIX END

  try {
    await connectDB();

    const { url, method } = req;

    // ✅ Health
    if (url === '/health' && method === 'GET') {
      return res.status(200).json({
        status: 'OK',
        time: new Date().toISOString(),
        cors: {
          origin: req.headers.origin,
          allowedOrigins: allowedOrigins,
          isAllowed: allowedOrigins.includes(req.headers.origin),
          headers: {
            'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
            'Vary': res.getHeader('Vary'),
            'Access-Control-Allow-Methods': res.getHeader('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': res.getHeader('Access-Control-Allow-Headers'),
            'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials')
          }
        }
      });
    }

    // ✅ Feedback API
    if (url === '/api/feedback/reviewed' && method === 'GET') {
      try {
        require('../models/user');
        const Feedback = require('../models/feedback');

        const data = await Feedback.find({
          status: { $in: ['reviewed', 'new', 'pending', 'positive'] }
        })
          .sort({ createdAt: -1 })
          .lean();

        return res.status(200).json({
          success: true,
          data
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }
    }

    // ✅ How it works API
    if (url === '/api/content/home/how-it-works' && method === 'GET') {
      try {
        const HomeHowItWorks = require('../models/homeHowItWorks');

        const data = await HomeHowItWorks.find({ isActive: true })
          .sort({ order: 1 })
          .lean();

        return res.status(200).json({
          success: true,
          data
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }
    }

    // ❌ 404
    return res.status(404).json({
      success: false,
      message: 'Route not found'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};