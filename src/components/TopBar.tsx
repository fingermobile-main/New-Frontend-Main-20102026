import React, {} from 'react';


interface TopBarProps {
  title?: string;
  showBackButton?: boolean;
  actions?: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({ 
  title = 'FingerMobile', 
  showBackButton = false,
  actions 
}) => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            {showBackButton && (
              <button 
                onClick={goBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ←
              </button>
            )}
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;