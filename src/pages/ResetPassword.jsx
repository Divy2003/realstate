import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearError, selectAuth } from '../store/slices/authSlice';
import '../styles/Auth.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(selectAuth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Check if passwords match
    if (formData.password && formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordMatch) {
      return;
    }

    if (!token) {
      return;
    }

    dispatch(resetPassword({ token, password: formData.password }));
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

  if (!token) {
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
                  <div className="error-icon">❌</div>
                  <h1>Invalid Reset Link</h1>
                  <p>This password reset link is invalid or has expired.</p>
                </div>

                <div className="auth-footer">
                  <Link to="/forgot-password" className="auth-link">
                    Request New Reset Link
                  </Link>
                  <Link to="/login" className="auth-link">
                    Back to Sign In
                  </Link>
                </div>
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
                <h1>Reset Password</h1>
                <p>Enter your new password below</p>
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
                  <label htmlFor="password">New Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter new password"
                      className="form-input"
                      minLength="6"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <small className="form-hint">
                    Password must be at least 6 characters long
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm new password"
                      className={`form-input ${!passwordMatch ? 'error' : ''}`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {!passwordMatch && (
                    <small className="form-error">
                      Passwords do not match
                    </small>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isLoading || !passwordMatch}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
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
              <h2>Almost There!</h2>
              <p>
                Create a strong password to secure your account and continue
                exploring amazing properties.
              </p>
              <div className="auth-visual-features">
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span>Secure Account</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✨</span>
                  <span>Fresh Start</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Ready to Explore</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
