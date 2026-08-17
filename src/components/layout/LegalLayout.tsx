import React, {} from 'react';

interface LegalLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ children, className }) => {
  return (
    <div className={className || "container mx-auto px-4 py-8"}>
      {children}
    </div>
  );
};

export default LegalLayout;
