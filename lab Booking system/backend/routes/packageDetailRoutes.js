const express = require('express');
const router = express.Router();
const {
  getPackageDetails
} = require('../controllers/packageDetailController');

// Public routes
router.get('/:id/details', getPackageDetails);

module.exports = router;
