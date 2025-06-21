const Item = require('../models/item.models');

exports.createItem = async (req, res) => {
  try {
    const { name, category, features, price } = req.body;
    
    const parsedFeatures = typeof features === 'string' 
      ? JSON.parse(features) 
      : features || [];
    
    const imageUrls = req.files ? req.files.map(file => file.path) : [];
    
    const itemPrice = price ? Number(price) : undefined;
    
    const newItem = new Item({
      name,
      category,
      features: parsedFeatures,
      images: imageUrls,
      price: itemPrice
    });
    
    const savedItem = await newItem.save();
    
    res.status(201).json({
      success: true,
      item: savedItem
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add item', 
      error: error.message 
    });
  }
};


exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch items', 
      error: error.message 
    });
  }
};


exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }
    res.status(200).json({
      success: true,
      item
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch item', 
      error: error.message 
    });
  }
};