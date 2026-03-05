
// Comprehensive Email Service for Lab Booking System
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    const host = process.env.EMAIL_HOST;
    const port = parseInt(process.env.EMAIL_PORT || '0', 10);
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const from = process.env.EMAIL_FROM || `Lab Booking System <${user}>`;

    if (!host || !port || !user || !pass) {
      console.log('📧 Email service not configured - using fallback');
      this.isConfigured = false;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    this.isConfigured = true;
    this.from = from;
  }

  async sendPasswordReset(email, resetToken, name = 'User') {
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    if (!this.isConfigured) {
      console.log('=================================');
      console.log('DEV MODE - PASSWORD RESET LINK:', resetLink);
      console.log('Email:', email);
      console.log('Name:', name);
      console.log('=================================');
      return { sent: false, message: 'Email not configured - link logged to console' };
    }

    try {
      await this.transporter.verify();
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 12px;">
          <div style="background: white; padding: 30px; border-radius: 8px; text-align: center;">
            <h1 style="color: #333; margin-bottom: 10px; font-size: 28px;">Password Reset</h1>
            <p style="color: #666; margin-bottom: 30px; font-size: 16px;">Hi ${name},</p>
            <p style="color: #666; margin-bottom: 20px; font-size: 16px;">We received a request to reset your password. Click the button below to reset it:</p>
            <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 18px; font-weight: bold; padding: 15px 30px; border-radius: 8px; text-decoration: none; margin: 20px 0;">Reset Password</a>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">This link expires in 1 hour.</p>
            <p style="color: #999; font-size: 14px;">If you didn't request this reset, please ignore this email.</p>
          </div>
        </div>
      `;

      await this.transporter.sendMail({
        from: this.from,
        to: email,
        subject: 'Reset Your Lab Booking Password',
        text: `Reset your password: ${resetLink}`,
        html,
      });
      
      return { sent: true };
    } catch (error) {
      console.error('Password reset email failed:', error);
      return { sent: false, message: error.message };
    }
  }

  async sendOtp(email, otp, name = 'User') {
    if (!this.isConfigured) {
      console.log('=================================');
      console.log('DEV MODE - OTP CODE:', otp);
      console.log('Email:', email);
      console.log('Name:', name);
      console.log('=================================');
      return { sent: false, message: 'Email not configured - OTP logged to console' };
    }

    try {
      await this.transporter.verify();
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 12px;">
          <div style="background: white; padding: 30px; border-radius: 8px; text-align: center;">
            <h1 style="color: #333; margin-bottom: 10px; font-size: 28px;">Email Verification</h1>
            <p style="color: #666; margin-bottom: 30px; font-size: 16px;">Hi ${name},</p>
            <p style="color: #666; margin-bottom: 20px; font-size: 16px;">Use the following OTP to verify your email address:</p>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 8px; margin: 20px 0;">${otp}</div>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">This code expires in 10 minutes.</p>
          </div>
        </div>
      `;

      await this.transporter.sendMail({
        from: this.from,
        to: email,
        subject: 'Verify Your Lab Booking Account',
        text: `Your OTP is ${otp}. It expires in 10 minutes.`,
        html,
      });
      
      return { sent: true };
    } catch (error) {
      console.error('OTP email failed:', error);
      return { sent: false, message: error.message };
    }
  }
}

module.exports = new EmailService();
