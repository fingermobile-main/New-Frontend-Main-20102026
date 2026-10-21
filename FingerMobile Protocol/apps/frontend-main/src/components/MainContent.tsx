import React, {} from 'react';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

const MainContent: React.FC<MainContentProps> = ({
  children,
  className = ''
}) => {
  return (
    <main className={`flex-1 overflow-y-auto ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
