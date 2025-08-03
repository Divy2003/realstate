import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectsAPI, projectUtils, handleApiError } from '../../services/api';

// Async thunks for project operations
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getProjects(params);
      return {
        projects: response.data.projects.map(projectUtils.transformProject),
        pagination: response.data.pagination,
        total: response.data.total,
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
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
  projects: [],
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
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
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
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.projects;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Single Project
      .addCase(fetchProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
        state.error = null;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isCreating = false;
        state.projects.unshift(action.payload);
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
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
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
        state.projects = state.projects.filter(p => p.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
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
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
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

// Selectors
export const selectProjects = (state) => state.projects.projects;
export const selectCurrentProject = (state) => state.projects.currentProject;
export const selectProjectStats = (state) => state.projects.stats;
export const selectProjectsPagination = (state) => state.projects.pagination;
export const selectProjectsFilters = (state) => state.projects.filters;
export const selectProjectsLoading = (state) => state.projects.isLoading;
export const selectProjectsCreating = (state) => state.projects.isCreating;
export const selectProjectsUpdating = (state) => state.projects.isUpdating;
export const selectProjectsDeleting = (state) => state.projects.isDeleting;
export const selectProjectsError = (state) => state.projects.error;

// Complex selectors
export const selectFeaturedProjects = (state) => 
  state.projects.projects.filter(project => project.featured);

export const selectProjectsByStatus = (status) => (state) =>
  state.projects.projects.filter(project => project.status === status);

export const selectProjectById = (id) => (state) =>
  state.projects.projects.find(project => project.id === id);

export default projectsSlice.reducer;
