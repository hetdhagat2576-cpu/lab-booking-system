const mongoose = require('mongoose');

const otpCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
}, {
  timestamps: true,
});

otpCodeSchema.index({ email: 1, code: 1 });

module.exports = mongoose.model('OtpCode', otpCodeSchema);

