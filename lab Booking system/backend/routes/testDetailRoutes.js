const express = require('express');
const router = express.Router();
const {
  getTestDetails
} = require('../controllers/testDetailController');

// Public routes
router.get('/:id/details', getTestDetails);

module.exports = router;
