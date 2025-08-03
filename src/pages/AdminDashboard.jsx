import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchProjects, deleteProject, toggleProjectFeatured } from '../store/slices/projectsSlice';
import { logout } from '../store/slices/authSlice';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { 
    projectsByStatus, 
    loading, 
    error 
  } = useSelector((state) => state.projects);
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // Combine all projects for admin view
  const allProjects = [
    ...(projectsByStatus?.ongoing || []),
    ...(projectsByStatus?.upcoming || []),
    ...(projectsByStatus?.completed || [])
  ];

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDeleteProject = async (projectId, projectTitle) => {
    if (window.confirm(`Are you sure you want to delete "${projectTitle}"?`)) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
        alert('Project deleted successfully');
      } catch (error) {
        alert('Failed to delete project: ' + error);
      }
    }
  };

  const handleToggleFeatured = async (projectId) => {
    try {
      await dispatch(toggleProjectFeatured(projectId)).unwrap();
    } catch (error) {
      alert('Failed to update project: ' + error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const stats = {
    totalProjects: allProjects.length,
    featuredProjects: allProjects.filter(p => p.featured).length,
    completedProjects: projectsByStatus?.completed?.length || 0,
    ongoingProjects: (projectsByStatus?.ongoing || []).length + (projectsByStatus?.['under-construction'] || []).length,
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div
      className="admin-dashboard"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div className="admin-title">
              <h1>Admin Dashboard</h1>
              <p>Welcome back, {user?.name || 'Admin'}</p>
            </div>
            <div className="admin-actions">
              <Link to="/" className="btn btn-outline">
                View Site
              </Link>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects
            </button>
          </div>

          {activeTab === 'overview' && (
            <motion.div
              className="overview-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🏢</div>
                  <div className="stat-content">
                    <h3>{stats.totalProjects}</h3>
                    <p>Total Projects</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <h3>{stats.featuredProjects}</h3>
                    <p>Featured Projects</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <h3>{stats.completedProjects}</h3>
                    <p>Completed</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🚧</div>
                  <div className="stat-content">
                    <h3>{stats.ongoingProjects}</h3>
                    <p>Under Construction</p>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <Link to="/admin/projects/new" className="action-btn">
                    <span className="action-icon">➕</span>
                    <span>Add New Project</span>
                  </Link>
                  <Link to="/admin/settings" className="action-btn">
                    <span className="action-icon">⚙️</span>
                    <span>Site Settings</span>
                  </Link>
                  <button
                    className="action-btn"
                    onClick={() => setActiveTab('projects')}
                  >
                    <span className="action-icon">📋</span>
                    <span>Manage Projects</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              className="projects-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="section-header">
                <h2>Manage Projects</h2>
                <Link to="/admin/projects/new" className="btn btn-primary">
                  ➕ Add New Project
                </Link>
              </div>

              {loading?.all ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading projects...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <h3>Error loading projects</h3>
                  <p>{error}</p>
                  <button
                    onClick={() => dispatch(fetchProjects())}
                    className="btn btn-primary"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="projects-table">
                  <div className="table-header">
                    <div className="table-cell">Project</div>
                    <div className="table-cell">Status</div>
                    <div className="table-cell">Featured</div>
                    <div className="table-cell">Actions</div>
                  </div>
                  {allProjects.map((project) => (
                    <div key={project.id} className="table-row">
                      <div className="table-cell project-info">
                        <img
                          src={project.images?.[0] || project.image || '/placeholder-project.jpg'}
                          alt={project.title}
                          className="project-thumbnail"
                        />
                        <div className="project-details">
                          <h4>{project.title}</h4>
                          <p>{project.location}</p>
                        </div>
                      </div>
                      <div className="table-cell">
                        <span className={`status-badge status-badge--${project.status}`}>
                          {project.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="table-cell">
                        <button
                          onClick={() => handleToggleFeatured(project.id)}
                          className={`featured-toggle ${project.featured ? 'featured' : ''}`}
                        >
                          {project.featured ? '⭐' : '☆'}
                        </button>
                      </div>
                      <div className="table-cell actions">
                        <Link
                          to={`/projects/${project.id}`}
                          className="action-btn-small view"
                          title="View"
                        >
                          👁️
                        </Link>
                        <Link
                          to={`/admin/projects/edit/${project.id}`}
                          className="action-btn-small edit"
                          title="Edit"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(project.id, project.title)}
                          className="action-btn-small delete"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;