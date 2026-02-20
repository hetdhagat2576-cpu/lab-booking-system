const Booking = require('../models/booking');

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
      patientName,
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

    // Broadcast WebSocket notification for new booking
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
    const { bookingId } = req.params;
    const { status, adminStatus, rejectionReason } = req.body;

    // Validate booking ID
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required',
      });
    }

    // Validate status
    if (!status && !adminStatus) {
      return res.status(400).json({
        success: false,
        message: 'Status or adminStatus is required',
      });
    }

    const booking = await Booking.findById(bookingId);
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
      
      // Send WebSocket notification when booking is approved
      if (adminStatus === 'approved') {
        console.log('Broadcasting booking approval notification');
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
      }
    }

    // Handle booking status updates (for lab technicians)
    if (status) {
      const validStatuses = ['pending', 'confirmed', 'in_progress', 'testing', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
      }

      // Only allow lab technicians to update status of approved bookings
      if (req.user.role === 'labtechnician' && booking.adminStatus !== 'approved') {
        return res.status(403).json({
          success: false,
          message: 'You can only update approved bookings',
        });
      }

      booking.status = status;
    }

    await booking.save();

    // Broadcast WebSocket notification for booking status update
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

    console.log(`Booking ${bookingId} updated by ${req.user.role}:`, { status, adminStatus });
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

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
  getInProgressBookings,
  setWebSocketServer
};
