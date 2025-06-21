"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUploader = ({ images, setImages, isSubmitting, maxImages = 9 }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setError('');
    const selectedFiles = e.target.files;
    
    if (!selectedFiles || selectedFiles.length === 0) return;

    if (images.length + selectedFiles.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images`);
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    const invalidFiles = Array.from(selectedFiles).filter(
      file => !validImageTypes.includes(file.type.toLowerCase())
    );

    if (invalidFiles.length > 0) {
      setError('Only JPG, JPEG, PNG, and GIF files are allowed');
      return;
    }

    setImages([...images, ...Array.from(selectedFiles)]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const event = { target: { files: e.dataTransfer.files } };
      handleFileChange(event);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    setError('');
  };

  const getImagePreview = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return file;
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-xl p-6 text-center ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } transition-all duration-300`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/gif, image/jpg"
          multiple
          className="hidden"
          disabled={isSubmitting || images.length >= maxImages}
        />

        <div className="space-y-3">
          <div className="flex justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a3 3 0 01-3-3V6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3H7z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 21h14a2 2 0 002-2V7.5a2.5 2.5 0 00-2.5-2.5H5.5A2.5 2.5 0 003 7.5V19a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11v4M16 13h-8" />
            </svg>
          </div>
          
          <div className="text-gray-600">
            <p className="text-lg font-medium">Drag & drop images or</p>
            <button
              type="button"
              onClick={handleButtonClick}
              disabled={isSubmitting || images.length >= maxImages}
              className={`mt-2 px-4 py-2 rounded-lg font-medium ${
                isSubmitting || images.length >= maxImages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200 active:bg-blue-300 transition-colors duration-300'
              }`}
            >
              Browse Files
            </button>
          </div>
          
          <p className="text-sm text-gray-500">
            {images.length} / {maxImages} images • JPG, PNG, GIF • Max 5MB each
          </p>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-sm flex items-center"
        >
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.div>
      )}

      {images.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-3 gap-3">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                >
                  <img
                    src={getImagePreview(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={isSubmitting}
                      className="opacity-0 group-hover:opacity-100 bg-white text-red-500 p-2 rounded-full hover:bg-red-100 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 truncate">
                    {image instanceof File ? image.name : `Image ${index + 1}`}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;