import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProject, 
  clearCurrentProject, 
  selectCurrentProject, 
  selectProjectsLoading, 
  selectProjectsError 
} from '../store/slices/projectsSlice';
import { projectUtils } from '../services/api';
import BrochureModal from '../components/BrochureModal';
import '../styles/ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const project = useSelector(selectCurrentProject);
  const isLoading = useSelector(selectProjectsLoading);
  const error = useSelector(selectProjectsError);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showBrochureModal, setShowBrochureModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProject(id));
    }
    
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch, id]);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const handleBrochureDownload = () => {
    setShowBrochureModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (isLoading) {
    return (
      <div className="project-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-error">
        <h2>Error Loading Project</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/projects')} className="btn btn-primary">
          Back to Projects
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-error">
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/projects')} className="btn btn-primary">
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="project-detail"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section className="project-hero" variants={itemVariants}>
        <div className="container">
          <div className="project-hero__content">
            <div className="project-hero__info">
              <div className="project-breadcrumb">
                <button onClick={() => navigate('/projects')} className="breadcrumb-link">
                  ← Back to Projects
                </button>
              </div>
              
              <h1 className="project-title">{project.title}</h1>
              <p className="project-location">📍 {project.location}</p>
              
              <div className="project-meta">
                <span className={`project-status project-status--${project.status}`}>
                  {project.status.replace('-', ' ').toUpperCase()}
                </span>
                {project.featured && (
                  <span className="project-featured">⭐ Featured</span>
                )}
              </div>
              
              <div className="project-price">
                {projectUtils.formatPrice(project.price)}
              </div>
              
              {project.progress !== undefined && (
                <div className="project-progress">
                  <div className="progress-label">
                    Construction Progress: {project.progress}%
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="project-hero__actions">
              {project.brochure && (
                <button 
                  onClick={handleBrochureDownload}
                  className="btn btn-primary"
                >
                  📄 Download Brochure
                </button>
              )}
              <button className="btn btn-outline">
                📞 Contact Us
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Image Gallery */}
      {project.images && project.images.length > 0 && (
        <motion.section className="project-gallery" variants={itemVariants}>
          <div className="container">
            <h2>Gallery</h2>
            <div className="gallery-grid">
              {project.images.map((image, index) => (
                <motion.div
                  key={index}
                  className="gallery-item"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleImageClick(index)}
                >
                  <img src={image} alt={`${project.title} - Image ${index + 1}`} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Project Details */}
      <motion.section className="project-details" variants={itemVariants}>
        <div className="container">
          <div className="details-grid">
            {/* Description */}
            <div className="detail-section">
              <h3>About This Project</h3>
              <p>{project.description}</p>
            </div>

            {/* Specifications */}
            {project.specifications && (
              <div className="detail-section">
                <h3>Specifications</h3>
                <div className="specs-grid">
                  {Object.entries(project.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <div className="detail-section">
                <h3>Amenities</h3>
                <div className="amenities-grid">
                  {project.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-name">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {project.timeline && project.timeline.phases && (
              <div className="detail-section">
                <h3>Project Timeline</h3>
                <div className="timeline">
                  {project.timeline.phases.map((phase, index) => (
                    <div key={index} className={`timeline-item timeline-item--${phase.status}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>{phase.name}</h4>
                        <p>{phase.description}</p>
                        <div className="timeline-dates">
                          <span>Start: {new Date(phase.startDate).toLocaleDateString()}</span>
                          <span>End: {new Date(phase.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Facilities */}
            {project.nearbyFacilities && project.nearbyFacilities.length > 0 && (
              <div className="detail-section">
                <h3>Nearby Facilities</h3>
                <div className="facilities-grid">
                  {project.nearbyFacilities.map((facility, index) => (
                    <div key={index} className="facility-item">
                      <span className="facility-name">{facility.name}</span>
                      <span className="facility-distance">{facility.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section className="project-contact" variants={itemVariants}>
        <div className="container">
          <div className="contact-card">
            <h3>Interested in this project?</h3>
            <p>Get in touch with our sales team for more information and site visits.</p>
            <div className="contact-actions">
              <button className="btn btn-primary">Schedule Site Visit</button>
              <button className="btn btn-outline">Request Callback</button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Modals */}
      <AnimatePresence>
        {showBrochureModal && (
          <BrochureModal
            project={project}
            onClose={() => setShowBrochureModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            className="image-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              className="image-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="image-modal-close"
                onClick={() => setShowImageModal(false)}
              >
                ×
              </button>
              <img
                src={project.images[selectedImageIndex]}
                alt={`${project.title} - Image ${selectedImageIndex + 1}`}
              />
              <div className="image-modal-nav">
                <button
                  onClick={() => setSelectedImageIndex(
                    selectedImageIndex > 0 ? selectedImageIndex - 1 : project.images.length - 1
                  )}
                >
                  ←
                </button>
                <span>{selectedImageIndex + 1} / {project.images.length}</span>
                <button
                  onClick={() => setSelectedImageIndex(
                    selectedImageIndex < project.images.length - 1 ? selectedImageIndex + 1 : 0
                  )}
                >
                  →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectDetail;
