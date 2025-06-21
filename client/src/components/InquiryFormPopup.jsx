"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '@/config/environment';

const InquiryFormPopup = ({ isOpen, onClose, item }) => {
  const [isEnquiring, setIsEnquiring] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isEnquiring) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, isEnquiring]);

  useEffect(() => {
    if (item) {
      setFormData(prev => ({
        ...prev,
        subject: `Inquiry about ${item.name}`,
        message: `I'm interested in learning more about ${item.name}.`
      }));
    }
  }, [item]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.message.trim()) errors.message = 'Message is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitInquiry = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsEnquiring(true);
    
    try {
      console.log(formData);

      const response = await axios.post(`${API_URL}/api/inquiries`, {
        ...formData,
        itemId: item._id,
        itemName: item.name
      });
      
      if (response.data.success) {
        toast.success('Your inquiry has been sent successfully!');
        
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          subject: `Inquiry about ${item.name}`
        });
        
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast.error('Failed to send inquiry. Please try again later.');
    } finally {
      setIsEnquiring(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const formVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={!isEnquiring ? onClose : undefined}
          />

          <div className="relative w-full max-w-6xl px-4 py-6 mx-auto z-10 flex items-center justify-center min-h-full">
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 bg-gradient-to-r from-blue-600 to-indigo-700">
                  <div className="p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">Enquire About</h2>
                    <h3 className="text-xl font-semibold text-blue-600 mb-6">{item.name}</h3>
                    
                    <div className="hidden lg:block">
                      {item.images && item.images.length > 0 && (
                        <div className="rounded-lg overflow-hidden mb-6 border-2 border-blue-300 shadow-lg">
                          <img 
                            src={item.images[0]} 
                            alt={item.name} 
                            className="w-full h-48 object-cover" 
                          />
                        </div>
                      )}
                      
                      <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                        <p className="font-medium text-black">{item.name}</p>
                        <p className="text-blue-700 mt-1">Price: Rs. {item.price}</p>
                        <p className="text-blue-700 mt-1">Category: {item.category}</p>
                      </div>
                      
                      <div className="mt-8 text-blue-100 text-sm">
                        <p>Fill out this form and we'll get back to you soon.</p>
                        <p className="mt-2">Our team typically responds within 24 hours.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-2/3 overflow-y-auto max-h-[90vh]">
                  <div className="lg:hidden bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <h2 className="text-xl font-bold">Enquire About {item.name}</h2>
                    <p className="text-blue-100 mt-1 text-sm">Fill out this form and we'll get back to you soon</p>
                    
                    <div className="flex items-center mt-4 bg-white bg-opacity-10 p-3 rounded-lg">
                      {item.images && item.images.length > 0 && (
                        <div className="w-16 h-16 rounded overflow-hidden mr-3 border border-blue-300">
                          <img 
                            src={item.images[0]} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-blue-200">Price: Rs. {item.price}</p>
                      </div>
                    </div>
                  </div>
                  
                  {!isEnquiring && (
                    <motion.button
                      className="absolute top-4 right-4 z-20 bg-white bg-opacity-30 hover:bg-opacity-40 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
                      onClick={onClose}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}

                  <div className="p-8">
                    <form onSubmit={submitInquiry}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name*
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              formErrors.name ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder="Your name"
                          />
                          {formErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email*
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              formErrors.email ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder="Your email"
                          />
                          {formErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone (Optional)
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your phone number"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Inquiry subject"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message*
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            formErrors.message ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Your message"
                        />
                        {formErrors.message && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                        )}
                      </div>
                      
                      <motion.button
                        type="submit"
                        className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg 
                          ${isEnquiring ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-800'} 
                          shadow-md transition-all duration-300 text-lg`}
                        whileHover={!isEnquiring ? { scale: 1.01 } : {}}
                        whileTap={!isEnquiring ? { scale: 0.98 } : {}}
                        disabled={isEnquiring}
                      >
                        {isEnquiring ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Inquiry...
                          </div>
                        ) : (
                          'Send Inquiry'
                        )}
                      </motion.button>
                      
                      <p className="text-center text-gray-500 text-xs mt-4">
                        By submitting this form, you agree to our privacy policy. We'll only use your information to respond to your inquiry.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InquiryFormPopup;