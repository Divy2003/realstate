import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../services/api';
import '../styles/ImageUpload.css';

const ImageUpload = ({
  onUpload,
  multiple = false,
  maxFiles = 10,
  accept = "image/*",
  label = "Upload Images",
  existingImages = [],
  onRemove = null,
  isLoading = false,
  fieldName = null // Custom field name for FormData
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [imageErrors, setImageErrors] = useState(new Set());
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    
    if (!multiple && fileArray.length > 1) {
      alert('Please select only one file');
      return;
    }

    if (multiple && fileArray.length > maxFiles) {
      alert(`Please select no more than ${maxFiles} files`);
      return;
    }

    // 🔍 Validate file types
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // 📤 Upload files
    try {
      const formData = new FormData();

      // Use custom field name if provided, otherwise use default logic
      const uploadFieldName = fieldName || (multiple ? 'images' : 'image');

      if (multiple) {
        validFiles.forEach(file => {
          formData.append(uploadFieldName, file);
        });
      } else {
        formData.append(uploadFieldName, validFiles[0]);
      }

      // Call the upload handler
      await onUpload(formData, validFiles);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 🖼️ Handle image error
  const handleImageError = (index, imageUrl) => {
    console.warn('Image failed to load:', imageUrl);
    setImageErrors(prev => new Set([...prev, index]));
  };

  // 🔧 Get display URL for existing images
  const getDisplayUrl = (image) => {
    if (typeof image === 'string') {
      return getImageUrl(image);
    }
    if (image && image.url) {
      return getImageUrl(image.url);
    }
    return '/placeholder-image.jpg';
  };

  return (
    <div className="image-upload-container">
      <div className="upload-section">
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''} ${isLoading ? 'uploading' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          
          <div className="upload-content">
            {isLoading ? (
              <div className="upload-loading">
                <div className="loading-spinner"></div>
                <p>📤 Uploading...</p>
              </div>
            ) : (
              <>
                <div className="upload-icon">📁</div>
                <h3>{label}</h3>
                <p>
                  Drag and drop {multiple ? 'images' : 'an image'} here, or click to select
                </p>
                <p className="upload-info">
                  📷 Supports: JPG, PNG, GIF, WebP (Max: 10MB {multiple ? `per file, ${maxFiles} files total` : ''})
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 🖼️ Existing Images Preview */}
      {existingImages.length > 0 && (
        <div className="existing-images">
          <h4>🖼️ Current Images</h4>
          <div className="images-grid">
            <AnimatePresence>
              {existingImages.map((image, index) => {
                const displayUrl = getDisplayUrl(image);
                const hasError = imageErrors.has(index);
                
                return (
                  <motion.div
                    key={image.url || image || index}
                    className="image-preview"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="image-container">
                      {!hasError ? (
                        <img
                          src={displayUrl}
                          alt={`Preview ${index + 1}`}
                          loading="lazy"
                          onError={() => handleImageError(index, displayUrl)}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      ) : (
                        <div className="image-error">
                          <span>❌</span>
                          <p>Failed to load</p>
                        </div>
                      )}
                    </div>
                    
                    {onRemove && (
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(index);
                        }}
                        title="Remove image"
                      >
                        ❌
                      </button>
                    )}
                    
                    {/* 🔗 Show URL for debugging in development */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="image-debug-info" style={{ 
                        fontSize: '10px', 
                        color: '#666', 
                        marginTop: '4px',
                        wordBreak: 'break-all' 
                      }}>
                        {displayUrl}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {/* 📊 Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="upload-progress-section">
              <h5>📊 Upload Progress</h5>
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="progress-item">
                  <span>{fileName}</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span>{progress}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;