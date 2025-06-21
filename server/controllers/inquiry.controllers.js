const { sendInquiryEmail } = require('../utils/email');


exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, subject } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and message'
      });
    }
    
    await sendInquiryEmail({
      name,
      email,
      phone,
      message,
      subject
    });
    
    res.status(200).json({
      success: true,
      message: 'Inquiry submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry',
      error: error.message
    });
  }
};