import React from 'react';
import { OrganizedData, OrganizeCategory } from '../../contexts/OrganizeTheseContext';

interface OrganizationVisualizationProps {
  organizedData?: OrganizedData | null;
  onReorganize?: () => void;
}

const OrganizationVisualization: React.FC<OrganizationVisualizationProps> = ({
  organizedData,
  onReorganize
}) => {
  if (!organizedData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 mb-4">No organized data available. Click below to start AI organization.</p>
        {onReorganize && (
          <button
            onClick={onReorganize}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Organize Now
          </button>
        )}
      </div>
    );
  }

  const categoryKeys = Object.keys(organizedData) as Array<keyof OrganizedData>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div>
          <h2 className="text-lg font-semibold text-blue-900">Personal Command Center</h2>
          <p className="text-sm text-blue-700">AI-indexed category matrix of all member resources and privacy signals</p>
        </div>
        {onReorganize && (
          <button
            onClick={onReorganize}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Re-organize
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryKeys.map((key) => {
          const category = organizedData[key] as OrganizeCategory | undefined;
          if (!category) return null;

          return (
            <div key={key} className="bg-white rounded-lg shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800 text-base">{category.title}</h3>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-950 border border-blue-400 font-bold font-bold text-xs rounded-full">
                  {category.count} items
                </span>
              </div>

              {category.items && category.items.length > 0 ? (
                <ul className="space-y-2 text-sm text-gray-600">
                  {category.items.slice(0, 3).map((item) => (
                    <li key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-1.5">
                      <span className="truncate max-w-[200px] font-medium text-gray-700">{item.title}</span>
                      {item.details && <span className="text-xs text-gray-400">{item.details}</span>}
                      {item.date && <span className="text-xs text-gray-400">{item.date}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400 italic">No items found in this section</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrganizationVisualization;
