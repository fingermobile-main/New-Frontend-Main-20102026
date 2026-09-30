import React, {} from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
        </div>
        {actionText && onAction && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={onAction}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {actionText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
