import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useForm, ValidationError } from '@formspree/react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaHandshake, FaDollarSign, FaCheck, FaTimes } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime, MdOutlineSupportAgent } from 'react-icons/md';
import '../styles/Contact.css';

const Contact = () => {
  const [state, handleSubmit] = useForm("xpwlrove");
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const contactInfo = [
    {
      icon: <MdLocationOn className="contact-icon" />,
      title: "Visit Our Office",
      details: ["Anusthan, Near Rythm Heights", "Zundal, Gujarat, 382421"],
      action: "Get Directions"
    },
    {
      icon: <MdPhone className="contact-icon" />,
      title: "Call Us",
      details: ["+91 9376762299"],
      action: "Call Now"
    },
    {
      icon: <MdEmail className="contact-icon" />,
      title: "Email Us",
      details: ["info@eliteestate.com", "projects@eliteestate.com"],
      action: "Send Email"
    },
    {
      icon: <MdAccessTime className="contact-icon" />,
      title: "Business Hours",
      details: ["Monday - Friday: 10:00 AM - 6:00 PM", "Saturday - Sunday: 10:00 AM - 7:00 PM"],
      action: "Schedule Meeting"
    }
  ];

  const services = [
    "Residential Development",
    
    "Property Management",
    "Real Estate Consulting",
    "Investment Advisory",
    "Architecture & Design"
  ];

  if (state.succeeded) {
    return (
      <motion.div 
        className="form-success"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-icon">
          <FaCheck className="check-icon" />
        </div>
        <h3>Thank you for your message!</h3>
        <p>We'll get back to you within 24 hours.</p>
      </motion.div>
    );
  }

  return (
    <div className="contact-page">
      <div className="container">
        {/* Page Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">Get In Touch</h1>
          <p className="page-subtitle">
            Ready to start your next project? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          className="contact-info-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              className="contact-info-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="info-icon">{info.icon}</div>
              <h3 className="info-title">{info.title}</h3>
              <div className="info-details">
                {info.details.map((detail, idx) => (
                  <p key={idx}>{detail}</p>
                ))}
              </div>
              <motion.button
                className="info-action"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {info.action}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          ref={ref}
          className="contact-content"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Contact Form */}
          <motion.div className="contact-form-section" variants={itemVariants}>
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    required
                    className="form-input"
                  />
                  <ValidationError 
                    prefix="First Name" 
                    field="firstName"
                    errors={state.errors}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    required
                    className="form-input"
                  />
                  <ValidationError 
                    prefix="Last Name" 
                    field="lastName"
                    errors={state.errors}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email" 
                    name="email"
                    required
                    className="form-input"
                  />
                  <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    className="form-input"
                  />
                  <ValidationError 
                    prefix="Phone" 
                    field="phone"
                    errors={state.errors}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="service">Service Interested In</label>
                <select
                  id="service"
                  name="service"
                  className="form-select"
                >
                  <option value="">Select a service</option>
                  {services.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                <ValidationError 
                  prefix="Service" 
                  field="service"
                  errors={state.errors}
                />
              </div>

              <div className="form-group">
                <label htmlFor="budget">Project Budget</label>
                <select
                  id="budget"
                  name="budget"
                  className="form-select"
                >
                  <option value="">Select budget range</option>
                  <option value="under-1m">Under $1M</option>
                  <option value="1m-5m">$1M - $5M</option>
                  <option value="5m-10m">$5M - $10M</option>
                  <option value="10m-25m">$10M - $25M</option>
                  <option value="25m-50m">$25M - $50M</option>
                  <option value="over-50m">Over $50M</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  required
                  className="form-textarea"
                  placeholder="Tell us about your project, timeline, and any specific requirements..."
                />
                <ValidationError 
                  prefix="Message" 
                  field="message"
                  errors={state.errors}
                />
              </div>

              <motion.button
                type="submit"
                disabled={state.submitting}
                className="submit-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {state.submitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Details */}
          <motion.div className="contact-details-section" variants={itemVariants}>
            <h2>Why Choose Elite Estate?</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon"><FaCheck /></span>
                <div>
                  <h4>Award-Winning Excellence</h4>
                  <p>Recognized industry leader with 50+ awards for outstanding projects.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">⚡</span>
                <div>
                  <h4>Fast Response Time</h4>
                  <p>We respond to all inquiries within 24 hours, often much sooner.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon"><FaHandshake /></span>
                <div>
                  <h4>Personalized Service</h4>
                  <p>Dedicated project managers ensure your vision becomes reality.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon"><FaDollarSign /></span>
                <div>
                  <h4>Transparent Pricing</h4>
                  <p>No hidden costs. Clear, upfront pricing for all our services.</p>
                </div>
              </div>
            </div>

            <div className="contact-cta">
              <h3>Ready to Get Started?</h3>
              <p>
                Schedule a free consultation with our experts to discuss your project requirements.
              </p>
              <motion.button
                className="schedule-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Free Consultation
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
