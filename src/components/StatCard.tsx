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
    <div className={`bg-white rounded-xl shadow-xs p-4 border border-slate-300 border-l-4 border-l-${color}-500`}>
      <div className="flex items-center">
        {icon && <div className={`${iconColor} mr-3`}>{renderIcon()}</div>}
        <div>
          <p className="text-slate-700 text-xs font-bold uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline mt-1">
            <h3 className="text-2xl font-black text-slate-900">{value}</h3>
            {subtitle && <span className="ml-2 text-xs font-semibold text-slate-600">{subtitle}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
