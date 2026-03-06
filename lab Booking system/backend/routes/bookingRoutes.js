const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getBookings, 
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  rescheduleBooking,
  getUserBookings,
  getInProgressBookings 
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { showLoadingIndicator, hideLoadingIndicator } = require('../middleware/loadingMiddleware');

// Protected routes with loading indicator
router.post('/', protect, showLoadingIndicator, createBooking, hideLoadingIndicator);
router.get('/', protect, showLoadingIndicator, getBookings, hideLoadingIndicator);

// User specific routes with loading indicator
router.get('/my', protect, showLoadingIndicator, getUserBookings, hideLoadingIndicator);
router.get('/in-progress', protect, showLoadingIndicator, getInProgressBookings, hideLoadingIndicator);

// Individual booking routes with loading indicator
router.get('/:id', protect, showLoadingIndicator, getBookingById, hideLoadingIndicator);
router.patch('/:id/status', protect, showLoadingIndicator, updateBookingStatus, hideLoadingIndicator);
router.patch('/:id/reschedule', protect, showLoadingIndicator, rescheduleBooking, hideLoadingIndicator);

// Admin only routes with loading indicator
router.delete('/:id', protect, authorize('admin'), showLoadingIndicator, deleteBooking, hideLoadingIndicator);

module.exports = router;
