import React, {} from 'react';

interface PageTemplateProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ title, children, className }) => {
  return (
    <div className={className || "container mx-auto px-4 py-8"}>
      {title && <h1 className="text-3xl font-bold mb-6">{title}</h1>}
      {children}
    </div>
  );
};

export default PageTemplate;
