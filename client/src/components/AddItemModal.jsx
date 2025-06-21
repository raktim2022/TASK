"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useItems } from '@/context/ItemContext';
import ImageUploader from './ImageUploader';
import { toast } from 'react-toastify';

const AddItemModal = ({ isOpen, onClose }) => {
  const { addItem } = useItems();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics'); 
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState(['']); 
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Books',
    'Toys & Games',
    'Beauty',
    'Sports',
    'Automotive',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!name.trim()) return setFormError("Name is required");
    if (!price || isNaN(Number(price))) return setFormError("Valid price is required");
    if (features.length === 0 || !features[0].trim()) return setFormError("At least one feature is required");
    if (images.length === 0) return setFormError("At least one image is required");
    if (images.length > 9) return setFormError("Maximum 9 images allowed");
    
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('price', price);
      
      const validFeatures = features.filter(feature => feature.trim());
      formData.append('features', JSON.stringify(validFeatures));
      
      images.forEach(image => {
        formData.append('images', image);
      });
      
      const result = await addItem(formData);
      toast.success('Item added successfully!');
      if (result) {
        setSuccessMessage('Item added successfully!');
        setTimeout(() => {
          resetForm();
          onClose();
        }, 2000);
      } else {
        setFormError('Failed to add item. Please try again.');
      }
    } catch (error) {
      console.error("Error submitting item:", error);
      setFormError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('Electronics');
    setPrice('');
    setFeatures(['']);
    setImages([]);
    setFormError('');
    setSuccessMessage('');
  };

  const addFeatureField = () => {
    if (features.length < 10) {
      setFeatures([...features, '']);
    }
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  const removeFeature = (index) => {
    if (features.length > 1) {
      const updatedFeatures = features.filter((_, i) => i !== index);
      setFeatures(updatedFeatures);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.4 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.3 }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const handleEscapeKey = (e) => {
    if (e.key === 'Escape' && !isSubmitting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleEscapeKey}
          tabIndex={0}
        >
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={!isSubmitting ? onClose : undefined}
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {!isSubmitting && (
              <motion.button
                className="absolute top-6 right-6 z-20 bg-white bg-opacity-90 text-gray-600 hover:text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-gray-200"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}

            <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
                <h2 className="text-2xl font-bold">Add New Item</h2>
                <p className="text-blue-100">Fill out the form below to add a new item to the collection</p>
              </div>

              <div className="p-8">
                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {successMessage}
                  </motion.div>
                )}

                {formError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formError}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Item Name*
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter item name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Category */}
                      <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                          Category*
                        </label>
                        <select
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          disabled={isSubmitting}
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                          Price*
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-gray-500">Rs.</span>
                          </div>
                          <input
                            type="text"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Features*
                          </label>
                          {features.length < 10 && (
                            <button
                              type="button"
                              onClick={addFeatureField}
                              disabled={isSubmitting}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Add Feature
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                placeholder={`Feature ${index + 1}`}
                                className="flex-1 px-4 py-3 rounded-l-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                disabled={isSubmitting}
                              />
                              {features.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeFeature(index)}
                                  disabled={isSubmitting}
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-3 rounded-r-xl transition-colors duration-300"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Add up to 10 features that describe your item.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Images* (Up to 9)
                      </label>
                      <ImageUploader 
                        images={images} 
                        setImages={setImages} 
                        isSubmitting={isSubmitting}
                        maxImages={9}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-6 py-3 mr-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 rounded-xl font-medium text-white shadow-lg transition-all duration-300 flex items-center justify-center ${
                        isSubmitting
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Add Item'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddItemModal;