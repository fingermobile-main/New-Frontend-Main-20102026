import React, { createContext, useContext, ReactNode } from 'react';

type ToastContextType = Record<string, unknown>; // Replaced empty interface

const ToastContext = createContext<ToastContextType>({});

export const useToast = () => {
  return useContext(ToastContext);
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <ToastContext.Provider value={{}}>
      {children}
    </ToastContext.Provider>
  );
};
