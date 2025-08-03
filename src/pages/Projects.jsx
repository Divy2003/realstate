import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProjects,
  setFilters,
  selectProjectsByStatus,
  selectProjectsLoadingByStatus,
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

  // Get projects for all statuses
  const ongoingProjects = useSelector(selectProjectsByStatus('ongoing'));
  const upcomingProjects = useSelector(selectProjectsByStatus('upcoming'));
  const completedProjects = useSelector(selectProjectsByStatus('completed'));
  const allProjects = useSelector(selectProjectsByStatus('all'));

  // Get loading states
  const ongoingLoading = useSelector(selectProjectsLoadingByStatus('ongoing'));
  const upcomingLoading = useSelector(selectProjectsLoadingByStatus('upcoming'));
  const completedLoading = useSelector(selectProjectsLoadingByStatus('completed'));
  const allLoading = useSelector(selectProjectsLoadingByStatus('all'));

  const error = useSelector(selectProjectsError);
  const filters = useSelector(selectProjectsFilters);
  const pagination = useSelector(selectProjectsPagination);
  const isAdmin = useSelector(selectIsAdmin);

  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Get the appropriate projects and loading state based on active tab
  const getCurrentProjects = () => {
    switch (activeTab) {
      case 'ongoing':
        return ongoingProjects;
      case 'upcoming':
        return upcomingProjects;
      case 'completed':
        return completedProjects;
      case 'all':
      default:
        // Combine all projects for 'all' tab
        return [...ongoingProjects, ...upcomingProjects, ...completedProjects];
    }
  };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case 'ongoing':
        return ongoingLoading;
      case 'upcoming':
        return upcomingLoading;
      case 'completed':
        return completedLoading;
      case 'all':
      default:
        return ongoingLoading || upcomingLoading || completedLoading || allLoading;
    }
  };

  const filteredProjects = getCurrentProjects();
  const isLoading = getCurrentLoading();

  useEffect(() => {
    // Fetch projects based on active tab
    const fetchProjectsForTab = async () => {
      if (activeTab === 'all') {
        // Fetch all types for 'all' tab
        const promises = [];
        
        if (ongoingProjects.length === 0) {
          promises.push(dispatch(fetchProjects({ status: 'ongoing', limit: 12 })));
        }
        if (upcomingProjects.length === 0) {
          promises.push(dispatch(fetchProjects({ status: 'upcoming', limit: 12 })));
        }
        if (completedProjects.length === 0) {
          promises.push(dispatch(fetchProjects({ status: 'completed', limit: 12 })));
        }
        
        if (promises.length > 0) {
          await Promise.all(promises);
        }
      } else {
        // Fetch specific status
        const currentProjects = getCurrentProjects();
        if (currentProjects.length === 0) {
          dispatch(fetchProjects({
            page: 1,
            limit: 12,
            status: activeTab
          }));
        }
      }
    };

    fetchProjectsForTab();
  }, [dispatch, activeTab, ongoingProjects.length, upcomingProjects.length, completedProjects.length]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const statusFilter = tab === 'all' ? '' : tab;
    dispatch(setFilters({ status: statusFilter }));
  };

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
              onClick={() => {
                if (activeTab === 'all') {
                  dispatch(fetchProjects({ status: 'ongoing', limit: 12 }));
                  dispatch(fetchProjects({ status: 'upcoming', limit: 12 }));
                  dispatch(fetchProjects({ status: 'completed', limit: 12 }));
                } else {
                  dispatch(fetchProjects({ status: activeTab, limit: 12 }));
                }
              }}
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
              All Projects ({ongoingProjects.length + upcomingProjects.length + completedProjects.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'ongoing' ? 'active' : ''}`}
              onClick={() => handleTabChange('ongoing')}
            >
              Ongoing ({ongoingProjects.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => handleTabChange('upcoming')}
            >
              Upcoming ({upcomingProjects.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => handleTabChange('completed')}
            >
              Completed ({completedProjects.length})
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading {activeTab === 'all' ? 'all' : activeTab} projects...</p>
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
                <h3>No {activeTab === 'all' ? '' : activeTab} projects found</h3>
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

        {/* Pagination could be added here if needed */}
        {filteredProjects.length > 0 && pagination && pagination.pages > 1 && (
          <div className="pagination">
            <p>
              Showing {filteredProjects.length} of {pagination.total} projects
            </p>
            {/* Add pagination controls here if needed */}
          </div>
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