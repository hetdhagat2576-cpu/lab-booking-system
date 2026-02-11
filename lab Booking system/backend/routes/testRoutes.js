const express = require('express');
const router = express.Router();
const {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  getTestCategories,
  bulkUpdateTests,
  toggleTestStatus,
  getPopularTests
} = require('../controllers/testController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllTests);
router.get('/categories', getTestCategories);
router.get('/popular', getPopularTests);
router.get('/:id', getTestById);

// Admin only routes
router.post('/', protect, authorize('admin'), createTest);
router.put('/:id', protect, authorize('admin'), updateTest);
router.delete('/:id', protect, authorize('admin'), deleteTest);
router.patch('/bulk-update', protect, authorize('admin'), bulkUpdateTests);
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleTestStatus);

module.exports = router;
