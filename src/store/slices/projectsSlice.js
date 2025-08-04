import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectsAPI, projectUtils, handleApiError } from '../../services/api';
import { projects as mockProjects } from '../../data/projectsData';

// Helper function to get mock projects by status
const getMockProjectsByStatus = (status, limit = 12) => {
  let filteredProjects = mockProjects;

  if (status && status !== 'all') {
    filteredProjects = mockProjects.filter(project => project.status === status);
  }

  // Apply limit
  if (limit) {
    filteredProjects = filteredProjects.slice(0, limit);
  }

  return {
    projects: filteredProjects.map(projectUtils.transformProject),
    pagination: {
      page: 1,
      limit: limit || 12,
      total: filteredProjects.length,
      pages: Math.ceil(filteredProjects.length / (limit || 12))
    },
    total: filteredProjects.length,
    status: status || 'all',
    isFromMockData: true
  };
};

// Async thunks for project operations
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      // Check if we already have data for this status to prevent infinite calls
      const state = getState();
      const status = params.status || 'all';
      const existingProjects = state.projects.projectsByStatus[status];

      // If we already have projects for this status and it's not a forced refresh, return existing data
      if (existingProjects && existingProjects.length > 0 && !params.forceRefresh) {
        return {
          projects: existingProjects,
          pagination: state.projects.pagination,
          total: existingProjects.length,
          status: status,
          isFromCache: true
        };
      }

      const response = await projectsAPI.getProjects(params);
      return {
        projects: response.data.projects.map(projectUtils.transformProject),
        pagination: response.data.pagination,
        total: response.data.total,
        status: status,
        isFromAPI: true
      };
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      // Fallback to mock data when API fails
      return getMockProjectsByStatus(params.status, params.limit);
    }
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchProject',
  async (identifier, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getProject(identifier);
      return projectUtils.transformProject(response.data.project);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const backendData = projectUtils.transformProjectForBackend(projectData);
      const response = await projectsAPI.createProject(backendData);
      return projectUtils.transformProject(response.data.project);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const backendData = projectUtils.transformProjectForBackend(projectData);
      const response = await projectsAPI.updateProject(id, backendData);
      return projectUtils.transformProject(response.data.project);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await projectsAPI.deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const toggleProjectFeatured = createAsyncThunk(
  'projects/toggleFeatured',
  async (id, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.toggleFeatured(id);
      return projectUtils.transformProject(response.data.project);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchProjectStats = createAsyncThunk(
  'projects/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getProjectStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const initialState = {
  // Store projects by status
  projectsByStatus: {
    all: [],
    ongoing: [],
    upcoming: [],
    completed: [],
    'under-construction': []
  },
  currentProject: null,
  stats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    status: '',
    type: '',
    location: '',
    search: '',
    featured: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  loading: {
    all: false,
    ongoing: false,
    upcoming: false,
    completed: false,
    'under-construction': false,
    single: false
  },
  // Track which statuses have been fetched to prevent infinite calls
  fetchAttempted: {
    all: false,
    ongoing: false,
    upcoming: false,
    completed: false,
    'under-construction': false
  },
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  usingMockData: false,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state, action) => {
        const status = action.meta.arg?.status || 'all';
        state.loading[status] = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        const status = action.payload.status || 'all';
        state.loading[status] = false;
        state.fetchAttempted[status] = true;

        // Don't update if this is from cache and we already have data
        if (action.payload.isFromCache && state.projectsByStatus[status].length > 0) {
          return;
        }

        state.projectsByStatus[status] = action.payload.projects;

        // If fetching all projects, also populate individual status arrays
        if (status === 'all' || !status) {
          const projects = action.payload.projects;
          // Clear existing arrays and populate from the full list
          state.projectsByStatus.ongoing = projects.filter(p => p.status === 'ongoing' || p.status === 'under-construction');
          state.projectsByStatus.upcoming = projects.filter(p => p.status === 'upcoming');
          state.projectsByStatus.completed = projects.filter(p => p.status === 'completed');
          // Mark all as attempted
          state.fetchAttempted.ongoing = true;
          state.fetchAttempted.upcoming = true;
          state.fetchAttempted.completed = true;
        }

        state.pagination = action.payload.pagination;
        state.usingMockData = action.payload.isFromMockData || false;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        const status = action.meta.arg?.status || 'all';
        state.loading[status] = false;
        state.fetchAttempted[status] = true;
        state.error = action.payload;
      })
      
      // Fetch Single Project
      .addCase(fetchProject.pending, (state) => {
        state.loading.single = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading.single = false;
        state.currentProject = action.payload;
        state.error = null;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading.single = false;
        state.error = action.payload;
      })
      
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isCreating = false;
        const project = action.payload;
        // Add to appropriate status array
        if (state.projectsByStatus[project.status]) {
          state.projectsByStatus[project.status].unshift(project);
        }
        // Also add to 'all' if it exists
        if (state.projectsByStatus.all.length > 0) {
          state.projectsByStatus.all.unshift(project);
        }
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedProject = action.payload;
        
        // Update in all relevant status arrays
        Object.keys(state.projectsByStatus).forEach(status => {
          const index = state.projectsByStatus[status].findIndex(p => p.id === updatedProject.id);
          if (index !== -1) {
            // If status changed, remove from old status and add to new
            if (status !== 'all' && status !== updatedProject.status) {
              state.projectsByStatus[status].splice(index, 1);
            } else {
              state.projectsByStatus[status][index] = updatedProject;
            }
          }
        });
        
        // Add to new status array if not already there
        if (state.projectsByStatus[updatedProject.status]) {
          const exists = state.projectsByStatus[updatedProject.status].some(p => p.id === updatedProject.id);
          if (!exists) {
            state.projectsByStatus[updatedProject.status].unshift(updatedProject);
          }
        }
        
        if (state.currentProject?.id === updatedProject.id) {
          state.currentProject = updatedProject;
        }
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = action.payload;
        
        // Remove from all status arrays
        Object.keys(state.projectsByStatus).forEach(status => {
          state.projectsByStatus[status] = state.projectsByStatus[status].filter(p => p.id !== deletedId);
        });
        
        if (state.currentProject?.id === deletedId) {
          state.currentProject = null;
        }
        state.error = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      })
      
      // Toggle Featured
      .addCase(toggleProjectFeatured.fulfilled, (state, action) => {
        const updatedProject = action.payload;
        
        // Update in all relevant status arrays
        Object.keys(state.projectsByStatus).forEach(status => {
          const index = state.projectsByStatus[status].findIndex(p => p.id === updatedProject.id);
          if (index !== -1) {
            state.projectsByStatus[status][index] = updatedProject;
          }
        });
        
        if (state.currentProject?.id === updatedProject.id) {
          state.currentProject = updatedProject;
        }
      })
      
      // Fetch Stats
      .addCase(fetchProjectStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentProject,
  setFilters,
  resetFilters,
  setPagination,
} = projectsSlice.actions;

// Updated Selectors
export const selectProjects = (state) => {
  // Return combined projects from all status arrays for backward compatibility
  const { ongoing, upcoming, completed } = state.projects.projectsByStatus;
  return [...ongoing, ...upcoming, ...completed];
};
export const selectCurrentProject = (state) => state.projects.currentProject;
export const selectProjectStats = (state) => state.projects.stats;
export const selectProjectsPagination = (state) => state.projects.pagination;
export const selectProjectsFilters = (state) => state.projects.filters;

// Loading selectors
export const selectProjectsLoading = (state) => state.projects.loading.all;
export const selectProjectsLoadingByStatus = (status) => (state) => state.projects.loading[status] || false;

export const selectProjectsCreating = (state) => state.projects.isCreating;
export const selectProjectsUpdating = (state) => state.projects.isUpdating;
export const selectProjectsDeleting = (state) => state.projects.isDeleting;
export const selectProjectsError = (state) => state.projects.error;

// Updated Complex selectors
export const selectFeaturedProjects = (state) => {
  const allProjects = Object.values(state.projects.projectsByStatus).flat();
  return allProjects.filter(project => project.featured);
};

export const selectProjectsByStatus = (status) => (state) => {
  return state.projects.projectsByStatus[status] || [];
};

export const selectProjectById = (id) => (state) => {
  const allProjects = Object.values(state.projects.projectsByStatus).flat();
  return allProjects.find(project => project.id === id);
};

export const selectFetchAttempted = (status) => (state) => {
  return state.projects.fetchAttempted[status] || false;
};

export const selectUsingMockData = (state) => state.projects.usingMockData;

export default projectsSlice.reducer;