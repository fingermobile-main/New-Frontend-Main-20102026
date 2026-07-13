import React from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const SectionCard = ({ 
  title, 
  subtitle, 
  children, 
  className = ""
}: SectionCardProps) => {
  return (
    <div className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
      {subtitle && <p className="text-gray-600 mt-1 mb-4">{subtitle}</p>}
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};

export default SectionCard;