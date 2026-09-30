import React, {} from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebar,
  header
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {header && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          {header}
        </header>
      )}

      <div className="flex">
        {sidebar && (
          <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
            {sidebar}
          </aside>
        )}

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
