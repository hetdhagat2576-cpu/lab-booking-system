const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking ID is required']
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Technician ID is required']
  },
  packageName: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true,
    default: 'Lab Test'
  },
  selectedTests: [{
    name: {
      type: String,
      required: [true, 'Test name is required'],
      trim: true
    },
    result: {
      type: String,
      required: [true, 'Test result is required'],
      trim: true
    },
    unit: {
      type: String,
      trim: true,
      default: ''
    },
    referenceRange: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['Normal', 'High', 'Low'],
      default: 'Normal'
    }
  }],
  testDate: {
    type: Date,
    default: Date.now
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true,
    minlength: [10, 'Summary must be at least 10 characters long']
  },
  recommendations: {
    type: String,
    required: [true, 'Recommendations are required'],
    trim: true,
    minlength: [10, 'Recommendations must be at least 10 characters long']
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Completed'
  },
  pdfUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add validation for selectedTests array
reportSchema.pre('save', function(next) {
  if (this.selectedTests && this.selectedTests.length === 0) {
    return next(new Error('At least one test result is required'));
  }
  next();
});

module.exports = mongoose.model('Report', reportSchema);
