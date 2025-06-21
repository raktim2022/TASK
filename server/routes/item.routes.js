const express = require('express');
const router = express.Router();
const { 
  getItems, 
  getItem, 
  createItem 
} = require('../controllers/item.controllers');
const { uploadItemImages } = require('../middleware/upload');

// Routes
router.route('/')
  .get(getItems)
  .post(uploadItemImages, createItem);

router.route('/:id')
  .get(getItem);

module.exports = router;