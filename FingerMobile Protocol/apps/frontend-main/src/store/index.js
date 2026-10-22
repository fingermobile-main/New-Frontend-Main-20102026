// Main Redux Store Configuration
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Import reducers
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import postsReducer from './slices/postsSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';

// Combine reducers
const rootReducer = combineReducers({auth: authReducer,
  user: userReducer,
  posts: postsReducer,
  notifications: notificationsReducer,
  ui: uiReducer
});

// Configure store
const store = configureStore({reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;

// Export types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
