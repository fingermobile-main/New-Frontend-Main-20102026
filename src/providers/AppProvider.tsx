import React, { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};
