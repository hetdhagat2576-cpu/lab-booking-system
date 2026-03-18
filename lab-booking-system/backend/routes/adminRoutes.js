const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAllUsersForAdmin, deleteUserByAdmin, blockUserByAdmin, unblockUserByAdmin } = require('../controllers/authController');
const { replyToContact } = require('../controllers/contactController');

// Get all users (admin only)
router.get('/users', protect, authorize('admin'), getAllUsersForAdmin);

// Delete user by ID (admin only)
router.delete('/users/:id', protect, authorize('admin'), deleteUserByAdmin);

// Block user by ID (admin only)
router.patch('/users/:id/block', protect, authorize('admin'), blockUserByAdmin);

// Unblock user by ID (admin only)
router.patch('/users/:id/unblock', protect, authorize('admin'), unblockUserByAdmin);

// Reply to contact request (admin only)
router.post('/contact-reply/:contactId', protect, authorize('admin'), replyToContact);

module.exports = router;
