const Appointment = require('../models/appointment');
const Lab = require('../models/lab');
const User = require('../models/user');

// GET /api/services – List all lab packages available
async function listServices(req, res) {
  try {
    // Return empty array since tests are removed
    res.status(200).json({ success: true, data: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch services', error: err.message });
  }
}

// POST /api/appointments/book – Create a new appointment
async function bookAppointment(req, res) {
  try {
    const { labId, appointmentDate } = req.body;
    if (!labId || !appointmentDate) {
      return res.status(400).json({ success: false, message: 'labId and appointmentDate are required' });
    }
    
    const lab = await Lab.findById(labId).select('_id name');
    if (!lab) return res.status(404).json({ success: false, message: 'Lab not found' });

    const date = new Date(appointmentDate);
    if (isNaN(date.getTime())) return res.status(400).json({ success: false, message: 'Invalid appointmentDate' });

    // Prevent double booking at exact timestamp
    const existing = await Appointment.findOne({ lab: labId, appointmentDate: date, status: { $ne: 'Canceled' } });
    if (existing) return res.status(409).json({ success: false, message: 'Time slot already booked' });

    const appt = await Appointment.create({
      user: req.user?._id || null,
      lab: lab._id,
      appointmentDate: date,
      status: 'Scheduled',
    });
    res.status(201).json({ success: true, message: 'Appointment booked', data: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to book appointment', error: err.message });
  }
}

// GET /api/appointments/history – View a patient's past bookings
async function appointmentHistory(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });
    const items = await Appointment.find({ user: userId }).populate('lab', 'name').sort({ appointmentDate: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch history', error: err.message });
  }
}

// PUT /api/appointments/:id/reschedule
async function rescheduleAppointment(req, res) {
  try {
    const { id } = req.params;
    const { newDate } = req.body;
    
    if (!newDate) return res.status(400).json({ success: false, message: 'newDate is required' });

    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' });
    
    // Check authorization
    if (String(appt.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const date = new Date(newDate);
    if (isNaN(date.getTime())) return res.status(400).json({ success: false, message: 'Invalid date' });

    // Check availability
    const existing = await Appointment.findOne({ 
      lab: appt.lab, 
      appointmentDate: date, 
      status: { $ne: 'Canceled' },
      _id: { $ne: id } // Exclude self
    });
    if (existing) return res.status(409).json({ success: false, message: 'Time slot already booked' });

    appt.appointmentDate = date;
    appt.status = 'Rescheduled';
    await appt.save();

    res.status(200).json({ success: true, message: 'Appointment rescheduled', data: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reschedule appointment', error: err.message });
  }
}

// DELETE /api/appointments/:id – Cancel an appointment
async function cancelAppointment(req, res) {
  try {
    const { id } = req.params;
    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (String(appt.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    appt.status = 'Canceled';
    await appt.save();
    res.status(200).json({ success: true, message: 'Appointment canceled' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to cancel appointment', error: err.message });
  }
}

// Technicians
async function listTechnicians(req, res) {
  try {
    const technicians = await User.find({ role: 'labtechnician' }).select('_id name email phone');
    res.status(200).json({ success: true, data: technicians });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch technicians', error: err.message });
  }
}

async function getTechnician(req, res) {
  try {
    const technician = await User.findOne({ _id: req.params.id, role: 'labtechnician' }).select('_id name email phone');
    if (!technician) return res.status(404).json({ success: false, message: 'Technician not found' });
    res.status(200).json({ success: true, data: technician });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch technician', error: err.message });
  }
}

async function uploadReport(req, res) {
  try {
    const { appointmentId, reportUrl, notes } = req.body;
    if (!appointmentId || !reportUrl) return res.status(400).json({ success: false, message: 'appointmentId and reportUrl required' });
    
    const appt = await Appointment.findById(appointmentId);
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' });
    
    appt.reportUrl = reportUrl;
    appt.reportNotes = notes || '';
    appt.status = 'Completed'; // Auto-complete appointment on report upload
    await appt.save();

    res.status(201).json({ success: true, message: 'Report uploaded', data: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to upload report', error: err.message });
  }
}

async function getReport(req, res) {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (!appt.reportUrl) return res.status(404).json({ success: false, message: 'Report not uploaded yet' });
    
    res.status(200).json({ success: true, data: { reportUrl: appt.reportUrl, notes: appt.reportNotes } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch report', error: err.message });
  }
}

// GET /api/appointments/admin/all – Get all appointments for admin
async function getAllAppointmentsForAdmin(req, res) {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const appointments = await Appointment.find()
      .populate('user', 'name email phone')
      .populate('test', 'name price category')
      .populate('lab', 'name address phone')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch appointments', error: err.message });
  }
}

// PUT /api/appointments/:id – Update appointment status
async function updateAppointmentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    
    const validStatuses = ['Scheduled', 'Completed', 'Canceled', 'Rescheduled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    // Check authorization (admin can update any appointment)
    if (req.user.role !== 'admin' && String(appointment.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    appointment.status = status;
    await appointment.save();
    
    res.status(200).json({ success: true, message: 'Appointment status updated', data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update appointment', error: err.message });
  }
}

module.exports = {
  listServices,
  bookAppointment,
  appointmentHistory,
  rescheduleAppointment,
  cancelAppointment,
  listTechnicians,
  getTechnician,
  uploadReport,
  getReport,
  getAllAppointmentsForAdmin,
  updateAppointmentStatus,
};
