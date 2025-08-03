import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login, clearError, logout } from '../store/slices/authSlice';
import '../styles/Auth.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());

    // Redirect if already authenticated as admin
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [dispatch, isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(login(formData)).unwrap();

      // Check if user is admin
      if (result.user.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        dispatch(logout());
        return;
      }

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div
      className="auth-page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="auth-container">
        <motion.div
          className="auth-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="auth-header">
            <div className="auth-icon">
              🔐
            </div>
            <h1>Admin Login</h1>
            <p>Access the admin dashboard</p>
          </div>

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
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
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your admin email"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Login to Admin Panel'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <Link to="/admin/forgot-password" className="auth-link">
              Forgot your password?
            </Link>
            <div className="auth-divider">
              <span>or</span>
            </div>
            <Link to="/" className="auth-link secondary">
              ← Back to Website
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Background Animation */}
      <div className="auth-background">
        <div className="floating-shapes">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-shape"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;