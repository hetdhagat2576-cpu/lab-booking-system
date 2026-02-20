const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReports,
  getPatientReports,
  getReportById,
  getReportByBookingId,
  getTodayBookings,
  getPendingReports,
  updateReport,
  deleteReport,
  downloadReportPDF
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Lab technician routes (specific routes first)
router.post('/', protect, authorize('labtechnician'), createReport);
router.get('/today/bookings', protect, authorize('labtechnician'), getTodayBookings);
router.get('/pending/reports', protect, authorize('labtechnician'), getPendingReports);

// Specific routes must come before parameterized routes
router.get('/booking/:bookingId', protect, getReportByBookingId);
router.get('/patient/:patientId', protect, getPatientReports);
router.get('/:id/download', protect, downloadReportPDF);
router.get('/:id', protect, getReportById);

// General routes
router.get('/', protect, authorize('labtechnician', 'admin'), getAllReports);
router.put('/:id', protect, authorize('labtechnician'), updateReport);
router.delete('/:id', protect, authorize('labtechnician', 'admin'), deleteReport);

module.exports = router;

