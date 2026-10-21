import React, {} from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight className="h-4 w-4 text-slate-500" />,
  className = ''
}) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-sm ${className}`}>
      <div className="flex items-center">
        <Home className="h-4 w-4 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer" />
      </div>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">{separator}</div>
          <div className="flex items-center">
            {item.href ? (
              <a
                href={item.href}
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                {item.label}
              </a>
            ) : item.onClick ? (
              <button
                onClick={item.onClick}
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-slate-900 font-semibold">{item.label}</span>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
