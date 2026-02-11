const express = require('express');
const router = express.Router();
const { 
  getHealthConcerns, 
  getHealthConcernById, 
  createHealthConcern, 
  updateHealthConcern, 
  deleteHealthConcern 
} = require('../controllers/healthConcernController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getHealthConcerns);
router.get('/:id', getHealthConcernById);

// Admin only routes
router.post('/', protect, authorize('admin'), createHealthConcern);
router.put('/:id', protect, authorize('admin'), updateHealthConcern);
router.delete('/:id', protect, authorize('admin'), deleteHealthConcern);

module.exports = router;
