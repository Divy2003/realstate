import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import '../styles/OngoingProjects.css';

const OngoingProjects = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const projects = [
    {
      id: 1,
      title: "Skyline Towers",
      location: "Downtown Manhattan",
      description: "Luxury residential complex with 45 floors featuring modern amenities and breathtaking city views.",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      progress: 75,
      completion: "Q2 2024",
      units: 120,
      price: "$2.5M - $8.5M",
      features: ["Smart Home Technology", "Rooftop Garden", "Fitness Center", "Concierge Service"]
    },
    {
      id: 2,
      title: "Ocean View Residences",
      location: "Miami Beach",
      description: "Beachfront luxury condominiums with panoramic ocean views and world-class amenities.",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      progress: 60,
      completion: "Q4 2024",
      units: 85,
      price: "$1.8M - $6.2M",
      features: ["Private Beach Access", "Infinity Pool", "Spa & Wellness", "Marina Access"]
    },
    {
      id: 3,
      title: "Green Valley Estates",
      location: "Beverly Hills",
      description: "Eco-friendly luxury homes with sustainable design and premium finishes.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      progress: 40,
      completion: "Q1 2025",
      units: 24,
      price: "$5.5M - $12M",
      features: ["Solar Power", "Smart Irrigation", "Home Theater", "Wine Cellar"]
    },
    {
      id: 4,
      title: "Metropolitan Plaza",
      location: "Chicago Loop",
      description: "Mixed-use development combining luxury residences with premium retail spaces.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      progress: 85,
      completion: "Q3 2024",
      units: 200,
      price: "$800K - $3.5M",
      features: ["Retail Spaces", "Business Center", "Sky Lounge", "Valet Parking"]
    }
  ];

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

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
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
    <section id="projects" className="ongoing-projects" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          variants={titleVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="section-title">
            Ongoing <span className="title-accent">Projects</span>
          </h2>
          <p className="section-subtitle">
            Discover our current developments that are reshaping skylines and creating tomorrow's landmarks
          </p>
        </motion.div>

        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card"
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <div className="card-image">
                <img src={project.image} alt={project.title} />
                <div className="card-overlay">
                  <motion.div
                    className="progress-circle"
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                  >
                    <svg className="progress-ring" width="80" height="80">
                      <circle
                        className="progress-ring-circle"
                        stroke="var(--accent-primary)"
                        strokeWidth="3"
                        fill="transparent"
                        r="35"
                        cx="40"
                        cy="40"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 35}`,
                          strokeDashoffset: `${2 * Math.PI * 35 * (1 - project.progress / 100)}`,
                          transition: 'stroke-dashoffset 1s ease-in-out'
                        }}
                      />
                    </svg>
                    <span className="progress-text">{project.progress}%</span>
                  </motion.div>
                </div>
              </div>

              <div className="card-content">
                <div className="card-header">
                  <h3 className="project-title">{project.title}</h3>
                  <span className="project-location">{project.location}</span>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-details">
                  <div className="detail-item">
                    <span className="detail-label">Units:</span>
                    <span className="detail-value">{project.units}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Price Range:</span>
                    <span className="detail-value">{project.price}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Completion:</span>
                    <span className="detail-value">{project.completion}</span>
                  </div>
                </div>

                <div className="project-features">
                  {project.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                  {project.features.length > 3 && (
                    <span className="feature-tag feature-more">
                      +{project.features.length - 3} more
                    </span>
                  )}
                </div>

                <motion.button
                  className="btn btn-secondary card-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="section-footer"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.a
            href="#contact"
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Invest in Our Projects
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default OngoingProjects;
