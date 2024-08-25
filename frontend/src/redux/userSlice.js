import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null,
    isFirstLogin: null,
    currentUser: null, // Add currentUser to the state
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userId = action.payload.userId;
      state.isFirstLogin = action.payload.isFirstLogin;
      state.currentUser = action.payload.currentUser; // Store currentUser
    },
    clearUserInfo: (state) => {
      state.userId = null;
      state.isFirstLogin = false;
      state.currentUser = null; // Clear currentUser
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
