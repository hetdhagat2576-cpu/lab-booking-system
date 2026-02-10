const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const createTransporter = () => {
  // For development, use a test account or configure with your email service
  // In production, you should use environment variables for these credentials
  return nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Send email notification when contact request is reviewed
const sendContactReviewEmail = async (userEmail, userName, contactSubject) => {
  try {
    const transporter = createTransporter();
    
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

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendContactReviewEmail
};
