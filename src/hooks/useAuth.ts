import React from 'react';
// useAuth Hook - Stub
export const useAuth = () => {
  return {user: null,
    isAuthenticated: false,
    login: async () => {},
    logout: () => {}
  };
};
