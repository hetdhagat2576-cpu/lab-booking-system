const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllUsersForAdmin, deleteUserByAdmin } = require('../controllers/authController');

// Get all users (admin only)
router.get('/users', protect, getAllUsersForAdmin);

// Delete user by ID (admin only)
router.delete('/users/:id', protect, deleteUserByAdmin);

module.exports = router;
