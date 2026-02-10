const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReports,
  getPatientReports,
  getReportById,
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

// General routes (more specific first)
router.get('/patient/:patientId', protect, getPatientReports);
router.get('/:id/download', protect, downloadReportPDF);
router.get('/:id', protect, getReportById);
router.get('/', protect, authorize('labtechnician', 'admin'), getAllReports);
router.put('/:id', protect, authorize('labtechnician'), updateReport);
router.delete('/:id', protect, authorize('labtechnician', 'admin'), deleteReport);

module.exports = router;

