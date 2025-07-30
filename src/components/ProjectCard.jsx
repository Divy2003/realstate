import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/ongoingProjects.css';

const ProjectCard = ({ project, index, inView, onClick }) => {
  const isOngoing = project.status === 'ongoing';
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
    <motion.div
      className="project-card"
      variants={cardVariants}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      <div className="card-image">
        <img src={project.image} alt={project.title} />
        {isOngoing && (
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
          <span className="project-location">{project.location}</span>
        </div>

        <p className="project-description">{project.description}</p>

        <div className="project-details">
          <div className="detail-item">
            <span className="detail-label">Units:</span>
            <span className="detail-value">{project.units}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Price Range:</span>
            <span className="detail-value">{project.value}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Year:</span>
            <span className="detail-value">{ project.year}</span>
          </div>
        </div>

        <div className="project-features">
          {project.features.slice(0, 3).map((feature, idx) => (
            <span key={idx} className="feature-tag">
              {feature}
            </span>
          ))}
          {project.features.length > 3 && (
            <span className="feature-tag feature-more">
              +{project.features.length - 3} more
            </span>
          )}
        </div>

       

        
      </div>
    </motion.div>
  );
};

export default ProjectCard;
