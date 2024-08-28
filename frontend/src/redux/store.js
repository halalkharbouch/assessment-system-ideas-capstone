import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer, { clearUserInfo } from './userSlice';
import authReducer, { logout } from './authSlice';
import { combineReducers } from 'redux';

// Define the persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'auth'], // Specify which reducers should be persisted
};

// Combine reducers
const appReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
});

// Root reducer that resets the state on logout
const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    storage.removeItem('persist:root'); // Clear persisted state in local storage
    return appReducer(undefined, action); // Reset the state to its initial values
  }

  return appReducer(state, action);
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer and middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'auth/logout'],
      },
    }),
});

export const persistor = persistStore(store);
