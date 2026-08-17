// This file is kept for backward compatibility but now defines the main AppContextType
import * as T from '../types';
// Removed import of './context' as the file doesn't exist

// Define AppContextType interface
export interface AppContextType {
  user: T.User | null;
  setUser: (user: T.User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  currentModal: string | null;
  setCurrentModal: (modal: string | null) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  // Add other context properties as needed
}

// Export C as an empty object since the context file doesn't exist
export const C = {};