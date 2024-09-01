import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    authFailure: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.error = 'Authentication failed';
    },
  },
});

export const { loginSuccess, logout, setLoading, setError, authFailure } = authSlice.actions;

export default authSlice.reducer;
