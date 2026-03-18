const express = require('express');
const router = express.Router();
const {
  getLabs,
} = require('../controllers/catalogController');

// @route   GET /api/labs
router.get('/labs', getLabs);


module.exports = router;
