const express = require('express');
const router = express.Router();
const { submitInquiry } = require('../controllers/inquiry.controllers');

router.post('/', submitInquiry);

module.exports = router;