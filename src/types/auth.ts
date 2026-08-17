import { Member } from './models';

export interface AuthResponse {success: boolean;
  message: string;
  token?: string;
  member?: Member;
  csrfToken?: string;
}

export type LoginResponse = AuthResponse

// Updated LoginResponseExtended to match what the API actually returns
export interface LoginResponseExtended extends LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: {id: string;
  phone: string;
  firstName: string;
  lastName: string;
  onboardingComplete: boolean;
    email?: string;
    avatar?: string;
  };
}

export type RegisterResponse = AuthResponse

// Updated RegisterData to match what the API expects
export interface RegisterData {phone: string;
  password: string;
  firstName: string;
  lastName: string;
  id?: string;
  email?: string;
  username?: string;
  confirmPassword?: string;
  name?: string; // For backward compatibility
  membername?: string; // For tests
}

export interface ChangePasswordData {currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordData {token: string;
  newPassword: string;
}