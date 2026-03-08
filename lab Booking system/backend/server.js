const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const WebSocket = require('ws');
const sessionConfig = require('./middleware/sessionMiddleware');
const { showLoadingIndicator, hideLoadingIndicator } = require('./middleware/loadingMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware - JSON parsing first
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Session middleware after JSON parsing
app.use(sessionConfig);

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Pre-flight middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Request logging middleware (enhanced for debugging)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  // Log headers for debugging
  console.log('Headers:', req.headers);
  
  // Log body for POST/PUT requests (avoid logging large binary data)
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const bodyCopy = JSON.parse(JSON.stringify(req.body));
      console.log('Body:', JSON.stringify(bodyCopy, null, 2));
    } catch (e) {
      console.log('Body parsing error:', e.message);
    }
  }
  
  next();
});

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

// WebSocket setup
const wss = new WebSocket.Server({ server });

// Initialize WebSocket server in booking controller for real-time notifications
const bookingController = require('./controllers/bookingController');
bookingController.setWebSocketServer(wss);


wss.on('connection', (ws, req) => {
  console.log('🔌 New WebSocket connection established');
  
  // Extract user ID and token from query parameters
  const url = new URL(req.url, `http://${req.headers.host}`);
  const userId = url.searchParams.get('userId');
  const token = url.searchParams.get('token');
  
  console.log(`🔍 WebSocket connection attempt - UserId: ${userId}, HasToken: ${!!token}`);
  
  // Validate authentication
  if (!userId || !token) {
    console.log('❌ WebSocket connection rejected: missing userId or token');
    ws.close(1008, 'Authentication required');
    return;
  }
  
  // Here you could add additional token validation logic
  // For now, we'll accept the token and associate the connection
  ws.userId = userId;
  ws.token = token;
  console.log(`✅ WebSocket connection associated with user: ${userId}`);
  console.log(`📊 Total active WebSocket clients: ${wss.clients.size}`);
  
  ws.on('message', (message) => {
    console.log('📨 Received WebSocket message:', message);
    
    try {
      const parsedMessage = JSON.parse(message);
      
      // Handle user identification
      if (parsedMessage.type === 'authenticate' && parsedMessage.userId) {
        ws.userId = parsedMessage.userId;
        console.log(`🔄 WebSocket re-authenticated for user: ${parsedMessage.userId}`);
        return;
      }
      
      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      console.error('❌ Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`🔌 WebSocket connection closed for user ${userId}, code: ${code}, reason: ${reason}`);
    console.log(`📊 Remaining active clients: ${wss.clients.size}`);
  });

  ws.on('error', (error) => {
    console.error(`❌ WebSocket error for user ${userId}:`, error);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
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

module.exports = app;
