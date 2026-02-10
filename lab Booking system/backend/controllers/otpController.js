const OtpCode = require('../models/otpCode');
const User = require('../models/user');
const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, code, name) => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '0', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  const from = process.env.EMAIL_FROM || 'no-reply@labbooking.local';
  
  if (!host || !port || !user || !pass) {
    // Development fallback: log OTP to console
    console.log('=================================');
    console.log('DEV MODE - OTP CODE:', code);
    console.log('Email:', email);
    console.log('Name:', name);
    console.log('=================================');
    return { sent: false, message: 'Email transport not configured - OTP logged to console' };
  }
  
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  try {
    await transporter.verify();
  } catch (err) {
    console.error('SMTP transporter verify failed:', err);
    return { sent: false, message: `SMTP verify failed: ${err.message}` };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 12px;">
      <div style="background: white; padding: 30px; border-radius: 8px; text-align: center;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 style="color: #333; margin-bottom: 10px; font-size: 28px;">Email Verification</h1>
        <p style="color: #666; margin-bottom: 30px; font-size: 16px;">Hi ${name},</p>
        <p style="color: #666; margin-bottom: 20px; font-size: 16px;">Use the following OTP to verify your email address:</p>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 8px; margin: 20px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${code}</div>
        <p style="color: #999; font-size: 14px; margin-top: 30px;">This code expires in 10 minutes.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">If you didn't request this verification, please ignore this email.</p>
        </div>
      </div>
    </div>
  `;
  
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: 'Verify Your Lab Booking Account',
      text: `Your OTP is ${code}. It expires in 10 minutes.`,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('Error sending OTP email:', err);
    return { sent: false, message: `SendMail failed: ${err.message}` };
  }
};

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
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
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
      otpSent = !!result.sent;
      if (!result.sent) {
        emailMessage = result.message;
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
        expiresIn: 600, // 10 minutes in seconds
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
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
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
      otpSent = !!result.sent;
      if (!result.sent) {
        emailMessage = result.message;
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
        expiresIn: 600,
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
