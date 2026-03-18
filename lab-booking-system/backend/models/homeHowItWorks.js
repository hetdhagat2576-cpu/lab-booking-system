const mongoose = require('mongoose');

const homeHowItWorksSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true,
    min: 1
  },
  iconKey: {
    type: String,
    required: true,
    enum: ['Search', 'CreditCard', 'Home', 'FileText', 'Clock', 'ArrowRight', 'Shield', 'Settings', 'CheckCircle', 'Users']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add index for better query performance
homeHowItWorksSchema.index({ order: 1 });
homeHowItWorksSchema.index({ stepNumber: 1 });
homeHowItWorksSchema.index({ isActive: 1 });

module.exports = mongoose.model('HomeHowItWorks', homeHowItWorksSchema);
