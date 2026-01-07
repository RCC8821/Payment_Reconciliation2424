// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunk for Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Check for error or unsuccessful login
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Invalid email or password');
      }

      // Backend already short/lowercase type bhej raha hai jaise "admin"
      const userType = data.user?.type || 'user';

      // Save to localStorage (page refresh pe login rahe)
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('userType', userType);
      sessionStorage.setItem('userEmail', data.user?.email || email);

      return {
        token: data.token,
        userType,
        email: data.user?.email || email,
      };
    } catch (error) {
      return rejectWithValue('Network error. Please check your connection and try again.');
    }
  }
);

// Initial State – app start hone pe localStorage se load karo
const initialState = {
  token: localStorage.getItem('token') || null,
  userType: localStorage.getItem('userType') || null,
  email: localStorage.getItem('userEmail') || null,
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout action
    logout: (state) => {
      state.token = null;
      state.userType = null;
      state.email = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userEmail');
    },

    // Clear error message (retry ya new login ke liye)
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.userType = action.payload.userType;
        state.email = action.payload.email;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

// Export actions
export const { logout, clearError } = authSlice.actions;

// Export reducer
export default authSlice.reducer;