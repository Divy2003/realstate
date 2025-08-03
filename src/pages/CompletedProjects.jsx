import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import ProjectCompleted from '../components/ProjectCompleted';
import { projects, categories } from '../data/projectsData';
import '../styles/CompletedProjectsPage.css';

const CompletedProjects = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  // Sort projects by year in descending order (newest first)
  const sortedProjects = [...projects].sort((a, b) => b.year - a.year);

  return (
    <div className="completed-projects-page">
      <div className="container">
        {/* Page Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">Completed Projects</h1>
          <p className="page-subtitle">
            Explore our portfolio of successfully completed projects that showcase our commitment to excellence and innovation.
          </p>
          
          {/* Statistics */}
          <div className="completion-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Projects Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Awards Won</span>
            </div>
          </div>
        </motion.div>

        {/* Project Gallery */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ProjectCompleted
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            setSelectedProject={setSelectedProject}
          />
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="project-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>
              
              <div className="modal-gallery">
                {selectedProject.gallery.map((image, idx) => (
                  <img key={idx} src={image} alt={`${selectedProject.title} ${idx + 1}`} />
                ))}
              </div>
              
              <div className="modal-info">
                <h3>{selectedProject.title}</h3>
                <p className="modal-location">{selectedProject.location}</p>
                <p className="modal-description">{selectedProject.description}</p>
                
                <div className="modal-features">
                  {selectedProject.features.map((feature, idx) => (
                    <span key={idx} className="modal-feature">
                      {feature}
                    </span>
                  ))}
                </div>

                
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompletedProjects;
