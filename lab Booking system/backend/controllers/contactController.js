const ContactMessage = require('../models/contactMessage');
const { sendContactReviewEmail } = require('../services/emailService');

const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject and message',
      });
    }

    const saved = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
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
    const allowed = ['new', 'reviewed', 'resolved'];
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
          contact.subject
        );
        
        if (emailResult.success) {
          console.log(`Email notification sent to ${contact.email} for contact request: ${contact.subject}`);
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

const markAsReviewed = async (req, res) => {
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
    
    if (contact.status === 'reviewed') {
      return res.status(400).json({
        success: false,
        message: 'Contact request is already marked as reviewed',
      });
    }
    
    const oldStatus = contact.status;
    contact.status = 'reviewed';
    await contact.save();
    
    let emailSent = false;
    let emailError = null;
    
    // Send email notification
    try {
      console.log(`Attempting to send email to: ${contact.email} for user: ${contact.name}`); // Added for debugging
      const emailResult = await sendContactReviewEmail(
        contact.email,
        contact.name,
        contact.subject
      );
      
      if (emailResult.success) {
        emailSent = true;
        console.log(`Email notification sent to ${contact.email} for contact request: ${contact.subject}`);
      } else {
        emailError = emailResult.error;
        console.error(`Failed to send email notification: ${emailResult.error}`);
      }
    } catch (error) {
      emailError = error.message;
      console.error('Error sending email notification:', error);
    }
    
    return res.status(200).json({
      success: true,
      message: emailSent 
        ? 'Contact request marked as reviewed and email sent successfully'
        : 'Contact request marked as reviewed (email delivery failed)',
      data: contact,
      emailSent,
      emailError: emailError || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error marking contact as reviewed',
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

module.exports = { 
  createContactMessage, 
  getContacts, 
  updateContactStatus, 
  markAsReviewed,
  deleteContact, 
  clearContactsForUser,
  getContactsForUser 
};
