const express = require('express');
const router = express.Router();
const {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  getPackageCategories,
  getPopularPackages,
  getRecommendedPackages,
  getPackageDetails
} = require('../controllers/packageController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllPackages);
router.get('/categories', getPackageCategories);
router.get('/popular', getPopularPackages);
router.get('/recommended', getRecommendedPackages);
router.get('/:id', getPackageById);

// Admin only routes
router.post('/', protect, authorize('admin'), createPackage);
router.put('/:id', protect, authorize('admin'), updatePackage);
router.delete('/:id', protect, authorize('admin'), deletePackage);

module.exports = router;
