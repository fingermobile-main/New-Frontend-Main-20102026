import api from './api';

export interface User {
  id: string;
  email: string;
  username?: string;
  mustChangePassword?: boolean; // Optional field as per audit requirement
  // Add other user properties as needed
}

// Update the LoginCredentials interface to include phone
interface LoginCredentials {
  email: string;
  phone: string; // Add phone field
  password: string;
}

interface ChangePasswordCredentials {
  currentPassword: string;
  newPassword: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  message?: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

// Update the login function signature to accept LoginCredentials which includes phone
const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // Send the credentials object (containing email, phone, password) to the backend
    const response = await api.post('/auth/login', credentials); // Matches backend /api/auth/login
    const { user, token } = response.data.data;

    if (token) {
      localStorage.setItem('token', token);
    }

    // Store the mustChangePassword flag
    if (user.mustChangePassword) {
      localStorage.setItem('mustChangePassword', 'true');
    } else {
      localStorage.removeItem('mustChangePassword');
    }

    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An unexpected error occurred during login.',
    };
  }
};

// NEW: Function to change password for an authenticated user
const changePassword = async (credentials: ChangePasswordCredentials): Promise<ChangePasswordResponse> => {
  try {
    // Assumes a backend endpoint like PUT /api/auth/change-password
    const response = await api.put('/auth/change-password', credentials);
    
    if (response.data.success) {
      // On successful password change, clear the flag
      clearMustChangePasswordFlag();
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Change password error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An unexpected error occurred while changing the password.',
    };
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('mustChangePassword');
};

const getCurrentUser = (): User | null => {
  const token = localStorage.getItem('token');
  // In a real app, you might decode the JWT token or make a call to /auth/me
  // For now, we'll just return the stored flag state along with a basic object
  if (token) {
    const mustChangePassword = localStorage.getItem('mustChangePassword') === 'true';
    // This is a simplified representation; ideally, you'd have the full user object from login or a /me call
    return { id: 'unknown', email: 'unknown', mustChangePassword } as User;
  }
  return null;
};

const mustChangePassword = (): boolean => {
  return localStorage.getItem('mustChangePassword') === 'true';
};

const clearMustChangePasswordFlag = () => {
  localStorage.removeItem('mustChangePassword');
};

export default {
  login,
  changePassword, // Export the new function
  logout,
  getCurrentUser,
  mustChangePassword,
  clearMustChangePasswordFlag,
};