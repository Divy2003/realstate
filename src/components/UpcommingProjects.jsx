import React from 'react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projectsData';

const UpcommingProjects = ({ inView, onProjectClick }) => {
  const upcomingProjects = projects.filter(project => project.status === 'upcoming');

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

export default UpcommingProjects;
