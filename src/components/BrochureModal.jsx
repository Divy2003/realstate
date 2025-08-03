import { useState } from 'react';
import { motion } from 'framer-motion';
import { leadsAPI } from '../services/api';
import '../styles/BrochureModal.css';

const BrochureModal = ({ project, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!formData.mobile.trim()) {
      setError('Mobile number is required');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Basic mobile validation (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const leadData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.replace(/\D/g, ''),
        message: formData.message.trim(),
        projectId: project.id,
        projectTitle: project.title,
        source: 'brochure_download',
        leadType: 'brochure_download',
      };
      
      const response = await leadsAPI.downloadBrochure(leadData);
      
      if (response.success) {
        setIsSuccess(true);
        
        // If brochure URL is provided, trigger download
        if (response.data?.brochureUrl) {
          const link = document.createElement('a');
          link.href = response.data.brochureUrl;
          link.download = `${project.title}-Brochure.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Brochure download error:', error);
      setError(error.message || 'Failed to process your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const contentVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: { scale: 0.8, opacity: 0 }
  };

  if (isSuccess) {
    return (
      <motion.div
        className="brochure-modal-overlay"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="brochure-modal success-modal"
          variants={contentVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h3>Thank You!</h3>
            <p>Your brochure download has started. We'll be in touch soon!</p>
            <div className="success-animation">
              <motion.div
                className="download-icon"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                📄
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="brochure-modal-overlay"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="brochure-modal"
        variants={contentVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Download Project Brochure</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="project-info">
            <h4>{project.title}</h4>
            <p>📍 {project.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="brochure-form">
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobile">Mobile Number *</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any specific requirements or questions?"
                rows="3"
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    📄 Download Brochure
                  </>
                )}
              </motion.button>
            </div>
          </form>

          <div className="privacy-notice">
            <p>
              <small>
                By downloading this brochure, you agree to our privacy policy. 
                We'll use your information to send you updates about this project 
                and other relevant properties.
              </small>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BrochureModal;
