import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useDispatch } from 'react-redux';
import Hero from '../components/Hero';
import ProjectCompleted from '../components/ProjectCompleted';
import ProjectCard from '../components/ProjectCard';
import UpcomingProjects from '../components/UpcomingProjects';
import OngoingProject from '../components/OngoingProject';
import { fetchProjects } from '../store/slices/projectsSlice';
import { projects } from '../data/projectsData';
import '../styles/CompletedProjects.css';
import '../styles/Home.css';

const Home = () => {
  const dispatch = useDispatch();
  
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

  // For upcoming section
  const [upcomingRef, upcomingInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Pre-fetch all project types when component mounts
  useEffect(() => {
    // This will ensure all project types are loaded when the page loads
    // Each component will handle its own fetching, but this provides a fallback
    const fetchAllProjects = async () => {
      try {
        // Fetch all project types in parallel
        await Promise.all([
          dispatch(fetchProjects({ status: 'upcoming', limit: 6 })),
          dispatch(fetchProjects({ status: 'ongoing', limit: 6 })),
          dispatch(fetchProjects({ status: 'completed', limit: 12 }))
        ]);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchAllProjects();
  }, [dispatch]);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  return (
    <main className="main-content">
      <Hero />
      
      {/* Upcoming Projects Section */}
      <section id="upcoming" className="upcoming-projects" ref={upcomingRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: -30 }}
            animate={upcomingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              Upcoming <span className="title-accent">Projects</span>
            </h2>
            <p className="section-subtitle">
              Get a sneak peek at our future developments that will redefine urban living
            </p>
          </motion.div>

          <UpcomingProjects
            inView={upcomingInView}
            onProjectClick={setSelectedProject}
          />
        </div>
      </section>

      {/* Ongoing Projects Section */}
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

      {/* Completed Projects Section */}
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
                
                {selectedProject.gallery && (
                  <div className="modal-gallery">
                    {selectedProject.gallery.map((image, idx) => (
                      <img key={idx} src={image} alt={`${selectedProject.title} ${idx + 1}`} />
                    ))}
                  </div>
                )}
                
                <div className="modal-info">
                  <h3>{selectedProject.title}</h3>
                  <p className="modal-location">{selectedProject.location}</p>
                  <p className="modal-description">{selectedProject.description}</p>
                  
                  {selectedProject.features && (
                    <div className="modal-features">
                      {selectedProject.features.map((feature, idx) => (
                        <span key={idx} className="modal-feature">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
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