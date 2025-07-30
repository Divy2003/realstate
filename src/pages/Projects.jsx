import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { projects } from '../data/projectsData';
import ProjectCard from '../components/ProjectCard';
import '../styles/Projects.css';
import { useState } from 'react';

const Projects = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('ongoing');

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    return project.status === activeTab;
  });

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
          <p>Explore our portfolio of current and upcoming developments</p>
          
          <div className="project-tabs">
            <button 
              className={`tab-btn ${activeTab === 'ongoing' ? 'active' : ''}`}
              onClick={() => setActiveTab('ongoing')}
            >
              Ongoing
            </button>
            <button 
              className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.id}
              project={project}
              index={index}
              inView={inView}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </motion.div>
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
