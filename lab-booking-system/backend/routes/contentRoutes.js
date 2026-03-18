const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');
const { 
  getFaq, 
  getLegal,
  getHomeWhyBook,
  getHomeHowItWorks,
  createHomeWhyBookItem,
  createHomeHowItWorksItem,
  updateHomeWhyBookItem,
  updateHomeHowItWorksItem,
  deleteHomeWhyBookItem,
  deleteHomeHowItWorksItem
} = require('../controllers/contentController');

// Public content routes - no authentication required but optional auth supported
router.get('/faq', optionalAuth, getFaq);
router.get('/legal', optionalAuth, getLegal);
router.get('/home/why-book', optionalAuth, getHomeWhyBook);
router.get('/home/how-it-works', optionalAuth, getHomeHowItWorks);

// Admin only routes - require authentication and admin role
router.post('/home/why-book', protect, authorize('admin'), createHomeWhyBookItem);
router.post('/home/how-it-works', protect, authorize('admin'), createHomeHowItWorksItem);
router.put('/home/why-book/:id', protect, authorize('admin'), updateHomeWhyBookItem);
router.put('/home/how-it-works/:id', protect, authorize('admin'), updateHomeHowItWorksItem);
router.delete('/home/why-book/:id', protect, authorize('admin'), deleteHomeWhyBookItem);
router.delete('/home/how-it-works/:id', protect, authorize('admin'), deleteHomeHowItWorksItem);

module.exports = router;
