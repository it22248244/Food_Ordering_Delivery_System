import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/config';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error.message || 'Failed to login');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signup', userData);
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue(error.message || 'Failed to register');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/me');
      return response.data.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return rejectWithValue(error.message || 'Failed to fetch user data');
    }
  }
);



// New password update thunk
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.patch('/users/updatePassword', passwordData);
      return response.data;
    } catch (error) {
      console.error('Password update error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to update password. Please try again.'
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: localStorage.getItem('token') ? true : false,
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    error: null,
    passwordUpdateStatus: 'idle',
    passwordUpdateError: null
  },
  reducers: {
    // Logout action
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
    },
    // Clear error action
    clearError: (state) => {
      state.error = null;
    },
    // Update profile
    updateProfile: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearPasswordUpdateError: (state) => {
      state.passwordUpdateError = null;
      state.passwordUpdateStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.data.user;
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.data.user;
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordUpdateStatus = 'loading';
        state.passwordUpdateError = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        state.passwordUpdateStatus = 'succeeded';
        state.passwordUpdateError = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        state.passwordUpdateStatus = 'failed';
        state.passwordUpdateError = action.payload;
      });
    
  }
});

export const { logout, clearError, updateProfile } = authSlice.actions;

export default authSlice.reducer;