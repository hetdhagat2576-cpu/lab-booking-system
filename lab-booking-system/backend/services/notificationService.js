const Notification = require('../models/notification');

const sendBookingApprovalNotification = async (booking) => {
  try {
    // Create notification in database
    const notification = await Notification.create({
      user: booking.user,
      title: 'Booking Approved! 🎉',
      message: `Your booking for ${booking.labName || booking.labAppointment} on ${booking.date} at ${booking.time} has been approved.`,
      type: 'success',
      relatedTo: 'booking',
      relatedId: booking._id,
      relatedToModel: 'Booking',
    });

    console.log('✅ Booking approval notification created:', notification._id);
    return { success: true, data: notification };
  } catch (error) {
    console.error('Error sending booking approval notification:', error);
    return { success: false, error: error.message };
  }
};

const sendBookingRejectionNotification = async (booking, rejectionReason) => {
  try {
    // Create notification in database
    const notification = await Notification.create({
      user: booking.user,
      title: 'Booking Rejected ❌',
      message: `Your booking for ${booking.labName || booking.labAppointment} on ${booking.date} at ${booking.time} has been rejected.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`,
      type: 'error',
      relatedTo: 'booking',
      relatedId: booking._id,
      relatedToModel: 'Booking',
    });

    console.log('✅ Booking rejection notification created:', notification._id);
    return { success: true, data: notification };
  } catch (error) {
    console.error('Error sending booking rejection notification:', error);
    return { success: false, error: error.message };
  }
};

const createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    console.log('✅ Generic notification created:', notification._id);
    return { success: true, data: notification };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
};

// Get unread notifications count for a user
const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({ 
      user: userId, 
      isRead: false 
    });
    return { success: true, count };
  } catch (error) {
    console.error('Error getting unread count:', error);
    return { success: false, error: error.message };
  }
};

// Get all notifications for a user
const getUserNotifications = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    
    const query = { user: userId };
    if (unreadOnly) {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .populate('relatedId', 'date time labName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    return { success: true, data: notifications };
  } catch (error) {
    console.error('Error getting user notifications:', error);
    return { success: false, error: error.message };
  }
};

// Mark notifications as read
const markAsRead = async (userId, notificationIds = null) => {
  try {
    const query = { user: userId, isRead: false };
    if (notificationIds && notificationIds.length > 0) {
      query._id = { $in: notificationIds };
    }
    
    const result = await Notification.updateMany(
      query,
      { isRead: true, readAt: new Date() }
    );
    
    return { success: true, modifiedCount: result.modifiedCount };
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingApprovalNotification,
  sendBookingRejectionNotification,
  createNotification,
  getUnreadCount,
  getUserNotifications,
  markAsRead
};
