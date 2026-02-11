const express = require('express');
const router = express.Router();
const {
  getTestDetails,
  updateTestDetails
} = require('../controllers/testDetailController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/:id/details', getTestDetails);

// Admin only routes
router.put('/:id/details', protect, authorize('admin'), updateTestDetails);

module.exports = router;
