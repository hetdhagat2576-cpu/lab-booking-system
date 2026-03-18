const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllFAQs,
  getAllFAQsAdmin,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus,
  reorderFAQs,
  getFAQCategories
} = require('../controllers/faqController');

// Get all FAQs (public)
router.get('/', getAllFAQs);

// Get all FAQs (admin - includes inactive)
router.get('/admin', protect, getAllFAQsAdmin);

// Get FAQ by ID
router.get('/:id', getFAQById);

// Create FAQ (admin only)
router.post('/', protect, createFAQ);

// Update FAQ (admin only)
router.put('/:id', protect, updateFAQ);

// Delete FAQ (admin only)
router.delete('/:id', protect, deleteFAQ);

// Toggle FAQ status (admin only)
router.patch('/:id/toggle', protect, toggleFAQStatus);

// Reorder FAQs (admin only)
router.put('/reorder', protect, reorderFAQs);

// Get FAQ categories
router.get('/categories/list', getFAQCategories);

module.exports = router;
