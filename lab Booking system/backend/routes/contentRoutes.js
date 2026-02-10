const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
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

router.get('/faq', getFaq);
router.get('/legal', getLegal);

// Home content routes - Public access for GET endpoints
router.get('/home/why-book', getHomeWhyBook);
router.get('/home/how-it-works', getHomeHowItWorks);

// Home content routes - Admin only for POST, PUT, DELETE endpoints
router.post('/home/why-book', protect, authorize('admin'), createHomeWhyBookItem);
router.post('/home/how-it-works', protect, authorize('admin'), createHomeHowItWorksItem);
router.put('/home/why-book/:id', protect, authorize('admin'), updateHomeWhyBookItem);
router.put('/home/how-it-works/:id', protect, authorize('admin'), updateHomeHowItWorksItem);
router.delete('/home/why-book/:id', protect, authorize('admin'), deleteHomeWhyBookItem);
router.delete('/home/how-it-works/:id', protect, authorize('admin'), deleteHomeHowItWorksItem);

module.exports = router;
