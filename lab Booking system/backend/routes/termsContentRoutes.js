const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAllTerms,
  updateTermsContent,
  addSection,
  updateSection,
  deleteSection
} = require('../controllers/termsController');

// Get terms content (public)
router.get('/', getAllTerms);

// Get active terms only (public endpoint for frontend)
router.get('/public', async (req, res) => {
  try {
    const TermsContent = require('../models/termsContent');
    const termsContent = await TermsContent.findOne().sort({ updatedAt: -1 });
    
    if (!termsContent || !termsContent.sections.length) {
      return res.status(404).json({
        success: false,
        message: 'No terms content available'
      });
    }
    
    const activeSections = termsContent.sections
      .filter(section => section.isActive !== false)
      .sort((a, b) => a.order - b.order);

    res.status(200).json({
      success: true,
      data: {
        sections: activeSections,
        version: termsContent.version,
        lastUpdated: termsContent.lastUpdated
      }
    });
  } catch (error) {
    console.error('Get active terms error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active terms',
      error: error.message
    });
  }
});

// Create/update terms content (admin only)
router.post('/', protect, authorize('admin'), updateTermsContent);

// Update terms content (admin only)
router.put('/', protect, authorize('admin'), updateTermsContent);

// Add section (admin only)
router.post('/sections', protect, authorize('admin'), addSection);

// Update section (admin only)
router.put('/sections/:id', protect, authorize('admin'), updateSection);

// Delete section (admin only)
router.delete('/sections/:id', protect, authorize('admin'), deleteSection);


module.exports = router;
