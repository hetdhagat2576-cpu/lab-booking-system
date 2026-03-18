// Load environment variables first
require('dotenv').config();

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

// Import the app after loading models
const app = require('../server');

// Export for Vercel serverless deployment
module.exports = app;