const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, deleteAccount } = require('../controllers/authController');

// GET /api/user/profile - Display user dashboard data
router.get('/profile', protect, getProfile);

// PUT /api/user/profile - Update personal info
router.put('/profile', protect, updateProfile);

// PUT /api/user/update - Backward compatible route
router.put('/update', protect, updateProfile);

// DELETE /api/user/delete-account - Delete user account
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
