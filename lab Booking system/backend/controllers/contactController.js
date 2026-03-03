const ContactMessage = require('../models/contactMessage');
const { sendContactReviewEmail } = require('../services/emailService');

const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and message',
      });
    }

    const saved = await ContactMessage.create({
      name,
      email,
      phone,
      message,
    });

    return res.status(201).json({
      success: true,
      message: 'Message received',
      data: saved,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error submitting message',
      error: error.message,
    });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await ContactMessage.find({})
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message,
    });
  }
};

const updateContactStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admins only.',
      });
    }
    const { contactId } = req.params;
    const { status } = req.body;
    const allowed = ['pending', 'reviewed', 'replied', 'resolved'];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }
    const contact = await ContactMessage.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }
    
    const oldStatus = contact.status;
    contact.status = status;
    await contact.save();
    
    // Send email notification when status changes to 'reviewed'
    if (oldStatus !== 'reviewed' && status === 'reviewed') {
      try {
        const emailResult = await sendContactReviewEmail(
          contact.email,
          contact.name,
          'Contact Message'
        );
        
        if (emailResult.success) {
          console.log(`Email notification sent to ${contact.email} for contact message`);
        } else {
          console.error(`Failed to send email notification: ${emailResult.error}`);
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the status update if email fails
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating contact status',
      error: error.message,
    });
  }
};

const clearContactsForUser = async (req, res) => {
  try {
    const email = req.user.email;
    const result = await ContactMessage.deleteMany({ email });
    return res.status(200).json({
      success: true,
      message: 'Cleared contact requests',
      deletedCount: result.deletedCount || 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error clearing contacts',
      error: error.message,
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admins only.',
      });
    }
    const { contactId } = req.params;
    
    const contact = await ContactMessage.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }
    
    await ContactMessage.findByIdAndDelete(contactId);
    
    return res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting contact message',
      error: error.message,
    });
  }
};

const getContactsForUser = async (req, res) => {
  try {
    const contacts = await ContactMessage.find({ email: req.user.email })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching contacts for user',
      error: error.message,
    });
  }
};

const replyToContact = async (req, res) => {
  try {
    console.log('=== REPLY TO CONTACT DEBUG ===');
    console.log('User:', req.user ? { id: req.user._id, email: req.user.email, role: req.user.role } : 'No user');
    console.log('Params:', req.params);
    console.log('Body:', { replyMessage: req.body.replyMessage ? req.body.replyMessage.substring(0, 100) + '...' : 'MISSING' });
    
    if (req.user.role !== 'admin') {
      console.log('Access denied - user role:', req.user.role);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admins only.',
        debug: { userRole: req.user.role, requiredRole: 'admin' }
      });
    }
    
    const { contactId } = req.params;
    const { replyMessage } = req.body;
    
    if (!contactId) {
      return res.status(400).json({
        success: false,
        message: 'Contact ID is required',
        debug: { params: req.params }
      });
    }
    
    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required',
        debug: { replyMessageLength: replyMessage ? replyMessage.length : 0 }
      });
    }
    
    console.log('Finding contact with ID:', contactId);
    const contact = await ContactMessage.findById(contactId);
    
    if (!contact) {
      console.log('Contact not found for ID:', contactId);
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
        debug: { contactId, searchedIn: 'ContactMessage collection' }
      });
    }
    
    console.log('Contact found:', { id: contact._id, email: contact.email, name: contact.name });
    
    // Send email reply (optional - don't fail if email fails)
    const { sendContactReplyEmail } = require('../services/emailService');
    let emailResult = { success: false, error: 'Email service not available' };
    
    // Only try to send email if credentials are properly configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        console.log('Attempting to send email reply...');
        emailResult = await sendContactReplyEmail(
          contact.email,
          contact.name,
          'Contact Message',
          replyMessage
        );
        console.log('Email service result:', emailResult);
      } catch (emailError) {
        console.error('=== EMAIL SERVICE ERROR ===');
        console.error('Error type:', emailError.constructor.name);
        console.error('Error message:', emailError.message);
        console.error('Error code:', emailError.code);
        
        emailResult = { 
          success: false, 
          error: emailError.message,
          code: emailError.code || 'EMAIL_ERROR',
          type: emailError.constructor.name
        };
      }
    } else {
      console.log('Email credentials not configured - skipping email sending');
      emailResult = { 
        success: false, 
        error: 'Email credentials not configured',
        code: 'NO_EMAIL_CONFIG'
      };
    }
    
    // Always update the status to 'replied' regardless of email success
    try {
      console.log('Updating contact status to replied...');
      contact.status = 'replied';
      await contact.save();
      console.log('Contact status updated successfully');
      
      return res.status(200).json({
        success: true,
        message: emailResult.success ? 
          'Reply sent successfully and status updated' : 
          'Reply processed (email delivery failed, but status updated)',
        data: {
          id: contact._id,
          email: contact.email,
          status: contact.status,
          originalSubject: 'Contact Message'
        },
        emailSent: emailResult.success,
        emailError: emailResult.success ? null : {
          message: emailResult.error,
          code: emailResult.code,
          type: emailResult.type,
          stack: emailResult.stack
        }
      });
    } catch (saveError) {
      console.error('=== CONTACT SAVE ERROR ===');
      console.error('Save error:', saveError.message);
      console.error('Save error stack:', saveError.stack);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to update contact status',
        error: saveError.message,
        debug: {
          contactId: contact._id,
          attemptedStatus: 'replied',
          emailResult: emailResult
        }
      });
    }
  } catch (error) {
    console.error('=== REPLY TO CONTACT CRITICAL ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    console.error('Request info:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      user: req.user ? { id: req.user._id, email: req.user.email, role: req.user.role } : null
    });
    
    return res.status(500).json({
      success: false,
      message: 'Error processing reply',
      error: error.message,
      debug: {
        errorType: error.constructor.name,
        errorCode: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString()
      }
    });
  }
};

module.exports = { 
  createContactMessage, 
  getContacts, 
  updateContactStatus, 
  deleteContact, 
  clearContactsForUser,
  getContactsForUser,
  replyToContact 
};
