import React, {} from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: React.ReactNode | string;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, color = 'blue', icon, iconColor = 'text-blue-500' }) => {
  // Handle string icons (icon names) vs ReactNode
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      // If it's a string, render as text or emoji
      return <span className="text-xl">{icon}</span>;
    }
    return icon;
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 border-${color}-500`}>
      <div className="flex items-center">
        {icon && <div className={`${iconColor} mr-3`}>{renderIcon()}</div>}
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <div className="flex items-baseline">
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            {subtitle && <span className="ml-2 text-sm text-gray-500">{subtitle}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
