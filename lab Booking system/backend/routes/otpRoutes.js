const express = require('express');
const router = express.Router();
const { generateOtp, verifyOtp, resendOtp } = require('../controllers/otpController');

// Generate OTP for email verification
router.post('/generate', generateOtp);

// Verify OTP
router.post('/verify', verifyOtp);

// Resend OTP
router.post('/resend', resendOtp);

module.exports = router;
