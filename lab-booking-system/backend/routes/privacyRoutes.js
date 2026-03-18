const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getPrivacyPolicy,
  updatePrivacyPolicy,
  addPrivacySection,
  updatePrivacySection,
  deletePrivacySection
} = require('../controllers/privacyController');

// Get privacy policy (public)
router.get('/', getPrivacyPolicy);

// Get privacy policy for public display
router.get('/public', async (req, res) => {
  try {
    const PrivacyPolicy = require('../models/privacyPolicy');
    const policy = await PrivacyPolicy.getPolicy();
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'No privacy policy available'
      });
    }
    
    const sortedSections = policy.sections
      .sort((a, b) => a.order - b.order);

    res.status(200).json({
      success: true,
      data: {
        title: policy.title,
        sections: sortedSections,
        lastUpdated: policy.lastUpdated
      }
    });
  } catch (error) {
    console.error('Get public privacy policy error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching privacy policy',
      error: error.message
    });
  }
});

// Update privacy policy (admin only)
router.put('/', protect, authorize('admin'), updatePrivacyPolicy);

// Add section (admin only)
router.post('/sections', protect, authorize('admin'), addPrivacySection);

// Update section (admin only)
router.put('/sections/:sectionId', protect, authorize('admin'), updatePrivacySection);

// Delete section (admin only)
router.delete('/sections/:sectionId', protect, authorize('admin'), deletePrivacySection);

module.exports = router;
