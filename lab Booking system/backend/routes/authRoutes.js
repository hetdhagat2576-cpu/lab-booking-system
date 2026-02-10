const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile, registerUserGet, verifyOtp, resendOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { verifyRecaptcha } = require('../middleware/recaptchaMiddleware');

// Register route - saves user into "users" collection of lab_appointment DB
router.post('/register', verifyRecaptcha, registerUser);
router.get('/register', registerUserGet);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// Login route - verifies email/password from "users" collection
router.post('/login', verifyRecaptcha, loginUser);

// Profile routes
router.get('/profile', protect, getProfile);
router.put('/update', protect, updateProfile);

module.exports = router;
