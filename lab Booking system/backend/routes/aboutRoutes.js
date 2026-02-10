const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAboutContent,
  updateAboutContent,
  addSection,
  updateSection,
  deleteSection
} = require('../controllers/aboutController');

// Public routes
router.get('/', getAboutContent);

// Admin only routes
router.put('/', protect, authorize('admin'), updateAboutContent);
router.post('/section', protect, authorize('admin'), addSection);
router.put('/section/:sectionId', protect, authorize('admin'), updateSection);
router.delete('/section/:sectionId', protect, authorize('admin'), deleteSection);

module.exports = router;
