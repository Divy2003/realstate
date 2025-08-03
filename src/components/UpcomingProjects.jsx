import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectCard from './ProjectCard';
import { 
  fetchProjects, 
  selectProjectsByStatus, 
  selectProjectsLoadingByStatus 
} from '../store/slices/projectsSlice';

const UpcomingProjects = ({ inView, onProjectClick }) => {
  const dispatch = useDispatch();
  
  // Use the updated selectors
  const upcomingProjects = useSelector(selectProjectsByStatus('upcoming'));
  const isLoading = useSelector(selectProjectsLoadingByStatus('upcoming'));

  useEffect(() => {
    // Only fetch if we don't have upcoming projects already
    if (upcomingProjects.length === 0 && !isLoading) {
      dispatch(fetchProjects({ 
        status: 'upcoming', 
        limit: 6,
        page: 1
      }));
    }
  }, [dispatch, upcomingProjects.length, isLoading]);
  
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