import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '../types/user';
import UserService from '../services/UserService';  // Corrected import path

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthAction {
  type: string;
  payload?: any;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

/* eslint-disable no-unused-vars */
const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: { email: string; username: string; password: string }) => Promise<boolean>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<boolean>;
    }>({
      /* eslint-enable no-unused-vars */
      state: initialState,
      dispatch: () => {},
      login: async () => false,
      register: async () => false,
      logout: () => {},
      getCurrentUser: async () => {},
      updateProfile: async () => false,
    });

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
  case 'LOGIN_START':
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  case 'LOGIN_SUCCESS':
    return {
      ...state,
      user: action.payload.user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
  case 'LOGIN_FAILURE':
    return {
      ...state,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: action.payload.error,
    };
  case 'REGISTER_START':
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  case 'REGISTER_SUCCESS':
    return {
      ...state,
      user: action.payload.user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
  case 'REGISTER_FAILURE':
    return {
      ...state,
      isLoading: false,
      error: action.payload.error,
    };
  case 'LOGOUT':
    return {
      ...state,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  case 'SET_USER':
    return {
      ...state,
      user: action.payload.user,
      isAuthenticated: !!action.payload.user,
      isLoading: false,
      error: null,
    };
  case 'SET_ERROR':
    return {
      ...state,
      error: action.payload.error,
    };
  case 'CLEAR_ERROR':
    return {
      ...state,
      error: null,
    };
  default:
    return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (username: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const result = await UserService.login({ username, password });

      if (result.success && result.data) {
        const { user, accessToken, refreshToken } = result.data;

        // Extract user data properly
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          avatar: user.avatar,
          coverImage: user.coverImage,
          role: user.role,
          isVerified: user.isVerified,
          isOnline: user.isOnline,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastSeenAt: user.lastSeenAt,
          followersCount: user.followersCount,
          followingCount: user.followingCount,
          postsCount: user.postsCount,
          badges: user.badges,
          location: user.location,
          website: user.website,
          birthDate: user.birthDate,
          privacySettings: user.privacySettings,
          notificationSettings: user.notificationSettings,
        };

        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: userData },
        });

        return true;
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: { error: result.error || 'Login failed' },
        });
        return false;
      }
    } catch (error: any) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: { error: error.message || 'An unexpected error occurred' },
      });
      return false;
    }
  };

  const register = async (userData: { email: string; username: string; password: string }) => {
    dispatch({ type: 'REGISTER_START' });

    try {
      const result = await UserService.register(userData);

      if (result.success && result.data) {
        // For registration, the API only returns the user object, not tokens
        // We'll need to login after registration to get tokens
        const loginResult = await UserService.login({
          username: userData.username,
          password: userData.password
        });

        if (loginResult.success && loginResult.data) {
          const { user, accessToken, refreshToken } = loginResult.data;

          // Store tokens in localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          dispatch({
            type: 'REGISTER_SUCCESS',
            payload: { user }
          });
          return true;
        } else {
          dispatch({
            type: 'REGISTER_FAILURE',
            payload: { error: loginResult.error || 'Login after registration failed' }
          });
          return false;
        }
      } else {
        dispatch({
          type: 'REGISTER_FAILURE',
          payload: { error: result.error || 'Registration failed' }
        });
        return false;
      }
    } catch (error: any) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: { error: error.message || 'An unexpected error occurred' },
      });
      return false;
    }
  };

  const logout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('fingermobile_token');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    dispatch({ type: 'LOGOUT' });
  };

  const getCurrentUser = async () => {
    try {
      const result = await UserService.getCurrentUser();

      if (result.success && result.data) {
        dispatch({
          type: 'SET_USER',
          payload: { user: result.data },
        });
      } else {
        // If getting user fails, clear auth state
        logout();
      }
    } catch (error) {
      // If getting user fails, clear auth state
      logout();
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      const result = await UserService.updateUserProfile(profileData);

      if (result.success && result.data) {
        dispatch({
          type: 'SET_USER',
          payload: { user: result.data },
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('fingermobile_token') || localStorage.getItem('token');

    if (accessToken) {
      getCurrentUser();
    } else {
      // If no token, set loading to false
      dispatch({ type: 'SET_USER', payload: { user: null } });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        login,
        register,
        logout,
        getCurrentUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    ...context,
    user: context.state.user,
    member: context.state.user, // Alias member to user
    isAuthenticated: context.state.isAuthenticated,
    isLoading: context.state.isLoading,
  };
};

// Export default for the provider component
export default AuthProvider;
