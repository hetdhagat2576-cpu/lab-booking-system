const express = require('express');
const router = express.Router();
const {
  getPackageDetails,
  updatePackageDetails
} = require('../controllers/packageDetailController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/:id/details', getPackageDetails);

// Admin only routes
router.put('/:id/details', protect, authorize('admin'), updatePackageDetails);

module.exports = router;
