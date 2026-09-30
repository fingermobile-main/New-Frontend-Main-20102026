// Main Redux Store Configuration
import { configureStore } from '@reduxjs/toolkit';

// Import reducers - only import existing slices
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

// Define state types manually since slices are JS files
export type AuthState = {user: any; token: string | null; isAuthenticated: boolean; loading: boolean; error: string | null;
};

export type UiState = any; // Define appropriately based on your ui slice

// Other state types that are referenced in the original code
export type UserState = any;
export type PostsState = any;
export type NotificationState = any;

// Configure store
const store = configureStore({reducer: { auth: authReducer, ui: uiReducer
  // Add placeholders for non-existent reducers or remove them if not needed
  //, user: userReducer
  //, notifications: notificationsReducer
},
middleware: (getDefaultMiddleware: any) => getDefaultMiddleware(),
devTools: process.env.NODE_ENV !== 'production'
});

export default store;

// Export types for use in components
export type RootState = {auth: AuthState; ui: UiState;
  // Add the other state types if needed in your application
  //, user: UserState;
  //, posts: PostsState;
  //, notifications: NotificationState;
};

export type AppDispatch = typeof store.dispatch;
