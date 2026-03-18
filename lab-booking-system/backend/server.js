const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const WebSocket = require('ws');
const sessionConfig = require('./middleware/sessionMiddleware');
const { showLoadingIndicator, hideLoadingIndicator } = require('./middleware/loadingMiddleware');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware - JSON parsing first
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Dynamic CORS middleware - custom implementation
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
  
  next();
});

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
app.get('/public/content/faq', require('./controllers/contentController').getFaq);
app.get('/public/content/legal', require('./controllers/contentController').getLegal);

// Routes
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

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route for Vercel
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Lab Booking System Backend API',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      cors_test: '/api/cors-test'
    },
    timestamp: new Date().toISOString()
  });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  const origin = req.headers.origin;
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
  
  res.status(200).json({ 
    message: 'CORS test successful',
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
    
    const mongoose = require('mongoose');
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

const PORT = process.env.PORT || 5000;

// Start server for local development
const server = http.createServer(app);

// WebSocket setup (only for local development)
const wss = new WebSocket.Server({ server });
const bookingController = require('./controllers/bookingController');
bookingController.setWebSocketServer(wss);

  wss.on('connection', (ws, req) => {
    console.log('✅ New WebSocket connection established');
    
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
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ WebSocket server running on ws://localhost:${PORT}`);
  });

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

// Export for Vercel serverless deployment
module.exports = app;
