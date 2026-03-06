const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  createPublicFeedback, 
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  getReviewedFeedbacks,
  createUserFeedback,
  getMyFeedbacks
} = require('../controllers/feedbackController');

// Public feedback submission - no auth required
router.route('/public').post(createPublicFeedback);

// Get reviewed feedbacks - public access
router.route('/reviewed').get(getReviewedFeedbacks);

// User feedback routes
router.route('/user').post(protect, createUserFeedback);
router.route('/my').get(protect, getMyFeedbacks);

// Admin routes
router.route('/').get(protect, authorize('admin'), getAllFeedbacks);
router.route('/:id').get(protect, authorize('admin'), getFeedbackById);
router.route('/:id').put(protect, authorize('admin'), updateFeedback);
router.route('/:id/status').put(protect, authorize('admin'), updateFeedbackStatus);
router.route('/:id').delete(protect, authorize('admin'), deleteFeedback);

module.exports = router;
