const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getServiceFeatures,
  getServiceHighlights,
  getServiceContent,
  updateServiceContent,
  addServiceFeature,
  updateServiceFeature,
  deleteServiceFeature,
  addServiceHighlight,
  updateServiceHighlight,
  deleteServiceHighlight
} = require('../controllers/serviceContentController');

// Get service features
router.get('/features', getServiceFeatures);

// Get service highlights
router.get('/highlights', getServiceHighlights);

// Get all service content (for backward compatibility)
router.get('/', getServiceContent);

// Update service content (admin only)
router.put('/', protect, authorize('admin'), updateServiceContent);

// Add feature (admin only)
router.post('/features', protect, authorize('admin'), addServiceFeature);

// Update feature (admin only)
router.put('/features/:id', protect, authorize('admin'), updateServiceFeature);

// Delete feature (admin only)
router.delete('/features/:id', protect, authorize('admin'), deleteServiceFeature);

// Add highlight (admin only)
router.post('/highlights', protect, authorize('admin'), addServiceHighlight);

// Update highlight (admin only)
router.put('/highlights/:id', protect, authorize('admin'), updateServiceHighlight);

// Delete highlight (admin only)
router.delete('/highlights/:id', protect, authorize('admin'), deleteServiceHighlight);

module.exports = router;
