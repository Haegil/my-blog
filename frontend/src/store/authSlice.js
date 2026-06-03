import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  try {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

const initialUser = getInitialUser();

const initialState = {
  isAuthenticated: !!initialUser,
  user: initialUser,
  loading: true,
  authReady: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.authReady = true;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.authReady = true;
      state.error = null;
      localStorage.removeItem('user');
    },
    authCheckStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authCheckComplete: (state, action) => {
      const user = action.payload || null;
      state.isAuthenticated = !!user;
      state.user = user;
      state.loading = false;
      state.authReady = true;
      state.error = null;

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  authCheckStart,
  authCheckComplete,
  clearError
} = authSlice.actions;
export default authSlice.reducer;
