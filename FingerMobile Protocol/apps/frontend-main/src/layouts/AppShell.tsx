import React from 'react';
import ForumLayout from './ForumLayout';
import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <ForumLayout>
      {children}
    </ForumLayout>
  );
};

export default AppShell;
