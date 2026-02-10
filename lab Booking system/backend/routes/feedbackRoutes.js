const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  createPublicFeedback, 
  getReviewedFeedbacks,
  createUserFeedback,
  getMyFeedbacks,
  getAllFeedbacks,
  updateFeedbackStatus,
  deleteFeedback
} = require('../controllers/feedbackController');

// Public feedback submission - no auth required
router.route('/public').post(createPublicFeedback);

router.route('/reviewed').get(getReviewedFeedbacks);

router.route('/user').post(protect, createUserFeedback);
router.route('/my').get(protect, getMyFeedbacks);

// Admin only routes
router.route('/').get(protect, authorize('admin'), getAllFeedbacks);
router.route('/:id/status').put(protect, authorize('admin'), updateFeedbackStatus);
router.route('/:id').delete(protect, authorize('admin'), deleteFeedback);

module.exports = router;
