import React, {} from 'react';
import { FileText, Users, Settings } from 'lucide-react';

interface LegalNavigationProps {
  activePage?: string;
  onPageChange?: (page: string) => void;
}

const LegalNavigation: React.FC<LegalNavigationProps> = ({
  activePage = 'terms',
  onPageChange
}) => {
  const pages = [
    { id: 'terms', label: 'Terms of Service', icon: <FileText className="h-4 w-4" /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <Users className="h-4 w-4" /> },
    { id: 'cookies', label: 'Cookie Policy', icon: <Settings className="h-4 w-4" /> },
    { id: 'dmca', label: 'DMCA', icon: <FileText className="h-4 w-4" /> },
    { id: 'community', label: 'Community Guidelines', icon: <Users className="h-4 w-4" /> }
  ];

  return (
    <nav className="border-b bg-background">
      <div className="flex items-center gap-1 px-4 overflow-x-auto">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onPageChange?.(page.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activePage === page.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {page.icon}
            <span>{page.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default LegalNavigation;
