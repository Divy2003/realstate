import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Hero from '../components/Hero';
import ProjectCompleted from '../components/ProjectCompleted';
import { projects } from '../data/projectsData';
import '../styles/CompletedProjects.css';
import ProjectCard from '../components/ProjectCard';
import UpcommingProjects from '../components/UpcommingProjects';
import '../styles/Home.css';
import OngoingProject from '../components/OngoingProject';


const Home = () => {
  // For completed section
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  // For ongoing section
  const [ongoingRef, ongoingInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  return (
    <main className="main-content">
      <Hero />
      {/* Upcoming Projects Section */}
      <section id="upcoming" className="upcoming-projects">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              Upcoming <span className="title-accent">Projects</span>
            </h2>
            <p className="section-subtitle">
              Get a sneak peek at our future developments that will redefine urban living
            </p>
          </motion.div>

          <UpcommingProjects
            inView={true}
            onProjectClick={setSelectedProject}
          />
        </div>
      </section>

      {/* Ongoing Projects Section Styled Like Completed Projects */}
      <section id="ongoing" className="ongoing-projects" ref={ongoingRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: -30 }}
            animate={ongoingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              Ongoing <span className="title-accent">Projects</span>
            </h2>
            <p className="section-subtitle">
              Discover our current developments that are reshaping skylines and creating tomorrow's landmarks
            </p>
          </motion.div>

          <OngoingProject
            inView={ongoingInView}
            onProjectClick={setSelectedProject}
          />
        </div>
      </section>

      
      <section id="completed" className="completed-projects" ref={ref}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: -30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              Completed <span className="title-accent">Projects</span>
            </h2>
            <p className="section-subtitle">
              Explore our portfolio of successfully delivered projects that stand as testaments to our excellence
            </p>
          </motion.div>

          <ProjectCompleted 
            projects={projects}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            setSelectedProject={setSelectedProject}
          />
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
                  {selectedProject.gallery.map((image, idx) => (
                    <img key={idx} src={image} alt={`${selectedProject.title} ${idx + 1}`} />
                  ))}
                </div>
                
                <div className="modal-info">
                  <h3>{selectedProject.title}</h3>
                  <p className="modal-location">{selectedProject.location}</p>
                  <p className="modal-description">{selectedProject.description}</p>
                  
                  <div className="modal-features">
                    {selectedProject.features.map((feature, idx) => (
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

      
    </main>
  );
};

export default Home;
