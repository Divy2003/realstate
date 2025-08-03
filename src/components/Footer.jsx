import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { FiPhone, FiMapPin } from 'react-icons/fi';
import { BsArrowRight, BsSend } from 'react-icons/bs';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { selectCompanyInfo, selectContactInfo, selectSocialMedia } from '../store/slices/settingsSlice';
import '../styles/Footer.css';

const Footer = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const companyInfo = useSelector(selectCompanyInfo);
  const contactInfo = useSelector(selectContactInfo);
  const socialMedia = useSelector(selectSocialMedia);
  const currentYear = new Date().getFullYear();

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

  const socialLinks = [
    { name: 'Facebook', icon: <FaFacebook />, url: socialMedia?.facebook || '#' },
    { name: 'Twitter', icon: <FaTwitter />, url: socialMedia?.twitter || '#' },
    { name: 'Instagram', icon: <FaInstagram />, url: socialMedia?.instagram || '#' },
    { name: 'LinkedIn', icon: <FaLinkedin />, url: socialMedia?.linkedin || '#' },
    { name: 'YouTube', icon: <FaYoutube />, url: socialMedia?.youtube || '#' }
  ].filter(link => link.url !== '#'); // Only show links that have actual URLs

  const quickLinks = [
    { name: 'About Us', url: '#about' },
    { name: 'Our Projects', url: '#projects' },
    { name: 'Services', url: '#services' },
    { name: 'Careers', url: '#careers' },
    { name: 'News', url: '#news' },
    { name: 'Contact', url: '#contact' }
  ];

  const services = [
    { name: 'Residential Development', url: '#' },
   
    { name: 'Property Management', url: '#' },
    { name: 'Real Estate Consulting', url: '#' },
    { name: 'Investment Advisory', url: '#' },
    { name: 'Architecture & Design', url: '#' }
  ];

  return (
    <footer id="contact" className="footer" ref={ref}>
      {/* Animated Background Elements */}
      <div className="footer__background">
        <motion.div
          className="bg-element bg-element--1"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="bg-element bg-element--2"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container">
        <motion.div
          className="footer__content"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Company Info */}
          <motion.div className="footer__section footer__company" variants={itemVariants}>
            <div className="company__logo">
              {companyInfo?.logo?.url ? (
                <img
                  src={companyInfo.logo.url}
                  alt={companyInfo.name || 'Company Logo'}
                  className="logo__image"
                />
              ) : (
                <>
                  <span className="logo__text"></span>
                  <span className="logo__accent">{companyInfo?.name || 'Anusthan'}</span>
                </>
              )}
            </div>
            <p className="company__description">
              {companyInfo?.description || 'Creating exceptional real estate experiences with innovative design, sustainable practices, and unmatched quality. Your dream property awaits.'}
            </p>
            <div className="company__stats">
              <div className="stat">
                <span className="stat__number">500+</span>
                <span className="stat__label">Properties Delivered</span>
              </div>
              <div className="stat">
                <span className="stat__number">15+</span>
                <span className="stat__label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat__number">50+</span>
                <span className="stat__label">Ongoing Projects</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="footer__section footer__links" variants={itemVariants}>
            <h3 className="section__title">Quick Links</h3>
            <ul className="links__list">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  className="links__item"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href={link.url} className="links__link">
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div className="footer__section footer__services" variants={itemVariants}>
            <h3 className="section__title">Our Services</h3>
            <ul className="links__list">
              {services.map((service, index) => (
                <motion.li
                  key={service.name}
                  className="links__item"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href={service.url} className="links__link">
                    {service.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div className="footer__section footer__contact" variants={itemVariants}>
            <h3 className="section__title">Get In Touch</h3>
            <div className="contact__info">
              <div className="contact__item">
                <span className="contact__icon"><FiMapPin /></span>
                <div className="contact__details">
                  <span className="contact__label">Address</span>
                  <span className="contact__value">
                    {contactInfo?.address?.street || 'Anusthan, Near Rythm Heights'}<br />
                    {contactInfo?.address?.city || 'Zundal'}, {contactInfo?.address?.state || 'Gujarat'}, {contactInfo?.address?.zipCode || '382421'}
                  </span>
                </div>
              </div>
              <div className="contact__item">
                <span className="contact__icon"><FiPhone /></span>
                <div className="contact__details">
                  <span className="contact__label">Phone</span>
                  <span className="contact__value">{contactInfo?.phone?.primary || '+91 9376762299'}</span>
                </div>
              </div>
              <div className="contact__item">
                <span className="contact__icon"><HiOutlineMail /></span>
                <div className="contact__details">
                  <span className="contact__label">Email</span>
                  <span className="contact__value">{contactInfo?.email?.primary || 'info@eliteestate.com'}</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="newsletter">
              <h4 className="newsletter__title">Stay Updated</h4>
              <p className="newsletter__description">
                Subscribe to our newsletter for the latest projects and offers.
              </p>
              <form className="newsletter__form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter__input"
                />
                <motion.button
                  type="submit"
                  className="newsletter__button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          className="footer__bottom"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="footer__bottom-content">
            <div className="footer__social">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  className="social__link"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 1 }}
                >
                  <span className="social__icon">{social.icon}</span>
                  <span className="social__name">{social.name}</span>
                </motion.a>
              ))}
            </div>

            <div className="footer__copyright">
              <p>
                © {currentYear} {companyInfo?.name || 'Elite Estate'}. All rights reserved. |
                <a href="#" className="footer__link"> Privacy Policy</a> |
                <a href="#" className="footer__link"> Terms of Service</a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
