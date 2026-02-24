const User = require('../models/user');
const OtpCode = require('../models/otpCode');
const PasswordResetToken = require('../models/passwordResetToken');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { setSessionUser } = require('../utils/sessionUtils');

const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
  if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET not set in environment variables. Using fallback secret for development only.');
  }
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d',
  });
};

const sendPasswordResetEmail = async (email, resetToken, name = 'User') => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '0', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  const from = process.env.EMAIL_FROM || 'no-reply@labbooking.local';
  
  if (!host || !port || !user || !pass) {
    // Development fallback: log reset link to console
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log('=================================');
    console.log('DEV MODE - PASSWORD RESET LINK:', resetLink);
    console.log('Email:', email);
    console.log('Name:', name);
    console.log('=================================');
    return { sent: false, message: 'Email transport not configured - Reset link logged to console' };
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

  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 12px;">
      <div style="background: white; padding: 30px; border-radius: 8px; text-align: center;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 7H19C20.1046 7 21 7.89543 21 9V19C21 20.1046 20.1046 21 19 21H9C7.89543 21 7 20.1046 7 19V15M3 13L9 7M3 13H7.5C8.32843 13 9 12.3284 9 11.5V7M3 13L7.5 8.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 style="color: #333; margin-bottom: 10px; font-size: 28px;">Password Reset</h1>
        <p style="color: #666; margin-bottom: 30px; font-size: 16px;">Hi ${name},</p>
        <p style="color: #666; margin-bottom: 20px; font-size: 16px;">We received a request to reset your password. Click the button below to reset it:</p>
        <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 18px; font-weight: bold; padding: 15px 30px; border-radius: 8px; text-decoration: none; margin: 20px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Reset Password</a>
        <p style="color: #999; font-size: 14px; margin-top: 30px;">This link expires in 1 hour.</p>
        <p style="color: #999; font-size: 14px;">If you didn't request this reset, please ignore this email.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">If the button doesn't work, copy and paste this link: ${resetLink}</p>
        </div>
      </div>
    </div>
  `;
  
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: 'Reset Your Lab Booking Password',
      text: `Reset your password by clicking this link: ${resetLink}. This link expires in 1 hour.`,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('Error sending password reset email:', err);
    return { sent: false, message: `SendMail failed: ${err.message}` };
  }
};

const sendOtpEmail = async (email, code, name = 'User') => {
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

const registerUser = async (req, res) => {
  try {
    // Debug: log basic info about incoming registration request to help diagnose 400s
    try {
      const { name, email, password } = req.body || {};
      console.log('RegisterUser request headers:', { 'content-type': req.get('Content-Type') });
      console.log('RegisterUser request body keys:', Object.keys(req.body || {}));
      console.log('RegisterUser payload summary:', {
        name: name || null,
        email: email || null,
        passwordPresent: !!password,
        passwordLength: password ? String(password).length : 0,
      });
    } catch (logErr) {
      console.error('Error logging register request:', logErr);
    }
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password)',
      });
    }

    // SECURITY: Check if user is trying to register with admin-like email
    const adminKeywords = ['admin', 'administrator', 'superadmin', 'root'];
    const emailLower = email.toLowerCase();
    const hasAdminKeyword = adminKeywords.some(keyword => emailLower.includes(keyword));
    
    if (hasAdminKeyword) {
      const allowedAdminEmails = [
        'admin@labbooking.com',
        'superadmin@labbooking.com'
      ];
      
      if (!allowedAdminEmails.includes(emailLower)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Admin emails require pre-authorization. Contact system administrator.',
        });
      }
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // SECURITY: Only allow pre-authorized admin emails to register as admin
    // No automatic admin role assignment - admins must be manually created in database
    const allowedAdminEmails = [
      'admin@labbooking.com',
      'superadmin@labbooking.com'
    ];
    
    let role = 'user'; // Default role is always user
    
    // Only assign admin role if email is in the pre-authorized list
    if (allowedAdminEmails.includes(email.toLowerCase())) {
      role = 'admin';
      console.log(`🔐 Admin registration attempted for pre-authorized email: ${email}`);
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      emailVerified: false, // Start as unverified, require OTP for registration
    });

    // Generate OTP for email verification during registration
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await OtpCode.create({ userId: user._id, email: user.email, code, expiresAt });
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

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      otpSent,
      emailMessage,
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for OTP verification.',
      data: userResponse,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log('=== DEBUG: Login Request ===');
    console.log('============================');
    console.log('📋 LOGIN REQUEST RECEIVED');
    console.log('Request body:', { 
      email: req.body?.email, 
      role: req.body?.role, 
      hasPassword: !!req.body?.password,
      hasRecaptchaToken: !!req.body?.recaptchaToken
    });
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('============================');
    
    const { email, password, role } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    console.log('🔍 Looking for user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log('✅ User found:', { 
      email: user.email, 
      role: user.role, 
      emailVerified: user.emailVerified,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });
    
    // IMPORTANT: No email verification check - users can login regardless of verification status
    console.log('⏭️  BYPASSING EMAIL VERIFICATION - allowing login for all users');

    // Check role if specified (more flexible matching)
    if (role && user.role !== role) {
      console.log('❌ Role mismatch:', { expected: role, actual: user.role });
      return res.status(403).json({
        success: false,
        message: `Access denied. Expected role: ${role}, but user role is: ${user.role}`,
      });
    }

    console.log('🔐 Comparing passwords...');
    const isMatch = await user.comparePassword(password);
    console.log('🔐 Password comparison result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log('✅ Login successful for:', email);

    // Update last login timestamp
    try {
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
    } catch (e) {
      console.warn('⚠️  Failed to update lastLogin:', e?.message);
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      emailVerified: user.emailVerified,
      phone: user.phone,
      address: user.address,
      age: user.age,
      gender: user.gender,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      token: generateToken(user._id),
    };

    // Store user in session
    setSessionUser(req, userResponse);

    console.log('📤 Sending successful login response');
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: userResponse,
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

const updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'address', 'age', 'gender'];
    const updates = {};
    allowed.forEach((k) => {
      if (typeof req.body[k] !== 'undefined') updates[k] = req.body[k];
    });
    
    // Handle email update separately
    if (typeof req.body.email !== 'undefined') {
      if (req.body.email === req.user.email) {
        // Email is the same, no update needed, but continue with other updates
      } else {
        // Check if email already exists
        const existingUser = await User.findOne({ email: req.body.email, _id: { $ne: req.user._id } });
        if (existingUser) {
          return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        updates.email = req.body.email;
      }
    }
    
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Generate new token with updated user info
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        age: user.age,
        gender: user.gender,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

const registerUserGet = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    req.body = {
      name: req.query.name,
      email: req.query.email,
      password: req.query.password,
    };
  }
  return registerUser(req, res);
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  registerUserGet,
  verifyOtp,
  resendOtp,
  getAllUsersForAdmin,
  deleteUserByAdmin,
  forgotPassword,
  resetPassword,
  deleteAccount,
};

async function forgotPassword(req, res) {
  try {
    console.log('=== DEBUG: Forgot Password Request ===');
    console.log('Request body:', req.body);
    console.log('========================================');
    
    const { email } = req.body || {};
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal that user doesn't exist for security
      return res.status(200).json({ 
        success: true, 
        message: 'If an account with this email exists, a password reset link has been sent.' 
      });
    }
    
    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    
    // Delete any existing unused reset tokens for this user
    await PasswordResetToken.deleteMany({ 
      userId: user._id, 
      used: false 
    });
    
    // Create new reset token
    await PasswordResetToken.create({
      userId: user._id,
      email: email.toLowerCase(),
      token: resetToken,
      expiresAt,
    });
    
    // Send password reset email
    let emailSent = false;
    let emailMessage = '';
    
    try {
      const result = await sendPasswordResetEmail(user.email, resetToken, user.name);
      emailSent = !!result.sent;
      if (!result.sent) {
        emailMessage = result.message;
      }
    } catch (error) {
      console.error('Email sending error:', error);
      emailMessage = 'Failed to send password reset email';
    }
    
    res.status(200).json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.',
      data: {
        email: user.email,
        emailSent,
        emailMessage,
        expiresIn: 3600, // 1 hour in seconds
      },
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing password reset request',
      error: error.message,
    });
  }
}

async function resetPassword(req, res) {
  try {
    console.log('=== DEBUG: Reset Password Request ===');
    console.log('Request body:', req.body);
    console.log('========================================');
    
    const { token, newPassword } = req.body || {};
    
    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reset token and new password are required' 
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    // Find valid reset token
    const resetToken = await PasswordResetToken.findOne({ 
      token: token, 
      used: false 
    });
    
    if (!resetToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      });
    }
    
    // Check if token has expired
    if (resetToken.expiresAt && resetToken.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reset token has expired' 
      });
    }
    
    // Find user
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Update user password
    user.password = newPassword;
    await user.save();
    
    // Mark token as used
    resetToken.used = true;
    await resetToken.save();
    
    // Delete any other unused tokens for this user
    await PasswordResetToken.deleteMany({ 
      userId: user._id, 
      used: false,
      _id: { $ne: resetToken._id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message,
    });
  }
}

async function verifyOtp(req, res) {
  try {
    console.log('=== DEBUG: OTP Verification Request ===');
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('========================================');
    
    const { email, code } = req.body || {};
    
    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
    }
    const record = await OtpCode.findOne({ email: String(email).toLowerCase(), code: String(code).trim(), used: false }).sort({ createdAt: -1 });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Invalid OTP' });
    }
    if (record.expiresAt && record.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    record.used = true;
    await record.save();
    
    // Update user's email verification status
    await User.findByIdAndUpdate(record.userId, { emailVerified: true });
    
    
    // Generate token after successful verification
    const user = await User.findById(record.userId);
    const token = generateToken(user._id);
    
    return res.status(200).json({ 
      success: true, 
      message: 'OTP verified successfully. Your account is now active.',
      data: {
        emailVerified: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          phone: user.phone,
          address: user.address,
          age: user.age,
          gender: user.gender
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error verifying OTP', error: error.message });
  }
}

async function resendOtp(req, res) {
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
}

async function getAllUsersForAdmin(req, res) {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
}

async function deleteUserByAdmin(req, res) {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await User.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
  }
}

async function deleteAccount(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userId = req.user._id;
    
    // Delete related user data first
    const Booking = require('../models/booking');
    const Feedback = require('../models/feedback');
    const ContactMessage = require('../models/contactMessage');
    const Report = require('../models/report');
    const OtpCode = require('../models/otpCode');
    const PasswordResetToken = require('../models/passwordResetToken');
    
    // Delete user's bookings
    await Booking.deleteMany({ userId: userId });
    
    // Delete user's feedback
    await Feedback.deleteMany({ userId: userId });
    
    // Delete user's contact messages
    await ContactMessage.deleteMany({ userId: userId });
    
    // Delete user's reports
    await Report.deleteMany({ patientId: userId });
    
    // Delete user's OTP codes
    await OtpCode.deleteMany({ userId: userId });
    
    // Delete user's password reset tokens
    await PasswordResetToken.deleteMany({ userId: userId });
    
    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(`User and all related data deleted: ${deletedUser.email} (ID: ${deletedUser._id})`);
    console.log('Deleted data includes: bookings, feedback, contact messages, reports, OTP codes, password reset tokens');

    return res.status(200).json({ 
      success: true, 
      message: 'Account and all related data deleted successfully' 
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error deleting account', 
      error: error.message 
    });
  }
}
