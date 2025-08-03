import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProjects,
  setFilters,
  selectProjects,
  selectProjectsLoading,
  selectProjectsError,
  selectProjectsFilters,
  selectProjectsPagination
} from '../store/slices/projectsSlice';
import { selectIsAdmin } from '../store/slices/authSlice';
import ProjectCard from '../components/ProjectCard';
import '../styles/Projects.css';

const Projects = () => {
  const dispatch = useDispatch();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const projects = useSelector(selectProjects);
  const isLoading = useSelector(selectProjectsLoading);
  const error = useSelector(selectProjectsError);
  const filters = useSelector(selectProjectsFilters);
  const pagination = useSelector(selectProjectsPagination);
  const isAdmin = useSelector(selectIsAdmin);

  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Fetch projects when component mounts
    let statusFilter = activeTab === 'all' ? '' : activeTab;
    dispatch(fetchProjects({
      page: 1,
      limit: 12,
      status: statusFilter
    }));
  }, [dispatch, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const statusFilter = tab === 'all' ? '' : tab;
    dispatch(setFilters({ status: statusFilter }));
  };

  const filteredProjects = projects;

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

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  if (error) {
    return (
      <section className="projects-page">
        <div className="container">
          <div className="error-state">
            <h2>Error Loading Projects</h2>
            <p>{error}</p>
            <button
              onClick={() => dispatch(fetchProjects())}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="projects-page" ref={ref}>
      <div className="container">
        <motion.div
          className="page-header"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={titleVariants}
        >
          <h1>Our Projects</h1>
          <p>Discover our premium real estate developments across prime locations</p>
          {isAdmin && (
            <div className="admin-actions">
              <button className="btn btn-primary">
                + Add New Project
              </button>
            </div>
          )}

          <div className="project-tabs">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTabChange('all')}
            >
              All Projects
            </button>
            <button
              className={`tab-btn ${activeTab === 'ongoing' ? 'active' : ''}`}
              onClick={() => handleTabChange('ongoing')}
            >
              Ongoing
            </button>
            <button
              className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => handleTabChange('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => handleTabChange('completed')}
            >
              Completed
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading projects...</p>
          </div>
        ) : (
          <motion.div
            className="projects-grid"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  inView={inView}
                  onClick={() => setSelectedProject(project)}
                  isAdmin={isAdmin}
                />
              ))
            ) : (
              <div className="empty-state">
                <h3>No projects found</h3>
                <p>No projects match the current filter criteria.</p>
                {isAdmin && (
                  <button className="btn btn-primary">
                    + Add First Project
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
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
                {selectedProject.gallery && selectedProject.gallery.map((image, idx) => (
                  <img key={idx} src={image} alt={`${selectedProject.title} ${idx + 1}`} />
                ))}
              </div>
              <div className="modal-info">
                <h3>{selectedProject.title}</h3>
                <p className="modal-location">{selectedProject.location}</p>
                <p className="modal-description">{selectedProject.description}</p>
                <div className="modal-features">
                  {selectedProject.features && selectedProject.features.map((feature, idx) => (
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
    </section>
  );
};

export default Projects;
