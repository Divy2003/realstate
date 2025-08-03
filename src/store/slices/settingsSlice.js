import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { settingsAPI, handleApiError } from '../../services/api';

// Async thunks for settings operations
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.getSettings();
      return response.data.settings;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchAdminSettings = createAsyncThunk(
  'settings/fetchAdminSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.getAdminSettings();
      return response.data.settings;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.updateSettings(settingsData);
      return response.data.settings;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateCompanyInfo = createAsyncThunk(
  'settings/updateCompanyInfo',
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.updateCompanyInfo(companyData);
      return response.data.company;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const initialState = {
  settings: {
    company: {
      name: 'Real Estate Company',
      tagline: 'Your Dream Home Awaits',
      description: '',
      logo: { url: '', publicId: '' },
      favicon: { url: '', publicId: '' }
    },
    contact: {
      phone: {
        primary: '',
        secondary: '',
        whatsapp: ''
      },
      email: {
        primary: '',
        support: '',
        sales: ''
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      },
      coordinates: {
        latitude: null,
        longitude: null
      }
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
      pinterest: ''
    },
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '15:00', closed: false },
      sunday: { open: '10:00', close: '14:00', closed: true }
    },
    theme: {
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      accentColor: '#28a745',
      fontFamily: 'Inter, sans-serif'
    }
  },
  isLoading: false,
  isUpdating: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateLocalSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = { ...state.settings, ...action.payload };
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Admin Settings
      .addCase(fetchAdminSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload;
      })
      .addCase(fetchAdminSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Settings
      .addCase(updateSettings.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // Update Company Info
      .addCase(updateCompanyInfo.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCompanyInfo.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.settings.company = action.payload;
      })
      .addCase(updateCompanyInfo.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, updateLocalSettings } = settingsSlice.actions;

// Selectors
export const selectSettings = (state) => state.settings.settings;
export const selectCompanyInfo = (state) => state.settings.settings.company;
export const selectContactInfo = (state) => state.settings.settings.contact;
export const selectSocialMedia = (state) => state.settings.settings.socialMedia;
export const selectBusinessHours = (state) => state.settings.settings.businessHours;
export const selectTheme = (state) => state.settings.settings.theme;
export const selectSettingsLoading = (state) => state.settings.isLoading;
export const selectSettingsUpdating = (state) => state.settings.isUpdating;
export const selectSettingsError = (state) => state.settings.error;

export default settingsSlice.reducer;
