const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrder, verifyAndCreateBooking } = require('../controllers/paymentController');

router.post('/appointment-payment', protect, createOrder);
router.post('/verify', protect, verifyAndCreateBooking);

module.exports = router;
