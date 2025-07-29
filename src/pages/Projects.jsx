import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import '../styles/Projects.css';

const Projects = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const projects = [
    {
      id: 1,
      title: "Skyline Towers",
      location: "Downtown Manhattan",
      type: "Residential Complex",
      status: "In Progress",
      progress: 75,
      startDate: "Jan 2024",
      expectedCompletion: "Dec 2024",
      investment: "$50M",
      units: 120,
      floors: 25,
      description: "A luxury residential complex featuring modern amenities, panoramic city views, and sustainable design elements.",
      features: ["Smart Home Technology", "Rooftop Garden", "Fitness Center", "Concierge Service", "Underground Parking"],
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Green Valley Estates",
      location: "Suburban Hills",
      type: "Gated Community",
      status: "Planning",
      progress: 25,
      startDate: "Mar 2024",
      expectedCompletion: "Mar 2026",
      investment: "$75M",
      units: 200,
      floors: 3,
      description: "An eco-friendly gated community with sustainable homes, green spaces, and community facilities.",
      features: ["Solar Panels", "Rainwater Harvesting", "Community Center", "Playground", "Walking Trails"],
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Metro Business Hub",
      location: "Financial District",
      type: "Commercial Complex",
      status: "In Progress",
      progress: 60,
      startDate: "Sep 2023",
      expectedCompletion: "Jun 2024",
      investment: "$100M",
      units: 50,
      floors: 35,
      description: "A state-of-the-art commercial complex designed for modern businesses with premium office spaces.",
      features: ["High-Speed Elevators", "Conference Centers", "Food Court", "Parking Garage", "24/7 Security"],
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Oceanview Residences",
      location: "Coastal Avenue",
      type: "Luxury Apartments",
      status: "Starting Soon",
      progress: 10,
      startDate: "Jun 2024",
      expectedCompletion: "Dec 2025",
      investment: "$80M",
      units: 80,
      floors: 20,
      description: "Luxury oceanfront apartments with breathtaking views and premium amenities for discerning residents.",
      features: ["Ocean Views", "Private Balconies", "Spa & Wellness", "Beach Access", "Valet Parking"],
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      title: "Tech Innovation Center",
      location: "Silicon Valley",
      type: "Mixed-Use Development",
      status: "In Progress",
      progress: 45,
      startDate: "Nov 2023",
      expectedCompletion: "Nov 2024",
      investment: "$120M",
      units: 30,
      floors: 15,
      description: "A cutting-edge mixed-use development combining office spaces, retail, and residential units for tech professionals.",
      features: ["Co-working Spaces", "Retail Outlets", "Residential Units", "Innovation Labs", "Electric Vehicle Charging"],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      title: "Heritage Square",
      location: "Historic District",
      type: "Restoration Project",
      status: "In Progress",
      progress: 80,
      startDate: "May 2023",
      expectedCompletion: "Apr 2024",
      investment: "$30M",
      units: 40,
      floors: 4,
      description: "Careful restoration of historic buildings while adding modern amenities and preserving architectural heritage.",
      features: ["Historic Preservation", "Modern Amenities", "Courtyard Gardens", "Art Gallery", "Boutique Shops"],
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'var(--accent-primary)';
      case 'Planning': return 'var(--accent-secondary)';
      case 'Starting Soon': return '#10B981';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="projects-page">
      <div className="container">
        {/* Page Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">Our Projects</h1>
          <p className="page-subtitle">
            Discover our ongoing developments and upcoming projects that are shaping the future of real estate.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          ref={ref}
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="project-card"
              variants={itemVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <span 
                    className="project-status"
                    style={{ backgroundColor: getStatusColor(project.status) }}
                  >
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-location">{project.location}</p>
                  <span className="project-type">{project.type}</span>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-progress">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                    />
                  </div>
                </div>

                <div className="project-details">
                  <div className="detail-item">
                    <span className="detail-label">Investment</span>
                    <span className="detail-value">{project.investment}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Units</span>
                    <span className="detail-value">{project.units}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Floors</span>
                    <span className="detail-value">{project.floors}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Completion</span>
                    <span className="detail-value">{project.expectedCompletion}</span>
                  </div>
                </div>

                <div className="project-features">
                  <h4>Key Features</h4>
                  <div className="features-list">
                    {project.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                    {project.features.length > 3 && (
                      <span className="feature-tag more">
                        +{project.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <motion.button
                  className="project-cta"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;
