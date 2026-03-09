
const nodemailer = require('nodemailer');

// Create transporter function
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER || 'hetdhagat2576@gmail.com';
  const pass = process.env.EMAIL_PASS || 'klqtosidazgxxqj'; // Fallback to your app password
  
  // Check if app password is configured
  if (!pass || pass === 'YOUR_GMAIL_APP_PASSWORD_HERE' || pass.length < 16) {
    console.log('=================================');
    console.log('EMAIL CONFIGURATION ISSUE:');
    console.log('Current EMAIL_PASS length:', pass ? pass.length : 0);
    console.log('Expected: 16-character Gmail App Password');
    console.log('To fix:');
    console.log('1. Enable 2-Factor Authentication on Gmail');
    console.log('2. Go to: https://myaccount.google.com/apppasswords');
    console.log('3. Generate App Password for "Mail"');
    console.log('4. Update EMAIL_PASS in .env file with 16-char password');
    console.log('=================================');
    // Still try to create transporter for testing
  }
  
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send contact reply email
const sendContactReplyEmail = async (email, name, subject, replyMessage, originalMessage) => {
  try {
    console.log('📧 Attempting to send contact reply email to:', email);
    const transporter = createTransporter();
    
    // If no transporter (development mode), log reply and return success
    if (!transporter) {
      console.log('=================================');
      console.log('🔧 DEVELOPMENT MODE - CONTACT REPLY');
      console.log('📧 Email:', email);
      console.log('👤 Name:', name);
      console.log('📋 Subject:', subject);
      console.log('💬 Reply:', replyMessage);
      console.log('📄 Original:', originalMessage);
      console.log('=================================');
      return { success: true, messageId: 'dev-mode', development: true };
    }
    
    // Verify transporter connection first
    await transporter.verify();
    console.log('✅ SMTP connection verified for contact reply');
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 12px;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #333; margin-bottom: 10px; font-size: 28px;">Response to Your Contact Message</h1>
          <p style="color: #666; margin-bottom: 30px; font-size: 16px;">Dear ${name},</p>
          <p style="color: #666; margin-bottom: 20px; font-size: 16px;">Thank you for contacting us. We have reviewed your message and our response is below:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-bottom: 10px; font-size: 18px;">Our Response:</h3>
            <p style="color: #666; font-size: 16px; line-height: 1.5; white-space: pre-wrap;">${replyMessage}</p>
          </div>
          
          <div style="background: #f1f3f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #666; margin-bottom: 5px; font-size: 14px;">Your Original Message:</h4>
            <p style="color: #888; font-size: 14px; line-height: 1.4; white-space: pre-wrap;">${originalMessage}</p>
          </div>
          
          <p style="color: #666; margin-bottom: 20px; font-size: 16px;">If you have any further questions, please don't hesitate to contact us again.</p>
          <p style="color: #666; margin-bottom: 30px; font-size: 16px;">Best regards,<br>Lab Booking System Team</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: 'Lab Booking System <hetdhagat2576@gmail.com>',
      to: email,
      subject: `Re: ${subject} - Lab Booking System`,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Contact reply email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Contact reply email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Send OTP email for registration
const sendOtpEmail = async (email, otp, name = 'User') => {
  try {
    console.log('📧 Attempting to send OTP email to:', email);
    console.log('🔢 OTP Code:', otp);
    const transporter = createTransporter();
    
    // Always try to send email first
    try {
      // Verify transporter connection first
      await transporter.verify();
      console.log('✅ SMTP connection verified for OTP');
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 12px;">
          <div style="background: white; padding: 30px; border-radius: 8px; text-align: center;">
            <h1 style="color: #333; margin-bottom: 10px; font-size: 28px;">Email Verification</h1>
            <p style="color: #666; margin-bottom: 30px; font-size: 16px;">Hi ${name},</p>
            <p style="color: #666; margin-bottom: 20px; font-size: 16px;">Use the following OTP to verify your email address:</p>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 8px; margin: 20px 0;">${otp}</div>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">This code expires in 3 minutes.</p>
            <p style="color: #999; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: 'Lab Booking System <hetdhagat2576@gmail.com>',
        to: email,
        subject: 'Verify Your Lab Booking Account',
        html: html
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ OTP email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
      
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      
      // Fallback: show OTP in console
      console.log('=================================');
      console.log('🔧 EMAIL FAILED - USE CONSOLE OTP');
      console.log('📧 Email:', email);
      console.log('👤 Name:', name);
      console.log('🔢 OTP CODE:', otp);
      console.log('❌ Error:', emailError.message);
      console.log('=================================');
      
      return { success: false, error: emailError.message, consoleOtp: otp };
    }
    
  } catch (error) {
    console.error('❌ OTP email service error:', error.message);
    return { success: false, error: error.message };
  }
};

// Send booking notification email (approval/rejection)
const sendBookingNotificationEmail = async (email, name, status, booking, rejectionReason = '') => {
  try {
    console.log(`📧 Attempting to send booking ${status} email to:`, email);
    const transporter = createTransporter();
    
    // If no transporter (development mode), log notification and return success
    if (!transporter) {
      console.log('=================================');
      console.log('🔧 DEVELOPMENT MODE - BOOKING NOTIFICATION');
      console.log('📧 Email:', email);
      console.log('👤 Name:', name);
      console.log('📋 Status:', status);
      console.log('📅 Booking:', booking);
      if (rejectionReason) console.log('❌ Reason:', rejectionReason);
      console.log('=================================');
      return { success: true, messageId: 'dev-mode', development: true };
    }
    
    // Verify transporter connection first
    await transporter.verify();
    console.log(`✅ SMTP connection verified for booking ${status}`);
    
    const isApproved = status === 'approved';
    const subject = isApproved ? 'Booking Approved! ✅' : 'Booking Rejected ❌';
    const statusColor = isApproved ? '#10b981' : '#ef4444';
    const statusIcon = isApproved ? '✅' : '❌';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 12px;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; margin: 0 auto 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; background: ${statusColor}15;">
              ${statusIcon}
            </div>
            <h1 style="color: #333; margin-bottom: 10px; font-size: 28px;">${subject}</h1>
          </div>
          
          <p style="color: #666; margin-bottom: 30px; font-size: 16px;">Dear ${name},</p>
          
          <p style="color: #666; margin-bottom: 20px; font-size: 16px;">
            Your booking has been <strong style="color: ${statusColor};">${status}</strong>. Here are the details:
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColor};">
            <h3 style="color: #333; margin-bottom: 15px; font-size: 18px;">Booking Details:</h3>
            <div style="color: #666; font-size: 16px; line-height: 1.6;">
              <p><strong>Test:</strong> ${booking.testName}</p>
              <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${booking.timeSlot}</p>
              <p><strong>Booking ID:</strong> ${booking._id}</p>
              ${booking.price ? `<p><strong>Price:</strong> ₹${booking.price}</p>` : ''}
            </div>
          </div>
          
          ${!isApproved && rejectionReason ? `
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <h4 style="color: #dc2626; margin-bottom: 10px; font-size: 16px;">Rejection Reason:</h4>
              <p style="color: #666; font-size: 16px; line-height: 1.5;">${rejectionReason}</p>
            </div>
          ` : ''}
          
          ${isApproved ? `
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h4 style="color: #059669; margin-bottom: 10px; font-size: 16px;">Next Steps:</h4>
              <ul style="color: #666; font-size: 16px; line-height: 1.5; margin: 0; padding-left: 20px;">
                <li>Please arrive 15 minutes before your scheduled time</li>
                <li>Bring your ID proof and any required documents</li>
                <li>Payment can be made at the reception</li>
              </ul>
            </div>
          ` : ''}
          
          <p style="color: #666; margin-bottom: 30px; font-size: 16px;">
            ${isApproved 
              ? 'We look forward to seeing you for your test. If you need to reschedule, please contact us at least 24 hours in advance.'
              : 'If you have any questions about this decision or would like to book a different time, please feel free to contact us.'
            }
          </p>
          
          <p style="color: #666; margin-bottom: 30px; font-size: 16px;">Best regards,<br>Lab Booking System Team</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: 'Lab Booking System <hetdhagat2576@gmail.com>',
      to: email,
      subject: `${subject} - Lab Booking System`,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Booking ${status} email sent successfully:`, result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error(`❌ Booking ${status} email sending failed:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendContactReplyEmail,
  sendOtpEmail,
  sendBookingNotificationEmail
};
