// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // User login
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Forgot password
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password
  resetPassword: async (token, password) => {
    return apiRequest(`/auth/reset-password/${token}`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
  },

  // Get current user profile
  getProfile: async () => {
    return apiRequest('/auth/me');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  // Logout
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },
};

// Projects API
export const projectsAPI = {
  // Get all projects
  getProjects: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/projects?${queryString}` : '/projects';
    return apiRequest(endpoint);
  },

  // Get single project
  getProject: async (identifier) => {
    return apiRequest(`/projects/${identifier}`);
  },

  // Create project (admin only)
  createProject: async (projectData) => {
    return apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  // Update project (admin only)
  updateProject: async (id, projectData) => {
    return apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  // Delete project (admin only)
  deleteProject: async (id) => {
    return apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Toggle featured status (admin only)
  toggleFeatured: async (id) => {
    return apiRequest(`/projects/${id}/featured`, {
      method: 'PATCH',
    });
  },

  // Get project statistics (admin only)
  getProjectStats: async () => {
    return apiRequest('/projects/admin/stats/overview');
  },
};

// Upload API
export const uploadAPI = {
  // Upload project images
  uploadProjectImages: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/project-images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },

  // Upload single site image (logo, favicon, etc.)
  uploadSiteImage: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/site-images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },

  // Upload floor plan
  uploadFloorPlan: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/floor-plans`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },
};

// Leads API
export const leadsAPI = {
  // Create lead (public)
  createLead: async (leadData) => {
    return apiRequest('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  // Download brochure (public)
  downloadBrochure: async (brochureData) => {
    return apiRequest('/leads/brochure-download', {
      method: 'POST',
      body: JSON.stringify(brochureData),
    });
  },

  // Get all leads (admin only)
  getLeads: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/leads?${queryString}` : '/leads';
    return apiRequest(endpoint);
  },

  // Get single lead (admin only)
  getLead: async (id) => {
    return apiRequest(`/leads/${id}`);
  },

  // Update lead (admin only)
  updateLead: async (id, leadData) => {
    return apiRequest(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  },

  // Update lead status (admin only)
  updateLeadStatus: async (id, status) => {
    return apiRequest(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Add contact history (admin only)
  addContactHistory: async (id, contactData) => {
    return apiRequest(`/leads/${id}/contact`, {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  // Add note (admin only)
  addNote: async (id, noteData) => {
    return apiRequest(`/leads/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  },

  // Schedule follow-up (admin only)
  scheduleFollowUp: async (id, followUpData) => {
    return apiRequest(`/leads/${id}/follow-up`, {
      method: 'PATCH',
      body: JSON.stringify(followUpData),
    });
  },

  // Get lead statistics (admin only)
  getLeadStats: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/leads/stats?${queryString}` : '/leads/stats';
    return apiRequest(endpoint);
  },

  // Export leads (admin only)
  exportLeads: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/leads/export?${queryString}` : '/leads/export';
    return apiRequest(endpoint);
  },
};

// Site Settings API
export const settingsAPI = {
  // Get public site settings
  getSettings: async () => {
    return apiRequest('/settings');
  },

  // Get all site settings (admin only)
  getAdminSettings: async () => {
    return apiRequest('/settings/admin');
  },

  // Update site settings (admin only)
  updateSettings: async (settingsData) => {
    return apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  },

  // Update company information (admin only)
  updateCompanyInfo: async (companyData) => {
    return apiRequest('/settings/company', {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  },
};

// Error handling utility
export const handleApiError = (error) => {
  if (error.message === 'Invalid or expired token') {
    // Clear local storage and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return error.message || 'An unexpected error occurred';
};

// Project management utilities
export const projectUtils = {
  // Transform backend project data to frontend format
  transformProject: (backendProject) => {
    return {
      id: backendProject._id,
      title: backendProject.title,
      location: backendProject.location,
      status: backendProject.status,
      progress: backendProject.progress || 0,
      images: backendProject.images || [],
      brochure: backendProject.brochure,
      price: backendProject.price,
      description: backendProject.description,
      amenities: backendProject.amenities || [],
      timeline: backendProject.timeline,
      featured: backendProject.featured,
      createdAt: backendProject.createdAt,
      updatedAt: backendProject.updatedAt,
      // Additional fields from backend
      type: backendProject.type,
      developer: backendProject.developer,
      totalUnits: backendProject.totalUnits,
      availableUnits: backendProject.availableUnits,
      specifications: backendProject.specifications,
      floorPlans: backendProject.floorPlans,
      virtualTour: backendProject.virtualTour,
      gallery: backendProject.gallery,
      nearbyFacilities: backendProject.nearbyFacilities,
      legalApprovals: backendProject.legalApprovals,
      paymentPlans: backendProject.paymentPlans,
      contactInfo: backendProject.contactInfo,
    };
  },

  // Transform frontend project data to backend format
  transformProjectForBackend: (frontendProject) => {
    const backendProject = { ...frontendProject };

    // Remove frontend-specific fields
    delete backendProject.id;

    return backendProject;
  },

  // Get project status color
  getStatusColor: (status) => {
    const statusColors = {
      'planning': '#f59e0b',
      'under-construction': '#3b82f6',
      'completed': '#10b981',
      'on-hold': '#ef4444',
      'upcoming': '#8b5cf6',
    };
    return statusColors[status] || '#6b7280';
  },

  // Format price for display
  formatPrice: (price) => {
    if (!price) return 'Price on request';

    if (typeof price === 'object') {
      const { min, max, currency = '₹' } = price;
      if (min && max) {
        return `${currency}${(min / 100000).toFixed(1)}L - ${currency}${(max / 100000).toFixed(1)}L`;
      }
      if (min) {
        return `Starting from ${currency}${(min / 100000).toFixed(1)}L`;
      }
    }

    if (typeof price === 'number') {
      return `₹${(price / 100000).toFixed(1)}L`;
    }

    return price;
  },

  // Calculate completion percentage
  calculateProgress: (timeline) => {
    if (!timeline || !timeline.phases) return 0;

    const completedPhases = timeline.phases.filter(phase => phase.status === 'completed').length;
    const totalPhases = timeline.phases.length;

    return totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;
  },
};

// Utility to get image URL from string or object
export const getImageUrl = (image) => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  if (image.url) return image.url;
  return '';
};

export default {
  authAPI,
  projectsAPI,
  leadsAPI,
  handleApiError,
  projectUtils,
};
