const express = require('express');
const cors = require('cors');
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

// Enhanced CORS middleware for Vercel deployment
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // List of explicitly allowed origins
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'http://localhost:5001', 
      'http://127.0.0.1:3000', 
      'http://127.0.0.1:3001',
      'https://backend-nine-kappa-33.vercel.app',
      'https://backend-icgwcsez0-hetdhagat2576-8656s-projects.vercel.app'
    ];
    
    // Allow any Vercel domain (both frontend and backend)
    if (origin.includes('.vercel.app')) {
      console.log(`CORS: Allowing Vercel origin: ${origin}`);
      return callback(null, true);
    }
    
    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) {
      console.log(`CORS: Allowing explicit origin: ${origin}`);
      return callback(null, true);
    }
    
    // Log blocked origins for debugging
    console.warn(`CORS: Blocking origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // Required for cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'X-CSRF-Token',
    'X-API-Key',
    'Origin',
    'Accept'
  ],
  optionsSuccessStatus: 200, // Legacy browsers choke on 204
  preflightContinue: false,
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'] // Expose custom headers
}));

// Handle preflight requests explicitly
app.options('*', cors());

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
  const userAgent = req.headers['user-agent'] || 'no-user-agent';
  
  console.log(`[${timestamp}] ${req.method} ${req.path} - Origin: ${origin}`);
  
  // Log authentication headers for debugging
  if (req.headers.authorization) {
    console.log('Auth Header:', req.headers.authorization.substring(0, 20) + '...');
  }
  
  // Log important headers
  const importantHeaders = ['content-type', 'x-requested-with', 'origin', 'referer'];
  const headerInfo = {};
  importantHeaders.forEach(header => {
    if (req.headers[header]) {
      headerInfo[header] = req.headers[header];
    }
  });
  
  if (Object.keys(headerInfo).length > 0) {
    console.log('Headers:', headerInfo);
  }
  
  // Log body for POST/PUT requests (avoid logging large binary data)
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        const bodyCopy = JSON.parse(JSON.stringify(req.body));
        console.log('Body:', JSON.stringify(bodyCopy, null, 2));
      } else {
        console.log('Body:', `[${contentType}] - ${req.body ? 'Data present' : 'No data'}`);
      }
    } catch (e) {
      console.log('Body parsing error:', e.message);
    }
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
// app.use('/api/packages/management', require('./routes/packageManagementRoutes')); // Commented out - file missing
app.use('/api/test-details', require('./routes/testDetailRoutes'));
app.use('/api/package-details', require('./routes/packageDetailRoutes'));
app.use('/api/faq', require('./routes/faqRoutes'));
app.use('/api/health-concerns', require('./routes/healthConcernRoutes'));
app.use('/api', require('./routes/catalogRoutes'));
app.use('/api', require('./routes/appointmentRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/session', require('./routes/sessionRoutes'));
// Admin routes (list users, etc.)
app.use('/api/admin', require('./routes/adminRoutes'));

//auth-verify-OTP 
app.post('/auth-verify-OTP', require('./controllers/authController').verifyOtp);

// Fix for /appoinment typo (assuming it maps to appointment history or list)
app.use('/appoinment', require('./routes/appointmentRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.status(200).json({ 
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Enhanced error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  const server = http.createServer(app);

  // WebSocket setup
  const wss = new WebSocket.Server({ server });

  // Initialize WebSocket server in booking controller for real-time notifications
  const bookingController = require('./controllers/bookingController');
  bookingController.setWebSocketServer(wss);

  wss.on('connection', (ws, req) => {
    console.log(' New WebSocket connection established');
    
    try {
      // Extract user ID and token from query parameters
      const url = new URL(req.url, `http://${req.headers.host}`);
      const userId = url.searchParams.get('userId');
      const token = url.searchParams.get('token');
      
      console.log(` WebSocket connection attempt - UserId: ${userId}, HasToken: ${!!token}`);
      
      // Validate authentication
      if (!userId || !token) {
        console.log(' WebSocket connection rejected: missing userId or token');
        ws.close(1008, 'Authentication required');
        return;
      }
      
      // Here you could add additional token validation logic
      // For now, we'll accept token and associate connection
      ws.userId = userId;
      ws.token = token;
      ws.isAlive = true; // For heartbeat/ping-pong
      
      console.log(` WebSocket connection associated with user: ${userId}`);
      console.log(` Total active WebSocket clients: ${wss.clients.size}`);
      
      // Set up heartbeat/ping-pong
      ws.on('pong', () => {
        ws.isAlive = true;
      });
      
      ws.on('message', (message) => {
        console.log(' Received WebSocket message from user:', userId);
        
        try {
          const parsedMessage = JSON.parse(message);
          
          // Handle user identification
          if (parsedMessage.type === 'authenticate' && parsedMessage.userId) {
            ws.userId = parsedMessage.userId;
            console.log(` WebSocket re-authenticated for user: ${parsedMessage.userId}`);
            return;
          }
          
          // Handle ping/pong for connection health
          if (parsedMessage.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
            return;
          }
          
          // Broadcast to all connected clients (or specific user logic)
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
          });
        } catch (error) {
          console.error(' Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', (code, reason) => {
        const closeReason = reason ? reason.toString() : 'No reason provided';
        console.log(` WebSocket connection closed for user ${userId}, code: ${code}, reason: ${closeReason}`);
        console.log(` Total active clients: ${wss.clients.size}`);
      });

      ws.on('error', (error) => {
        console.error(` WebSocket error for user ${userId}:`, error);
        
        // Handle specific error types
        if (error.code === 'ECONNRESET') {
          console.log(' Connection reset by client, will attempt cleanup');
        }
      });
      
    } catch (error) {
      console.error(' Error during WebSocket connection setup:', error);
      ws.close(1011, 'Internal server error');
    }
  });

  // Set up heartbeat interval to detect dead connections
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        console.log(' Terminating inactive WebSocket connection');
        ws.terminate();
        return;
      }
      
      ws.isAlive = false;
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    });
  }, 30000); // Check every 30 seconds

  // Clean up heartbeat interval on server close
  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
  });
}

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

module.exports = app;
