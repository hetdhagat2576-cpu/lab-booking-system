const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a reusable transporter object using SMTP transport
const createTransporter = () => {
  // Use service: 'gmail' as it's more robust for Nodemailer
  const user = (process.env.EMAIL_USER || 'hetdhagat2576@gmail.com').trim();
  const pass = (process.env.EMAIL_PASS || '').trim();
  
  if (!pass) {
    console.error('CRITICAL ERROR: EMAIL_PASS is missing in .env file!');
  }
  
  const transporterConfig = {
    service: 'gmail',
    auth: {
      user: user,
      pass: pass
    },
    tls: {
      rejectUnauthorized: false 
    }
  };

  return nodemailer.createTransport(transporterConfig);
};

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email transporter configuration is valid');
    return { success: true };
  } catch (error) {
    console.error('Email transporter verification failed:', error.message);
    
    // Provide specific guidance for Gmail authentication errors
    if (error.code === 'EAUTH') {
      console.error('\n=== GMAIL AUTHENTICATION FIX ===');
      console.error('1. Enable 2-Factor Authentication on your Gmail account');
      console.error('2. Go to: https://myaccount.google.com/apppasswords');
      console.error('3. Generate an App Password for "Mail"');
      console.error('4. Use the 16-character app password instead of your regular password');
      console.error('5. Update your .env file with the new app password');
      console.error('===================================\n');
    }
    
    return { success: false, error: error.message, code: error.code };
  }
};

// Test email sending with detailed error reporting
const testEmailSending = async (testEmail = 'test@example.com') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'hetdhagat2576@gmail.com',
      to: testEmail,
      subject: 'Test Email - Lab Booking System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email</h2>
          <p>This is a test email from the Lab Booking System.</p>
          <p>If you receive this email, the email configuration is working correctly.</p>
          <p>Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Test email failed:', error.message);
    return { success: false, error: error.message, code: error.code };
  }
};

module.exports = {
  createTransporter,
  verifyTransporter,
  testEmailSending
};
