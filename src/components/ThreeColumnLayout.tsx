import React, {} from 'react';

interface ColumnLayoutProps {
  leftColumn?: React.ReactNode;
  centerColumn?: React.ReactNode;
  rightColumn?: React.ReactNode;
}

const ThreeColumnLayout: React.FC<ColumnLayoutProps> = ({
  leftColumn,
  centerColumn,
  rightColumn
}) => {
  return (
    <div className="three-column-layout flex w-full min-h-screen bg-gray-50">
      {/* Left Navigation - 20% */}
      {leftColumn && (
        <aside className="left-column w-[20%] p-4 border-r border-gray-200 bg-white sticky top-0 h-screen overflow-y-auto">
          {leftColumn}
        </aside>
      )}

      {/* Center Feed - 55% */}
      <main className="center-column w-[55%] p-4 overflow-y-auto">
        {centerColumn || <div className="text-center text-gray-500 mt-8">No center content</div>}
      </main>

      {/* Right Sidebar - 25% */}
      {rightColumn && (
        <aside className="right-column w-[25%] p-4 border-l border-gray-200 bg-white sticky top-0 h-screen overflow-y-auto">
          {rightColumn}
        </aside>
      )}
    </div>
  );
};

export default ThreeColumnLayout;
