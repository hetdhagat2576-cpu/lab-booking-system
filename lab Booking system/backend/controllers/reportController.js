const Report = require('../models/Report');
const Booking = require('../models/booking');
const User = require('../models/user');
const { generateReportPDF } = require('../services/pdfService');

// Create new report from booking
const createReport = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const {
      bookingId,
      selectedTests,
      summary,
      recommendations
    } = req.body;
    
    // Validate required fields
    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required' });
    }
    
    if (!selectedTests || !Array.isArray(selectedTests) || selectedTests.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one test result is required' });
    }
    
    if (!summary) {
      return res.status(400).json({ success: false, message: 'Summary is required' });
    }
    
    if (!recommendations) {
      return res.status(400).json({ success: false, message: 'Recommendations are required' });
    }
    
    // Validate each test
    for (let i = 0; i < selectedTests.length; i++) {
      const test = selectedTests[i];
      if (!test.name || !test.result) {
        return res.status(400).json({ 
          success: false, 
          message: `Test ${i + 1}: Name and result are required` 
        });
      }
    }
    
    // Verify booking exists and is approved
    const booking = await Booking.findById(bookingId).populate('user', 'name email');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.adminStatus !== 'approved') {
      return res.status(400).json({ success: false, message: 'Booking must be approved before creating report' });
    }

    const report = new Report({
      bookingId,
      patientId: booking.user._id,
      technicianId: req.user._id,
      packageName: booking.packageName || 'Lab Test',
      selectedTests,
      summary,
      recommendations,
      status: 'Completed'
    });

    await report.save();
    await report.populate([
      { path: 'patientId', select: 'name email phone' },
      { path: 'technicianId', select: 'name email' },
      { path: 'bookingId', select: 'date time labName packageName' }
    ]);

    console.log('Report created successfully:', report._id);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error creating report' 
    });
  }
};

// Get all reports (for lab technicians)
const getAllReports = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { page = 1, limit = 10, status } = req.query;
    const filter = { technicianId: req.user._id };
    
    if (status) filter.status = status;

    const reports = await Report.find(filter)
      .populate('patientId', 'name email phone')
      .populate('technicianId', 'name email')
      .populate('bookingId', 'date time labName packageName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(filter);

    res.json({
      success: true,
      data: reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reports for specific patient
const getPatientReports = async (req, res) => {
  try {
    const { patientId } = req.params;
    const reports = await Report.find({ patientId })
      .populate('patientId', 'name email phone')
      .populate('technicianId', 'name email')
      .populate('bookingId', 'date time labName packageName')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (error) {
    console.error('Get patient reports error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single report by ID
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patientId', 'name email phone')
      .populate('technicianId', 'name email')
      .populate('bookingId', 'date time labName packageName selectedTests');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get today's approved bookings for lab technicians
const getTodayBookings = async (req, res) => {
  try {
    // Get all approved bookings for lab technicians (not filtered by date)
    const bookings = await Booking.find({ 
      adminStatus: 'approved'
    })
    .populate('user', 'name email phone')
    .sort({ date: 1, time: 1, createdAt: -1 });

    res.json({ 
      success: true, 
      data: bookings 
    });
  } catch (error) {
    console.error('Get today bookings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get pending reports for lab technicians
const getPendingReports = async (req, res) => {
  try {
    // Get approved bookings that don't have completed reports yet
    const bookingsWithCompletedReports = await Report.find({
      status: 'Completed'
    }).distinct('bookingId');

    const pendingBookings = await Booking.find({
      _id: { $nin: bookingsWithCompletedReports },
      adminStatus: 'approved'
    })
    .populate('user', 'name email phone')
    .sort({ date: 1, time: 1, createdAt: -1 });

    res.json({ 
      success: true, 
      data: pendingBookings 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update report
const updateReport = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    Object.assign(report, req.body);
    await report.save();

    await report.populate([
      { path: 'patientId', select: 'name email phone' },
      { path: 'technicianId', select: 'name email' },
      { path: 'bookingId', select: 'date time labName packageName' }
    ]);

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete report
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    await Report.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate and download PDF report
const downloadReportPDF = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patientId', 'name email phone')
      .populate('technicianId', 'name email')
      .populate('bookingId', 'date time labName packageName');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    try {
      const pdfBuffer = await generateReportPDF(report);
      
      const filename = `Lab_Report_${report.patientId?.name || 'Patient'}_${report._id.toString().slice(-8)}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.send(pdfBuffer);
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      // Fallback: send HTML as text file
      const htmlContent = `
        <html>
        <head><title>Lab Report - ${report.packageName}</title></head>
        <body>
          <h1>Lab Report</h1>
          <p>Patient: ${report.patientId?.name}</p>
          <p>Date: ${new Date(report.testDate).toLocaleDateString()}</p>
          <h2>Test Results:</h2>
          ${report.selectedTests?.map(test => 
            `<p><strong>${test.name}:</strong> ${test.result} ${test.unit || ''} (${test.status})</p>`
          ).join('')}
          <h2>Summary:</h2>
          <p>${report.summary}</p>
          <h2>Recommendations:</h2>
          <p>${report.recommendations}</p>
        </body>
        </html>
      `;
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="Lab_Report_${report._id.toString().slice(-8)}.html"`);
      res.send(htmlContent);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report' });
  }
};

// Get report by booking ID
const getReportByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const report = await Report.findOne({ bookingId })
      .populate([
        { path: 'patientId', select: 'name email phone' },
        { path: 'technicianId', select: 'name email' },
        { path: 'bookingId', select: 'date time labName packageName' }
      ]);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found for this booking' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Get report by booking ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error fetching report' 
    });
  }
};

module.exports = {
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
};
