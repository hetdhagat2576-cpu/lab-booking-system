const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile, registerUserGet, verifyOtp, resendOtp, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Register route - saves user into "users" collection of lab_appointment DB
router.post('/register', registerUser);
router.get('/register', registerUserGet);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// Login route - verifies email/password from "users" collection
router.post('/login', loginUser);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Profile routes
router.get('/profile', protect, getProfile);
router.put('/update', protect, updateProfile);

module.exports = router;
