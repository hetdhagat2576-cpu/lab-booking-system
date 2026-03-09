const OtpCode = require('../models/otpCode');
const User = require('../models/user');
const { sendOtpEmail } = require('../services/emailService');

const generateOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }
    
    // Generate 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
    
    // Delete any existing unused OTPs for this email
    await OtpCode.deleteMany({ email: email.toLowerCase(), used: false });
    
    // Create new OTP
    await OtpCode.create({
      userId: user._id,
      email: email.toLowerCase(),
      code,
      expiresAt,
    });
    
    // Send OTP email
    let otpSent = false;
    let emailMessage = '';
    
    try {
      const result = await sendOtpEmail(user.email, code, user.name);
      otpSent = result.success;
      if (!result.success) {
        emailMessage = result.error;
      }
    } catch (error) {
      console.error('Email sending error:', error);
      emailMessage = 'Failed to send OTP email';
    }
    
    res.status(200).json({
      success: true,
      message: 'OTP generated successfully',
      data: {
        email: user.email,
        otpSent,
        emailMessage,
        expiresIn: 180, // 3 minutes in seconds
      },
    });
  } catch (error) {
    console.error('Generate OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating OTP',
      error: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP code are required',
      });
    }
    
    // Find the most recent unused OTP for this email
    const otpRecord = await OtpCode.findOne({
      email: email.toLowerCase(),
      code: code.trim(),
      used: false,
    }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code',
      });
    }
    
    // Check if OTP has expired
    if (otpRecord.expiresAt && otpRecord.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired',
      });
    }
    
    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();
    
    // Update user's email verification status
    await User.findByIdAndUpdate(otpRecord.userId, {
      emailVerified: true,
    });
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        emailVerified: true,
        verifiedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message,
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }
    
    // Check if user is already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }
    
    // Generate new OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
    
    // Delete existing unused OTPs
    await OtpCode.deleteMany({ email: email.toLowerCase(), used: false });
    
    // Create new OTP
    await OtpCode.create({
      userId: user._id,
      email: email.toLowerCase(),
      code,
      expiresAt,
    });
    
    // Send OTP email
    let otpSent = false;
    let emailMessage = '';
    
    try {
      const result = await sendOtpEmail(user.email, code, user.name);
      otpSent = result.success;
      if (!result.success) {
        emailMessage = result.error;
      }
    } catch (error) {
      console.error('Email sending error:', error);
      emailMessage = 'Failed to send OTP email';
    }
    
    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        email: user.email,
        otpSent,
        emailMessage,
        expiresIn: 180,
      },
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending OTP',
      error: error.message,
    });
  }
};

module.exports = {
  generateOtp,
  verifyOtp,
  resendOtp,
};
