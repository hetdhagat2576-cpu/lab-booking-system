const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Import the main app from server.js
const app = require('./server');

// Export for Vercel serverless deployment
module.exports = app;
