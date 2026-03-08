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

// Add debugging middleware
router.use((req, res, next) => {
  console.log('BOOKING ROUTE DEBUG:', req.method, req.originalUrl, req.params);
  next();
});

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

// Dedicated cancellation route for users (simplified)
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    console.log('CANCEL BOOKING DEBUG - Route reached');
    console.log('Method:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('Params:', req.params);
    console.log('User:', req.user ? req.user._id : 'No user');
    
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
    }

    // Validate ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }

    const Booking = require('../models/booking');
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    console.log('Booking cancelled successfully:', id);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
});

console.log('Booking cancel route registered');

// Admin only routes with loading indicator
router.delete('/:id', protect, authorize('admin'), showLoadingIndicator, deleteBooking, hideLoadingIndicator);

module.exports = router;
