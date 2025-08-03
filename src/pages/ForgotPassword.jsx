import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError, selectAuth } from '../store/slices/authSlice';
import '../styles/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(selectAuth);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(forgotPassword(email)).unwrap();
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <motion.div
            className="auth-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="auth-form-section" variants={formVariants}>
              <div className="auth-form-container">
                <div className="auth-header">
                  <div className="success-icon">📧</div>
                  <h1>Check Your Email</h1>
                  <p>
                    We've sent password reset instructions to <strong>{email}</strong>
                  </p>
                </div>

                <div className="auth-success-content">
                  <p>
                    If you don't see the email in your inbox, please check your spam folder.
                    The reset link will expire in 10 minutes.
                  </p>
                  
                  <div className="auth-actions">
                    <Link to="/login" className="auth-link">
                      Back to Sign In
                    </Link>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setEmail('');
                      }}
                      className="resend-link"
                    >
                      Resend Email
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="auth-visual-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="auth-visual-content">
                <h2>Secure Password Reset</h2>
                <p>
                  Your account security is our priority. Follow the instructions
                  in your email to safely reset your password.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div
          className="auth-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left side - Form */}
          <motion.div className="auth-form-section" variants={formVariants}>
            <div className="auth-form-container">
              <div className="auth-header">
                <h1>Forgot Password?</h1>
                <p>Enter your email address and we'll send you reset instructions</p>
              </div>

              {error && (
                <motion.div
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="form-input"
                  />
                </div>

                <motion.button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </motion.button>
              </form>

              <div className="auth-footer">
                <p>
                  Remember your password?{' '}
                  <Link to="/login" className="auth-link">
                    Back to Sign In
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right side - Visual */}
          <motion.div
            className="auth-visual-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="auth-visual-content">
              <h2>Quick & Secure Recovery</h2>
              <p>
                We'll help you regain access to your account quickly and securely.
                Your data and privacy are always protected.
              </p>
              <div className="auth-visual-features">
                <div className="feature-item">
                  <span className="feature-icon">🔐</span>
                  <span>Secure Process</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Quick Recovery</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🛡️</span>
                  <span>Privacy Protected</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
