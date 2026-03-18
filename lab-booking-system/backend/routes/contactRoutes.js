const express = require('express');
const router = express.Router();
const { createContactMessage, getContacts, updateContactStatus, deleteContact, clearContactsForUser, getContactsForUser, replyToContact } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', createContactMessage); // Public endpoint for contact form
router.get('/', protect, authorize('admin'), getContacts);
router.get('/my', protect, getContactsForUser);
router.put('/:contactId/status', protect, authorize('admin'), updateContactStatus);
router.post('/:contactId/reply', protect, authorize('admin'), replyToContact);
router.delete('/:contactId', protect, authorize('admin'), deleteContact);
router.delete('/clear', protect, clearContactsForUser);

module.exports = router;
