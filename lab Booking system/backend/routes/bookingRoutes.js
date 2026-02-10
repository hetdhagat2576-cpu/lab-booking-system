const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus, getInProgressBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking).get(protect, getBookings);
router.route('/in-progress').get(protect, getInProgressBookings);
router.route('/:bookingId/status').patch(protect, updateBookingStatus);
router.route('/:bookingId').put(protect, updateBookingStatus);

module.exports = router;
