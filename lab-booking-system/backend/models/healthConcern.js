const mongoose = require('mongoose');

const healthConcernSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    iconKey: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    rating: { type: Number, default: 0, min: 1, max: 5 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthConcern', healthConcernSchema);
