const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const createTransporter = () => {
  // For development, use a test account or configure with your email service
  // In production, you should use environment variables for these credentials
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || 'hetdhagat2576@gmail.com',
      pass: process.env.EMAIL_PASS || 'klqtosidazgxxqj'
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates in development
    },
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,   // 30 seconds
    socketTimeout: 60000,     // 60 seconds
    debug: process.env.NODE_ENV === 'development', // Show debug output
    logger: process.env.NODE_ENV === 'development' // Log information to console
  });
};

// Send email notification when contact request is reviewed
const sendContactReviewEmail = async (userEmail, userName, contactSubject) => {
  console.log(`=== EMAIL SERVICE DEBUG ===`);
  console.log(`Sending email to: ${userEmail}`);
  console.log(`User name: ${userName}`);
  console.log(`Contact subject: ${contactSubject}`);
  console.log(`Email host: ${process.env.EMAIL_HOST || 'smtp.gmail.com'}`);
  console.log(`Email port: ${process.env.EMAIL_PORT || 587}`);
  console.log(`Email user configured: ${!!process.env.EMAIL_USER}`);
  console.log(`Email pass configured: ${!!process.env.EMAIL_PASS}`);
  
  try {
    const transporter = createTransporter();
    
    // Verify transporter configuration before sending
    console.log('Verifying transporter configuration...');
    await transporter.verify();
    console.log('Transporter verification successful');
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: userEmail,
      subject: 'Your Contact Request Has Been Reviewed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0;">Contact Request Review Update</h2>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Dear <strong>${userName}</strong>,
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Good news! Your contact request regarding <strong>"${contactSubject}"</strong> has been reviewed by our admin team.
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              We have carefully reviewed your message and will take appropriate action. If further information is needed, we will contact you shortly.
            </p>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #28a745;">
              <p style="color: #155724; margin: 0; font-weight: 500;">
                ✓ Your request has been successfully reviewed
              </p>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Thank you for contacting us. We appreciate your patience and understanding.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Best regards,<br>
                Lab Booking System Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    console.log('Attempting to send email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    console.log('Email response:', result.response);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('=== EMAIL ERROR DETAILS ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    
    // Specific error handling for common issues
    if (error.code === 'EAUTH') {
      console.error('Authentication failed - Check EMAIL_USER and EMAIL_PASS');
      console.error('For Gmail, make sure to use an App Password, not your regular password');
    } else if (error.code === 'ECONNECTION') {
      console.error('Connection failed - Check EMAIL_HOST and EMAIL_PORT');
    } else if (error.code === 'ESOCKET') {
      console.error('Socket error - Network connectivity issue');
    }
    
    return { success: false, error: error.message, code: error.code };
  }
};

module.exports = {
  sendContactReviewEmail
};
