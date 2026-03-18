const mongoose = require('mongoose');

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

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lab_appointment';
    
    if (!mongoURI || mongoURI === 'mongodb://localhost:27017/lab_appointment') {
      console.log('⚠️  WARNING: Using local MongoDB. This will not work in production/Vercel');
      console.log('Please set MONGODB_URI environment variable with MongoDB Atlas connection string');
    }
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected:', conn.connection.host);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('Please ensure MongoDB is running and accessible');
    console.log('For Vercel deployment, set MONGODB_URI environment variable');
    // Don't exit process, allow server to run without DB
  }
};

module.exports = connectDB;
