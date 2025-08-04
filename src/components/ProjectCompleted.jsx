import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import ProjectCard from './ProjectCard';
import {
  fetchProjects,
  selectProjectsByStatus,
  selectProjectsLoadingByStatus,
  selectFetchAttempted
} from '../store/slices/projectsSlice';

const ProjectCompleted = ({ activeFilter, onFilterChange, setSelectedProject }) => {
  const dispatch = useDispatch();

  // Use the updated selectors
  const completedProjects = useSelector(selectProjectsByStatus('completed'));
  const isLoading = useSelector(selectProjectsLoadingByStatus('completed'));
  const fetchAttempted = useSelector(selectFetchAttempted('completed'));

  useEffect(() => {
    // Only fetch if we haven't attempted to fetch and we're not currently loading
    if (!fetchAttempted && !isLoading) {
      dispatch(fetchProjects({
        status: 'completed',
        limit: 12,
        page: 1
      }));
    }
  }, [dispatch, fetchAttempted, isLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'residential', label: 'Residential' },
    { id: 'mixed', label: 'Mixed-Use' }
  ];

  const filteredProjects = activeFilter === 'all'
    ? completedProjects
    : completedProjects.filter(project => project.category === activeFilter);

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading completed projects...</p>
      </div>
    );
  }

  return (
    <>
      {/* Filter Buttons */}
      <motion.div
        className="filter-buttons"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              inView={true}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No completed projects found</h3>
          <p>No projects match the current filter criteria.</p>
        </div>
      )}
    </>
  );
};

export default ProjectCompleted;