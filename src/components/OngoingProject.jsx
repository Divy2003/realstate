import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectCard from './ProjectCard';
import {
  fetchProjects,
  selectProjectsByStatus,
  selectProjectsLoadingByStatus,
  selectFetchAttempted
} from '../store/slices/projectsSlice';

const OngoingProject = ({ inView, onProjectClick }) => {
  const dispatch = useDispatch();

  // Use the updated selectors
  const ongoingProjects = useSelector(selectProjectsByStatus('ongoing'));
  const isLoading = useSelector(selectProjectsLoadingByStatus('ongoing'));
  const fetchAttempted = useSelector(selectFetchAttempted('ongoing'));

  useEffect(() => {
    // Only fetch if we haven't attempted to fetch and we're not currently loading
    if (!fetchAttempted && !isLoading) {
      dispatch(fetchProjects({ status: 'ongoing', limit: 6 }));
    }
  }, [dispatch, fetchAttempted, isLoading]);

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