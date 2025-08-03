import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectCard from './ProjectCard';
import { fetchProjects, selectProjects, selectProjectsLoading, selectProjectsByStatus } from '../store/slices/projectsSlice';

const OngoingProject = ({ inView, onProjectClick }) => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const isLoading = useSelector(selectProjectsLoading);
  
  // Use the selector to filter projects by status
  const ongoingProjects = useSelector(state => 
    selectProjectsByStatus('ongoing')(state)
  );

  useEffect(() => {
    // Fetch ongoing projects
    dispatch(fetchProjects({ status: 'ongoing', limit: 6 }));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading ongoing projects...</p>
      </div>
    );
  }

  if (ongoingProjects.length === 0) {
    return (
      <div className="empty-state">
        <h3>No ongoing projects</h3>
        <p>All projects are currently in planning or completed phase.</p>
      </div>
    );
  }

  return (
    <div className="projects-grid">
      {ongoingProjects.map((project, index) => (
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

export default OngoingProject;
