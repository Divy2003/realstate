import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import '../styles/CompletedProjectsPage.css';

const CompletedProjects = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', 'Residential', 'Commercial', 'Mixed-Use', 'Restoration'];

  const completedProjects = [
    {
      id: 1,
      title: "Luxury Heights",
      location: "Upper East Side",
      category: "Residential",
      completedYear: "2023",
      investment: "$45M",
      units: 80,
      floors: 18,
      description: "A prestigious residential tower featuring luxury apartments with premium amenities and stunning city views.",
      features: ["Concierge Service", "Rooftop Pool", "Fitness Center", "Valet Parking", "Smart Home Technology"],
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
      ],
      awards: ["Best Residential Project 2023", "Sustainable Design Award"],
      clientSatisfaction: 98
    },
    {
      id: 2,
      title: "Corporate Plaza",
      location: "Business District",
      category: "Commercial",
      completedYear: "2022",
      investment: "$80M",
      units: 40,
      floors: 25,
      description: "A modern commercial complex designed for Fortune 500 companies with state-of-the-art facilities.",
      features: ["High-Speed Internet", "Conference Centers", "Executive Lounges", "Parking Garage", "24/7 Security"],
      images: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
      ],
      awards: ["Commercial Excellence Award", "LEED Gold Certification"],
      clientSatisfaction: 95
    },
    {
      id: 3,
      title: "Garden Residences",
      location: "Suburban Valley",
      category: "Residential",
      completedYear: "2023",
      investment: "$35M",
      units: 120,
      floors: 6,
      description: "Eco-friendly residential community with sustainable design and beautiful landscaping.",
      features: ["Solar Panels", "Community Garden", "Playground", "Walking Trails", "Electric Vehicle Charging"],
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop"
      ],
      awards: ["Green Building Award", "Community Choice Award"],
      clientSatisfaction: 97
    },
    {
      id: 4,
      title: "Innovation Hub",
      location: "Tech District",
      category: "Mixed-Use",
      completedYear: "2022",
      investment: "$90M",
      units: 60,
      floors: 20,
      description: "A mixed-use development combining office spaces, retail outlets, and residential units for tech professionals.",
      features: ["Co-working Spaces", "Retail Stores", "Residential Units", "Innovation Labs", "Food Court"],
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
      ],
      awards: ["Innovation in Design", "Mixed-Use Excellence"],
      clientSatisfaction: 96
    },
    {
      id: 5,
      title: "Historic Manor",
      location: "Heritage District",
      category: "Restoration",
      completedYear: "2021",
      investment: "$25M",
      units: 30,
      floors: 4,
      description: "Careful restoration of a historic manor while preserving its architectural heritage and adding modern amenities.",
      features: ["Historic Preservation", "Modern Amenities", "Art Gallery", "Boutique Shops", "Event Spaces"],
      images: [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
      ],
      awards: ["Heritage Preservation Award", "Architectural Excellence"],
      clientSatisfaction: 99
    },
    {
      id: 6,
      title: "Waterfront Towers",
      location: "Marina District",
      category: "Residential",
      completedYear: "2023",
      investment: "$60M",
      units: 100,
      floors: 22,
      description: "Luxury waterfront residential towers with panoramic ocean views and premium marina access.",
      features: ["Ocean Views", "Marina Access", "Spa & Wellness", "Private Beach", "Yacht Club"],
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
      ],
      awards: ["Luxury Development Award", "Waterfront Excellence"],
      clientSatisfaction: 98
    }
  ];

  const filteredProjects = selectedCategory === 'All' 
    ? completedProjects 
    : completedProjects.filter(project => project.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <div className="completed-projects-page">
      <div className="container">
        {/* Page Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">Completed Projects</h1>
          <p className="page-subtitle">
            Explore our portfolio of successfully completed projects that showcase our commitment to excellence and innovation.
          </p>
          
          {/* Statistics */}
          <div className="completion-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Projects Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Awards Won</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="filter-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="filter-buttons">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          ref={ref}
          className="completed-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="completed-card"
              variants={itemVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedProject(project)}
            >
              <div className="card-image">
                <img src={project.images[0]} alt={project.title} />
                <div className="card-overlay">
                  <span className="completion-year">{project.completedYear}</span>
                  <div className="satisfaction-badge">
                    <span>{project.clientSatisfaction}%</span>
                    <small>Satisfaction</small>
                  </div>
                </div>
              </div>

              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">{project.title}</h3>
                  <p className="card-location">{project.location}</p>
                  <span className="card-category">{project.category}</span>
                </div>

                <p className="card-description">{project.description}</p>

                <div className="card-details">
                  <div className="detail-item">
                    <span className="detail-label">Investment</span>
                    <span className="detail-value">{project.investment}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Units</span>
                    <span className="detail-value">{project.units}</span>
                  </div>
                </div>

                <div className="card-awards">
                  {project.awards.slice(0, 2).map((award, index) => (
                    <span key={index} className="award-badge">
                      🏆 {award}
                    </span>
                  ))}
                </div>

                <motion.button
                  className="view-details-btn"
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

      {/* Project Modal */}
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
              {selectedProject.images.map((image, index) => (
                <img key={index} src={image} alt={`${selectedProject.title} ${index + 1}`} />
              ))}
            </div>

            <div className="modal-info">
              <h3>{selectedProject.title}</h3>
              <p className="modal-location">{selectedProject.location}</p>
              <p className="modal-description">{selectedProject.description}</p>
              
              <div className="modal-features">
                {selectedProject.features.map((feature, index) => (
                  <span key={index} className="modal-feature">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CompletedProjects;
