const express = require('express');
const router = express.Router();
const { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUserNotifications);
router.route('/:notificationId/read').patch(protect, markNotificationAsRead);
router.route('/read-all').patch(protect, markAllNotificationsAsRead);
router.route('/:notificationId').delete(protect, deleteNotification);

module.exports = router;
