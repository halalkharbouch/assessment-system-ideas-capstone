import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null,
    isFirstLogin: null,
    currentUser: null,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userId = action.payload.userId;
      state.isFirstLogin = action.payload.isFirstLogin;
      state.currentUser = action.payload.currentUser;
    },
    clearUserInfo: (state) => {
      state.userId = null;
      state.isFirstLogin = null;
      state.currentUser = null;
    },
    updateCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    userLogout: (state) => {
      state.userId = null;
      state.isFirstLogin = null;
      state.currentUser = null;
    },
  },
});

export const { setUserInfo, clearUserInfo, updateCurrentUser, userLogout } = userSlice.actions;

export default userSlice.reducer;
