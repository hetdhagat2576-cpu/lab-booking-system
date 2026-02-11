const express = require('express');
const router = express.Router();
const {
  getDashboardBrowseCards,
  getDashboardStats,
  getDashboardTestsByCategory,
  searchDashboardTests
} = require('../controllers/dashboardController');

// Dashboard browse cards - categorized tests
router.get('/browse-cards', getDashboardBrowseCards);

// Dashboard statistics
router.get('/stats', getDashboardStats);

// Get tests by specific category
router.get('/category/:category', getDashboardTestsByCategory);

// Search tests across categories
router.get('/search', searchDashboardTests);

module.exports = router;
