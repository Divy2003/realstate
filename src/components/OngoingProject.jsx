import React from 'react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projectsData';

const OngoingProject = ({ inView, onProjectClick }) => {
  const ongoingProjects = projects.filter(project => project.status === 'ongoing');

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
