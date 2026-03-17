const Booking = require('../models/booking');
const { 
  sendBookingApprovalNotification, 
  sendBookingRejectionNotification 
} = require('../services/notificationService');
const { createNotification } = require('../controllers/notificationController');

// WebSocket reference - will be set from server.js
let wss = null;

const setWebSocketServer = (websocketServer) => {
  wss = websocketServer;
};

const broadcastToLabTechnicians = (message) => {
  if (!wss) return;
  
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

const sendNotificationToUser = (userId, notification) => {
  if (!wss) {
    console.log('⚠️ WebSocket server not available');
    return;
  }
  
  console.log(`🔔 Sending notification to user ${userId}:`, notification.title);
  console.log(`📊 Active WebSocket clients: ${wss.clients.size}`);
  
  let sent = false;
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      console.log(`🔍 Client userId: ${client.userId}, Target userId: ${userId}`);
      if (client.userId === userId) {
        client.send(JSON.stringify({
          type: 'notification',
          data: notification
        }));
        console.log(`✅ Notification sent to user ${userId}`);
        sent = true;
      }
    }
  });
  
  if (!sent) {
    console.log(`❌ No active WebSocket connection found for user ${userId}`);
  }
};
const createBooking = async (req, res) => {
  try {
    const { 
      labAppointment, 
      labName,
      date, 
      time, 
      duration, 
      patientName,
      packageName,
      packagePrice,
      totalAmount,
      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId,
      purpose,
      selectedTests,
      rescheduleFrom,
    } = req.body;

    if (!labAppointment && !labName) {
      return res.status(400).json({
        success: false,
        message: 'Hospital lab appointment is required',
      });
    }
    if (!date || !time || !duration) {
      console.warn('Create booking missing fields:', { date, time, duration });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      labAppointment: labAppointment || labName,
      labName: labAppointment || labName,
      date,
      time,
      duration,
      purpose: purpose || packageName || 'Lab Test',
      patientName: `${req.user.name} (${req.user.email})`, // Auto-populate with user name and email
      packageName,
      packagePrice: packagePrice || 0,
      totalAmount: totalAmount || 0,
      paymentStatus: paymentStatus || 'pending',
      razorpayOrderId,
      razorpayPaymentId,
      status: 'pending',
      adminStatus: 'pending',
      selectedTests: req.body.selectedTests || [],
      rescheduleFrom: rescheduleFrom || null,
    });

    // Broadcast WebSocket message for new booking
    broadcastToLabTechnicians({
      type: 'booking_created',
      data: {
        booking: {
          _id: booking._id,
          patientName: booking.patientName,
          labName: booking.labName,
          labAppointment: booking.labAppointment,
          date: booking.date,
          time: booking.time,
          purpose: booking.purpose,
          packageName: booking.packageName,
          status: booking.status,
          adminStatus: booking.adminStatus,
          rescheduleFrom: booking.rescheduleFrom,
          user: booking.user
        },
        timestamp: new Date().toISOString()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully. Awaiting admin approval.',
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
    });
  }
};

const getBookings = async (req, res) => {
  try {
    console.log('DEBUG: req.user =', req.user);
    console.log('DEBUG: req.user type =', typeof req.user);
    
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    // For lab technicians, only show approved bookings
    if (req.user.role === 'labtechnician') {
      const bookings = await Booking.find({ 
        adminStatus: 'approved' 
      })
      .populate('user', 'name email')
      .sort({ date: 1, time: 1 });

      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    }

    // For regular users, show their own bookings
    // For admins, show all bookings
    const query = req.user.role === 'admin' 
      ? {} 
      : { user: req.user._id };

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('rescheduleFrom', '_id patientName date time')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message,
    });
  }
};

// Update booking status (for lab technicians)
const updateBookingStatus = async (req, res) => {
  try {
    console.log('=== BOOKING STATUS UPDATE DEBUG ===');
    console.log('DEBUG: Full request URL:', req.originalUrl);
    console.log('DEBUG: Request path:', req.path);
    console.log('DEBUG: Request params:', req.params);
    console.log('DEBUG: Request query:', req.query);
    console.log('DEBUG: Request body:', req.body);
    console.log('DEBUG: Request headers:', req.headers);
    console.log('DEBUG: Request method:', req.method);
    
    // Test response to verify route is reached
    console.log('DEBUG: Route updateBookingStatus reached successfully');
    
    const { id } = req.params;
    const { status, adminStatus, rejectionReason } = req.body;

    console.log('DEBUG: Extracted id:', id);
    console.log('DEBUG: Extracted status:', status);
    console.log('DEBUG: Extracted adminStatus:', adminStatus);
    console.log('DEBUG: Type of id:', typeof id);
    console.log('DEBUG: Length of id:', id ? id.length : 'undefined');

    if (!id) {
      console.log('ERROR: No ID found in request params');
      console.log('ERROR: Available params:', Object.keys(req.params));
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required',
        debug: {
          params: req.params,
          body: req.body,
          url: req.originalUrl
        }
      });
    }

    // Validate MongoDB ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('ERROR: Invalid MongoDB ObjectId format:', id);
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format',
        debug: {
          receivedId: id,
          idType: typeof id,
          idLength: id.length
        }
      });
    }

    // Validate status
    if (!status && !adminStatus) {
      return res.status(400).json({
        success: false,
        message: 'Status or adminStatus is required',
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Handle admin status updates (for admin approval/rejection)
    if (adminStatus) {
      const validAdminStatuses = ['pending', 'approved', 'rejected'];
      if (!validAdminStatuses.includes(adminStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid adminStatus. Must be one of: ${validAdminStatuses.join(', ')}`,
        });
      }

      // Only admins can update adminStatus
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can update admin status',
        });
      }

      // Prevent admin actions on cancelled bookings
      if (booking.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Cannot approve or reject a cancelled booking',
        });
      }

      booking.adminStatus = adminStatus;
      
      // Add rejection reason if provided
      if (adminStatus === 'rejected' && rejectionReason) {
        booking.rejectionReason = rejectionReason;
      }

      // Create notification and send email for the user
      try {
        console.log(`Creating notification for booking user: ${booking.user}`);
        console.log(`Admin status: ${adminStatus}`);
        
        if (adminStatus === 'approved') {
          // Send approval notification and email
          const notificationResult = await sendBookingApprovalNotification(booking);
          console.log('✅ Approval notification and email sent');
          
          // Send WebSocket notification to user
          if (notificationResult.success) {
            sendNotificationToUser(booking.user, {
              title: 'Booking Approved! 🎉',
              message: `Your booking for ${booking.labName || booking.labAppointment} on ${booking.date} at ${booking.time} has been approved.`,
              type: 'success',
              relatedBooking: booking._id
            });
          }
          
        } else if (adminStatus === 'rejected') {
          // Send rejection notification and email
          const notificationResult = await sendBookingRejectionNotification(booking, rejectionReason);
          console.log('✅ Rejection notification and email sent');
          
          // Send WebSocket notification to user
          if (notificationResult.success) {
            sendNotificationToUser(booking.user, {
              title: 'Booking Rejected ❌',
              message: `Your booking for ${booking.labName || booking.labAppointment} on ${booking.date} at ${booking.time} has been rejected.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`,
              type: 'error',
              relatedBooking: booking._id
            });
          }
        }

      } catch (notificationError) {
        console.error('❌ Failed to create notification:', notificationError);
        // Continue with the booking update even if notification fails
      }
      
      // Send WebSocket message when booking is approved
      if (adminStatus === 'approved') {
        console.log('Broadcasting booking approval message');
        broadcastToLabTechnicians({
          type: 'booking_approved',
          data: {
            booking: {
              _id: booking._id,
              patientName: booking.patientName,
              labName: booking.labName,
              labAppointment: booking.labAppointment,
              date: booking.date,
              time: booking.time,
              purpose: booking.purpose,
              packageName: booking.packageName,
              user: booking.user
            },
            timestamp: new Date().toISOString()
          }
        });

        console.log('Booking approval message sent via WebSocket');

      }

      console.log('Booking rejection processed');
    }

    // Handle booking status updates (for lab technicians and users)
    if (status) {
      const validStatuses = ['pending', 'confirmed', 'in_progress', 'testing', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
      }

      // Handle user cancellation - users can only cancel their own bookings
      if (req.user.role === 'user' && status === 'cancelled') {
        // Check if this booking belongs to the user
        if (booking.user.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            success: false,
            message: 'You can only cancel your own bookings',
          });
        }

        // Users can only cancel bookings that are not already completed or cancelled
        if (booking.status === 'completed') {
          return res.status(400).json({
            success: false,
            message: 'Cannot cancel a completed booking',
          });
        }

        if (booking.status === 'cancelled') {
          return res.status(400).json({
            success: false,
            message: 'Booking is already cancelled',
          });
        }

        // Users can cancel pending or confirmed bookings
        if (!['pending', 'confirmed'].includes(booking.status)) {
          return res.status(400).json({
            success: false,
            message: 'Cannot cancel booking that is in progress or testing',
          });
        }

        booking.status = status;
        
        // Create notification for user about cancellation
        try {
          const notification = await createNotification(
            booking.user,
            'Booking Cancelled',
            'Your booking has been cancelled successfully.',
            'info',
            'booking',
            booking._id
          );
          
          // Send real-time notification via WebSocket
          if (notification) {
            sendNotificationToUser(booking.user.toString(), {
              title: notification.title,
              message: notification.message,
              type: notification.type,
              relatedBooking: booking._id
            });
          }
        } catch (notificationError) {
          console.error('Failed to create cancellation notification:', notificationError);
        }
      }
      // Lab technician status updates
      else if (req.user.role === 'labtechnician') {
        // Only allow lab technicians to update status of approved bookings
        if (booking.adminStatus !== 'approved') {
          return res.status(403).json({
            success: false,
            message: 'You can only update approved bookings',
          });
        }

        booking.status = status;
      }
      // Admin can update any booking status
      else if (req.user.role === 'admin') {
        booking.status = status;
      }
      // Regular users trying to set other statuses (not allowed)
      else if (req.user.role === 'user') {
        return res.status(403).json({
          success: false,
          message: 'Users can only cancel bookings, not set other statuses',
        });
      }
    }

    await booking.save();

    // Broadcast WebSocket message for booking status update
    broadcastToLabTechnicians({
      type: 'booking_status_updated',
      data: {
        booking: {
          _id: booking._id,
          patientName: booking.patientName,
          labName: booking.labName,
          labAppointment: booking.labAppointment,
          date: booking.date,
          time: booking.time,
          purpose: booking.purpose,
          packageName: booking.packageName,
          status: booking.status,
          adminStatus: booking.adminStatus,
          rescheduleFrom: booking.rescheduleFrom,
          user: booking.user
        },
        timestamp: new Date().toISOString()
      }
    });

    console.log(`Booking ${id} updated by ${req.user.role}:`, { status, adminStatus });
    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message,
    });
  }
};

const getInProgressBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      status: 'in-progress',
      adminStatus: 'approved'
    })
    .populate('user', 'name email')
    .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Get in-progress bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching in-progress bookings',
      error: error.message,
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('user', 'name email')
      .populate('test', 'name description price')
      .populate('package', 'name description price');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message,
    });
  }
};

// Delete booking (Admin only)
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findByIdAndDelete(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Send notification to user about booking deletion
    if (booking.user) {
      await sendNotificationToUser(booking.user, {
        title: 'Booking Cancelled',
        message: `Your booking for ${booking.test?.name || booking.package?.name || 'Test'} has been cancelled.`,
        type: 'booking_cancelled',
        bookingId: booking._id
      });
    }
    
    // Create notification for admin
    try {
      const notification = await createNotification(
        req.user._id,
        'Booking Deleted',
        `You have deleted booking for ${booking.patientName || booking.user.name}`,
        'error',
        'admin_action',
        booking._id
      );
      console.log('✅ Admin deletion notification created');
    } catch (adminNotificationError) {
      console.error('Failed to create admin notification:', adminNotificationError);
    }
    
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message,
    });
  }
};

// Reschedule booking
const rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newTime, reason } = req.body;
    
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Store old values for notification
    const oldDate = booking.date;
    const oldTime = booking.time;
    
    // Update booking
    booking.date = newDate;
    booking.time = newTime;
    booking.rescheduleFrom = { date: oldDate, time: oldTime };
    booking.rescheduleReason = reason;
    booking.status = 'rescheduled';
    
    await booking.save();
    
    // Send notification to user
    if (booking.user) {
      await sendNotificationToUser(booking.user, {
        title: 'Booking Rescheduled',
        message: `Your booking has been rescheduled from ${oldDate} ${oldTime} to ${newDate} ${newTime}`,
        type: 'booking_rescheduled',
        bookingId: booking._id
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Booking rescheduled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Reschedule booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rescheduling booking',
      error: error.message,
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;
    
    let filter = { user: req.user._id };
    if (status) {
      filter.status = status;
    }
    
    const bookings = await Booking.find(filter)
      .populate('test', 'name description price')
      .populate('package', 'name description price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Booking.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  rescheduleBooking,
  getUserBookings,
  getInProgressBookings,
  setWebSocketServer
};
