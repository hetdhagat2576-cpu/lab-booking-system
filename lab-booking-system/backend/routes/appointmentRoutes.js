const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/appointmentController');

// Services
router.get('/services', listServices);

// Appointments
router.post('/appointments/book', protect, bookAppointment);
router.get('/appointments/history', protect, appointmentHistory);
router.delete('/appointments/:id', protect, cancelAppointment);
router.get('/appointments/admin/all', protect, getAllAppointmentsForAdmin);
router.put('/appointments/:id', protect, updateAppointmentStatus);

// Technician module
router.get('/technicians', listTechnicians);
router.get('/technicians/:id', getTechnician);

// Reports
router.post('/reports/upload', protect, uploadReport);
router.get('/reports/:id', protect, getReport);

module.exports = router;
