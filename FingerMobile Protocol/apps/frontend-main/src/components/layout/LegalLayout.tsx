import React, {} from 'react';

interface LegalLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ children, className }) => {
  return (
    <div className={className || 'w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
      {children}
    </div>
  );
};

export default LegalLayout;
