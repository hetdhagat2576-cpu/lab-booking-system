const mongoose = require('mongoose');

const homeWhyBookSchema = new mongoose.Schema({
  iconKey: {
    type: String,
    required: true,
    enum: ['Home', 'CheckCircle', 'Users', 'FileText', 'Clock', 'ArrowRight', 'Shield', 'Settings']
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
homeWhyBookSchema.index({ order: 1 });
homeWhyBookSchema.index({ isActive: 1 });

module.exports = mongoose.model('HomeWhyBook', homeWhyBookSchema);
