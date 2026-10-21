import React, {} from 'react';
// Configuration interface
export interface Config {baseURL: string;
  timeout: number;
  retries: number;
}

// Response wrapper interface
export interface ApiResponse<T> {success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Security response wrapper
export type SecurityApiResponse<T> = ApiResponse<T>

// Member registration data interface
export interface MemberRegistrationData {name: string;
  email: string;
  password: string;
  membername: string;
}

// Member login data interface
export interface MemberLoginData {email: string;
  password: string;
}

// Member profile update data interface
export interface MemberProfileUpdateData {
  name?: string;
  email?: string;
  profile_picture_url?: string;
}

// Password reset request data interface
export interface PasswordResetRequestData {email: string;
}

// Password reset data interface
export interface PasswordResetData {token: string;
  newPassword: string;
}

// Empty export to prevent isolated modules error
export {};
