import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectCard from './ProjectCard';
import { 
  fetchProjects, 
  selectProjectsLoading, 
  selectProjectsByStatus 
} from '../store/slices/projectsSlice';

const UpcomingProjects = ({ inView, onProjectClick }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectProjectsLoading);
  
  // Get upcoming projects directly from the selector
  const upcomingProjects = useSelector(selectProjectsByStatus('upcoming'));

  useEffect(() => {
    // Fetch upcoming projects
    dispatch(fetchProjects({ 
      status: 'upcoming', 
      limit: 6,
      page: 1
    }));
  }, [dispatch]);
  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading upcoming projects...</p>
      </div>
    );
  }

  if (upcomingProjects.length === 0) {
    return (
      <div className="empty-state">
        <h3>No upcoming projects</h3>
        <p>Check back soon for exciting new developments!</p>
      </div>
    );
  }

  return (
    <div className="projects-grid">
      {upcomingProjects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          inView={inView}
          onClick={() => onProjectClick(project)}
        />
      ))}
    </div>
  );
};

export default UpcomingProjects;
