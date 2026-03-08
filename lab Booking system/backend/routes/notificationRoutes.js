const express = require('express');
const router = express.Router();
const { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  createNotification 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUserNotifications);
router.route('/:notificationId/read').patch(protect, markNotificationAsRead);
router.route('/read-all').patch(protect, markAllNotificationsAsRead);
router.route('/:notificationId').delete(protect, deleteNotification);

// Test endpoint to create a notification
router.route('/test').post(protect, async (req, res) => {
  try {
    const { title, message, type = 'info' } = req.body;
    const notification = await createNotification(
      req.user._id,
      title || 'Test Notification',
      message || 'This is a test notification',
      type
    );
    
    res.status(201).json({
      success: true,
      message: 'Test notification created',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create test notification',
      error: error.message
    });
  }
});

module.exports = router;
