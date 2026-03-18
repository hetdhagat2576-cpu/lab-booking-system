const express = require('express');
const router = express.Router();
const {
  getTestDetails,
  updateTestDetails,
  deleteTestDetails
} = require('../controllers/testDetailController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/:id/details', getTestDetails);

// Admin only routes
router.put('/:id/details', protect, authorize('admin'), updateTestDetails);
router.delete('/:id/details', protect, authorize('admin'), deleteTestDetails);

module.exports = router;
