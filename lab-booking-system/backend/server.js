const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

// Load environment variables
dotenv.config();

// Import routes and middleware
const sessionConfig = require('./middleware/sessionMiddleware');
const { showLoadingIndicator, hideLoadingIndicator } = require('./middleware/loadingMiddleware');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// MongoDB connection function for local development and production
async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected');
    return mongoose.connection;
  }

  // Use MongoDB Atlas for production, local for development
  const mongoURI = process.env.NODE_ENV === 'production' 
    ? process.env.MONGODB_ATLAS_URI 
    : process.env.MONGODB_URI || 'mongodb://localhost:27017/lab_appointment';
  
  if (!mongoURI) {
    throw new Error('MongoDB URI not found in environment variables');
  }

  console.log('🔗 Connecting to MongoDB:', process.env.NODE_ENV === 'production' ? 'Atlas (Production)' : 'Local (Development)');

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('✅ MongoDB connected successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    throw error;
  }
}

// Load all models to ensure they are registered
require('./models/user');
require('./models/feedback');
require('./models/homeHowItWorks');
require('./models/homeWhyBook');
require('./models/booking');
require('./models/test');
require('./models/package');
require('./models/faq');
require('./models/serviceContent');
require('./models/termsContent');
require('./models/privacyPolicy');
require('./models/AboutContent');
require('./models/healthConcern');


const app = express();

// Middleware - JSON parsing first
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration for development and production
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      // Local development origins
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:5173",
      // Production Vercel frontend
      "https://lab-booking-system-yfpt.vercel.app",
      "https://lab-booking-system-iota.vercel.app",
      "https://lab-booking-system.vercel.app",
      // Add your actual Vercel domain here
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove any undefined values

    console.log('CORS request from origin:', origin);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      console.log('CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Session middleware after JSON parsing - only apply to routes that need authentication
app.use('/api/auth', sessionConfig);
app.use('/api/bookings', sessionConfig);
app.use('/api/notifications', sessionConfig);
app.use('/api/feedback', sessionConfig);
app.use('/api/contact', sessionConfig);
app.use('/api/service-content', sessionConfig);
app.use('/api/terms', sessionConfig);
app.use('/api/privacy', sessionConfig);
app.use('/api/about', sessionConfig);
app.use('/api/payments', sessionConfig);
app.use('/api/reports', sessionConfig);
app.use('/api/tests', sessionConfig);
app.use('/api/packages', sessionConfig);
app.use('/api/test-details', sessionConfig);
app.use('/api/package-details', sessionConfig);
app.use('/api/faq', sessionConfig);
app.use('/api/health-concerns', sessionConfig);
app.use('/api/catalog', sessionConfig);
app.use('/api/appointment', sessionConfig);
app.use('/api/user', sessionConfig);
app.use('/api/session', sessionConfig);
app.use('/api/admin', sessionConfig);

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Enhanced request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const origin = req.headers.origin || 'no-origin';
  
  console.log(`[${timestamp}] ${req.method} ${req.path} - Origin: ${origin}`);
  
  // Log authentication headers for debugging
  if (req.headers.authorization) {
    console.log('Auth Header:', req.headers.authorization.substring(0, 20) + '...');
  }
  
  next();
});

// Public content routes - no authentication required
app.get('/public/content/home/why-book', require('./controllers/contentController').getHomeWhyBook);
app.get('/public/content/home/how-it-works', require('./controllers/contentController').getHomeHowItWorks);
app.get('/api/content/home/why-book', require('./controllers/contentController').getHomeWhyBook);
app.get('/api/content/home/how-it-works', require('./controllers/contentController').getHomeHowItWorks);
app.get('/public/content/faq', require('./controllers/contentController').getFaq);
app.get('/public/content/legal', require('./controllers/contentController').getLegal);

// Simple test endpoint (no database required)
app.get('/test', (req, res) => {
  res.status(200).json({ 
    message: 'Test endpoint working!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    vercel: process.env.VERCEL || 'false'
  });
});

// Health check endpoint for local monitoring
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
    
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: 'development',
      database: {
        status: dbStatus,
        state: dbState
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// API health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
    
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        state: dbState
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/otp', require('./routes/otpRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/service-content', require('./routes/serviceContentRoutes'));
app.use('/api/terms', require('./routes/termsContentRoutes'));
app.use('/api/privacy', require('./routes/privacyRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/test-details', require('./routes/testDetailRoutes'));
app.use('/api/package-details', require('./routes/packageDetailRoutes'));
app.use('/api/faq', require('./routes/faqRoutes'));
app.use('/api/health-concerns', require('./routes/healthConcernRoutes'));
app.use('/api', require('./routes/catalogRoutes'));
app.use('/api', require('./routes/appointmentRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/session', require('./routes/sessionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

//auth-verify-OTP 
app.post('/auth-verify-OTP', require('./controllers/authController').verifyOtp);

// Fix for /appoinment typo
app.use('/appoinment', require('./routes/appointmentRoutes'));

// Root route for local development and Vercel production
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Lab Booking System Backend API - Vercel Production'
      : 'Lab Booking System Backend API - Local Development',
    status: 'Running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      api: '/api',
      cors_test: '/api/cors-test'
    },
    timestamp: new Date().toISOString()
  });
});

// CORS test endpoint for local development
app.get('/api/cors-test', (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5173"
  ];
  
  res.status(200).json({ 
    message: 'CORS test successful - Local Development',
    origin: origin,
    isAllowed: allowedOrigins.includes(origin),
    allowedOrigins: allowedOrigins,
    headers: {
      'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
      'Vary': res.getHeader('Vary'),
      'Access-Control-Allow-Methods': res.getHeader('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': res.getHeader('Access-Control-Allow-Headers'),
      'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials')
    },
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to test models
app.get('/api/debug/models', async (req, res) => {
  try {
    console.log('=== DEBUG: Testing models ===');
    
    console.log('Mongoose version:', mongoose.version);
    console.log('Connection state:', mongoose.connection.readyState);
    
    // Test Feedback model
    const Feedback = mongoose.model('Feedback');
    console.log('Feedback model loaded:', !!Feedback);
    
    // Test HomeHowItWorks model
    const HomeHowItWorks = mongoose.model('HomeHowItWorks');
    console.log('HomeHowItWorks model loaded:', !!HomeHowItWorks);
    
    res.status(200).json({
      success: true,
      message: 'Models loaded successfully',
      models: {
        Feedback: !!Feedback,
        HomeHowItWorks: !!HomeHowItWorks
      },
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading models',
      error: error.message,
      stack: error.stack
    });
  }
});

// Enhanced error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server for local development only
const PORT = process.env.PORT || 5001;

// Check if we're in Vercel environment
const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';

if (!isVercel) {
  // Local development: Start HTTP server and WebSocket
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  // Connect to database before starting server
  connectDB().then(() => {
    // WebSocket connection handling
    wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection established');
      
      try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const userId = url.searchParams.get('userId');
        const token = url.searchParams.get('token');
        
        if (!userId || !token) {
          ws.close(1008, 'Authentication required');
          return;
        }
        
        ws.userId = userId;
        ws.token = token;
        ws.isAlive = true;
        
        ws.on('pong', () => { ws.isAlive = true; });
        
        ws.on('message', (message) => {
          try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === 'authenticate' && parsedMessage.userId) {
              ws.userId = parsedMessage.userId;
            }
            if (parsedMessage.type === 'ping') {
              ws.send(JSON.stringify({ type: 'pong' }));
            }
          } catch (error) {
            console.error('WebSocket message error:', error);
          }
        });

        ws.on('close', () => {
          console.log(`WebSocket closed for user ${userId}`);
        });

        ws.on('error', (error) => {
          console.error(`WebSocket error for user ${userId}:`, error);
        });
        
      } catch (error) {
        console.error('WebSocket connection setup error:', error);
        ws.close(1011, 'Internal server error');
      }
    });

    const heartbeatInterval = setInterval(() => {
      wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
          ws.terminate();
          return;
        }
        ws.isAlive = false;
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        }
      });
    }, 30000);

    wss.on('close', () => {
      clearInterval(heartbeatInterval);
    });

    server.listen(PORT, () => {
      console.log(`🚀 Local server running on port ${PORT}`);
      console.log(`🌐 API available at: http://localhost:${PORT}`);
      console.log(`🔌 WebSocket server running on ws://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  }).catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });
} else {
  // Vercel production: Connect to database and export app
  connectDB().then(() => {
    console.log('✅ Database connected for Vercel deployment');
  }).catch(error => {
    console.error('❌ Failed to connect to database for Vercel deployment:', error);
  });
}

// Export for Vercel serverless functions
module.exports = app;

