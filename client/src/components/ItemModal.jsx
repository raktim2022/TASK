"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCarousel from './ImageCarousel';
import InquiryFormPopup from './InquiryFormPopup';

const ItemModal = ({ item, isOpen, onClose }) => {
  const [isInquiryFormOpen, setIsInquiryFormOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const openInquiryForm = () => {
    setIsInquiryFormOpen(true);
  };

  const closeInquiryForm = () => {
    setIsInquiryFormOpen(false);
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.3
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (!item) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="absolute top-6 right-6 z-20 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-600 hover:text-gray-800 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border border-gray-200"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100">
                    <ImageCarousel images={item.images} itemName={item.name} />
                  </div>

                  <motion.div 
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className="p-8 md:p-10"
                  >
                    <motion.div variants={itemVariants} className="mb-6">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
                          {item.category}
                        </span>
                        <span className="text-3xl font-bold text-green-600 mr-5">
                          Rs. {item.price}
                        </span>
                      </div>

                      <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
                        {item.name}
                      </h2>

                      <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        {item.description || 'High-quality product available for purchase. Contact us for more information.'}
                      </p>
                    </motion.div>

                    {item.features && item.features.length > 0 && (
                      <motion.div variants={itemVariants} className="mb-8">
                        <h4 className="font-semibold text-gray-700 mb-4 text-lg">Key Features</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {item.features.map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              className="flex items-center text-gray-600 bg-white p-3 rounded-lg border border-gray-200"
                            >
                              <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <motion.div variants={itemVariants} className="flex gap-4">
                      <motion.button
                        className="flex-1 font-semibold py-4 px-6 rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl"
                        onClick={openInquiryForm}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Enquire Now
                        </div>
                      </motion.button>

                      <motion.button
                        className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </motion.button>
                    </motion.div>

                    <motion.div 
                      variants={itemVariants}
                      className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-500 p-2 rounded-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-1">Quick Enquiry</h4>
                          <p className="text-sm text-blue-700 leading-relaxed">
                            Click "Enquire Now" to connect directly with our team. We'll get back to you within 24 hours.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <InquiryFormPopup 
        isOpen={isInquiryFormOpen} 
        onClose={closeInquiryForm} 
        item={item} 
      />
    </>
  );
};

export default ItemModal;