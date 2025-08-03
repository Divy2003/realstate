import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteProject, toggleProjectFeatured } from '../store/slices/projectsSlice';
import { projectUtils } from '../services/api';
import BrochureModal from './BrochureModal';
import '../styles/OngoingProjects.css';

const ProjectCard = ({ project, index, inView, onClick, isAdmin = false }) => {
  const dispatch = useDispatch();
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const isOngoing = project.status === 'under-construction' || project.status === 'ongoing';
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
      try {
        await dispatch(deleteProject(project.id)).unwrap();
      } catch (error) {
        alert('Failed to delete project: ' + error);
      }
    }
  };

  const handleToggleFeatured = async () => {
    try {
      await dispatch(toggleProjectFeatured(project.id)).unwrap();
    } catch (error) {
      alert('Failed to update project: ' + error);
    }
  };

  const handleBrochureClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowBrochureModal(true);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <motion.div
        className="project-card"
        variants={cardVariants}
        whileHover={{
          y: -10,
          transition: { duration: 0.3 }
        }}
      >
        {/* Admin Menu */}
        {isAdmin && (
          <div className="admin-menu">
            <button
              className="admin-menu-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setShowAdminMenu(!showAdminMenu);
              }}
            >
              ⋮
            </button>
            {showAdminMenu && (
              <div className="admin-menu-dropdown">
                <Link
                  to={`/admin/projects/edit/${project.id}`}
                  className="admin-menu-item"
                  onClick={(e) => e.stopPropagation()}
                >
                  ✏️ Edit
                </Link>
                <button
                  className="admin-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFeatured();
                  }}
                >
                  {project.featured ? '⭐ Unfeature' : '⭐ Feature'}
                </button>
                <button
                  className="admin-menu-item admin-menu-item--danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <div className="featured-badge">
            ⭐ Featured
          </div>
        )}

        <Link to={`/projects/${project.id}`} className="card-link">
          <div className="card-image">
            <img
              src={project.images?.[0] || project.image || '/placeholder-project.jpg'}
              alt={project.title}
            />
            {isOngoing && project.progress !== undefined && (
              <div className="card-overlay">
                <motion.div
                  className="progress-circle"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                >
                  <svg className="progress-ring" width="80" height="80">
                    <circle
                      className="progress-ring-circle"
                      stroke="var(--accent-primary)"
                      strokeWidth="3"
                      fill="transparent"
                      r="35"
                      cx="40"
                      cy="40"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 35}`,
                        strokeDashoffset: `${2 * Math.PI * 35 * (1 - (project.progress || 0) / 100)}`,
                        transition: 'stroke-dashoffset 1s ease-in-out'
                      }}
                    />
                  </svg>
                  <span className="progress-text">{project.progress}%</span>
                </motion.div>
              </div>
            )}
          </div>

          <div className="card-content">
            <div className="card-header">
              <h3 className="project-title">{project.title}</h3>
              <span className="project-location">📍 {project.location}</span>
              <div className="project-status">
                <span className={`status-badge status-badge--${project.status}`}>
                  {project.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <p className="project-description">
              {project.description?.substring(0, 120)}
              {project.description?.length > 120 ? '...' : ''}
            </p>

            <div className="project-price">
              {projectUtils.formatPrice(project.price)}
            </div>

            <div className="project-details">
              {project.totalUnits && (
                <div className="detail-item">
                  <span className="detail-label">Units:</span>
                  <span className="detail-value">{project.totalUnits}</span>
                </div>
              )}
              {project.type && (
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{project.type}</span>
                </div>
              )}
            </div>

            {project.amenities && project.amenities.length > 0 && (
              <div className="project-features">
                {project.amenities.slice(0, 3).map((amenity, idx) => (
                  <span key={amenity._id || idx} className="feature-tag">
                    {amenity.name}
                    {amenity.icon && <img src={amenity.icon} alt={amenity.name} style={{width:16, height:16, marginLeft:4}} />}
                  </span>
                ))}
                {project.amenities.length > 3 && (
                  <span className="feature-tag feature-more">
                    +{project.amenities.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="card-actions">
              {project.brochure && (
                <button
                  onClick={handleBrochureClick}
                  className="btn btn-outline"
                >
                  📄 Brochure
                </button>
              )}
              <span className="btn btn-primary">
                View Details
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Brochure Modal */}
      {showBrochureModal && (
        <BrochureModal
          project={project}
          onClose={() => setShowBrochureModal(false)}
        />
      )}
    </>
  );
};

export default ProjectCard;
