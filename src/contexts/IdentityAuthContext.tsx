import React, { useEffect, createContext, useContext, useReducer } from 'react';
import { Member, Preferences as UserPreferences } from '../types';

interface AuthState {
  currentUser: Member | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  verificationStatus: {
    email: boolean;
    phone: boolean;
    identity: boolean;
  };
}

// Action Types
type AuthAction =
  | { type: 'SET_USER'; payload: Member | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'UPDATE_VERIFICATION_STATUS'; payload: Partial<AuthState['verificationStatus']> }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  verificationStatus: {
    email: false,
    phone: false,
    identity: false
  }
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'UPDATE_PREFERENCES':
      if (!state.currentUser) return state;
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          preferences: {
            ...state.currentUser.preferences,
            ...action.payload
          }
        }
      };
    case 'UPDATE_VERIFICATION_STATUS':
      return {
        ...state,
        verificationStatus: {
          ...state.verificationStatus,
          ...action.payload
        }
      };
    case 'LOGOUT':
      return {
        ...initialState,
        verificationStatus: {
          email: false,
          phone: false,
          identity: false
        }
      };
    default:
      return state;
  }
};

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  username?: string;
}

interface AuthContextType extends AuthState {
  register: (userData: RegisterPayload) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  setUsername: (username: string) => Promise<void>;
  switchAccount: (accountId: string) => Promise<void>;
  updateVerificationStatus: (status: Partial<AuthState['verificationStatus']>) => void;
}

const IdentityAuthContext = createContext<AuthContextType | undefined>(undefined);

export const useIdentityAuth = (): AuthContextType => {
  const context = useContext(IdentityAuthContext);
  if (!context) {
    throw new Error('useIdentityAuth must be used within an IdentityAuthProvider');
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export const IdentityAuthProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const fetchCurrentUser = async (): Promise<Member> => {
    // Mock implementation - in a real app, this would fetch from your backend
    return {
      id: 'user-123',
      name: 'Demo User',
      email: 'user@example.com',
      username: 'demo_user',
      firstName: 'Demo',
      lastName: 'User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      role: 'user',
      permissions: ['read', 'write'],
      preferences: {
        notifications: true,
        privacy: 'public'
      }
    };
  };

  // Initialize from localStorage or cookies
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
          const user = await fetchCurrentUser();
          dispatch({ type: 'SET_USER', payload: user });
        } catch {
          dispatch({ type: 'SET_ERROR', payload: 'Token verification failed' });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    initAuth();
  }, []);

  const register = async (userData: RegisterPayload) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();
      
      dispatch({ type: 'SET_USER', payload: result.user });
      localStorage.setItem('accessToken', result.accessToken);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      dispatch({ type: 'SET_USER', payload: result.user });
      localStorage.setItem('accessToken', result.accessToken);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    dispatch({ type: 'LOGOUT' });
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`/api/auth/verify-email/${token}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        dispatch({
          type: 'UPDATE_VERIFICATION_STATUS',
          payload: { email: true }
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Email verification failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    if (!state.currentUser) return;
    
    dispatch({ 
      type: 'UPDATE_PREFERENCES', 
      payload: prefs
    });
  };

  const setUsername = async (username: string) => {
    if (!state.currentUser) return;

    try {
      const response = await fetch(`/api/users/${state.currentUser.id}/username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ username })
      });

      if (response.ok) {
        const updatedUser = { ...state.currentUser, username };
        dispatch({ type: 'SET_USER', payload: updatedUser });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update username';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const switchAccount = async (accountId: string) => {
    if (!state.currentUser) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch('/api/auth/switch-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ targetAccountId: accountId })
      });

      if (response.ok) {
        const result = await response.json();
        dispatch({ type: 'SET_USER', payload: result.user });
        localStorage.setItem('accessToken', result.accessToken);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch account';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateVerificationStatus = (status: Partial<AuthState['verificationStatus']>) => {
    dispatch({ type: 'UPDATE_VERIFICATION_STATUS', payload: status });
  };

  const value: AuthContextType = {
    ...state,
    register,
    login,
    logout,
    verifyEmail,
    updatePreferences,
    setUsername,
    switchAccount,
    updateVerificationStatus
  };

  return (
    <IdentityAuthContext.Provider value={value}>
      {children}
    </IdentityAuthContext.Provider>
  );
};

export default IdentityAuthProvider;