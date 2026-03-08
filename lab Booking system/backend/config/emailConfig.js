const nodemailer = require('nodemailer');

// Create a reusable transporter object using SMTP transport
const createTransporter = () => {
  // Check if email credentials are properly configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured. Using fallback configuration.');
  }
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', 
    auth: {
      user: process.env.EMAIL_USER || 'hetdhagat2576@gmail.com',
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false 
    },
    connectionTimeout: 60000, 
    greetingTimeout: 30000,   
    socketTimeout: 60000,     
    debug: process.env.NODE_ENV === 'development', 
    logger: process.env.NODE_ENV === 'development' 
  });
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
