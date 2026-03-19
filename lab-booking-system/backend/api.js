const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Basic health and status endpoints
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Lab Booking System Backend API',
    status: 'Running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Lab Booking System API'
  });
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Export for use in other files
module.exports = app;
