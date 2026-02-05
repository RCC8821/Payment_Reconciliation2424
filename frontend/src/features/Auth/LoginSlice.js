


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunk for Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.error || 'Invalid email or password');
      }

      // Backend response से values ले रहे हैं (latest API के हिसाब से)
      const token = data.token;
      const userType = data.userType || 'user';
      const name = data.name || '';           // ← नया: name आ रहा है backend से
      const emailFromResponse = data.email || email; // fallback

      // sessionStorage में save (tab close पर clear हो जाएगा)
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userType', userType);
      sessionStorage.setItem('userName', name);       // ← name save
      sessionStorage.setItem('userEmail', emailFromResponse);

      return {
        token,
        userType,
        name,                    
        email: emailFromResponse,
      };
    } catch (error) {
      return rejectWithValue('Network error. Please check your connection.');
    }
  }
);

// Initial State – page refresh पर sessionStorage से load
const initialState = {
  token: sessionStorage.getItem('token') || null,
  userType: sessionStorage.getItem('userType') || null,
  userName: sessionStorage.getItem('userName') || null,   // ← नया field
  email: sessionStorage.getItem('userEmail') || null,
  isLoading: false,
  isAuthenticated: !!sessionStorage.getItem('token'),
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
      state.userName = null;       // ← clear name
      state.email = null;
      state.isAuthenticated = false;
      state.error = null;

      // sessionStorage clear
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userType');
      sessionStorage.removeItem('userName');     // ← name remove
      sessionStorage.removeItem('userEmail');
    },

    // Error clear
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
        state.userName = action.payload.name;       // ← state update
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