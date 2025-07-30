import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import ProjectCard from './ProjectCard';

const ProjectCompleted = ({ projects, activeFilter, onFilterChange, setSelectedProject }) => {
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

  const completedProjects = projects.filter(project => project.status === 'completed');
const filteredProjects = activeFilter === 'all'
  ? completedProjects
  : completedProjects.filter(project => project.category === activeFilter);

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
  </>
);
};

export default ProjectCompleted;
