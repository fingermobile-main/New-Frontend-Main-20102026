import React, { useState } from 'react';

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ children, defaultValue, value, onValueChange, className = '' }) => {
  const [internalTab, setInternalTab] = useState(defaultValue || '');
  const activeTab = value !== undefined ? value : internalTab;

  const handleTabChange = (val: string) => {
    setInternalTab(val);
    if (onValueChange) {
      onValueChange(val);
    }
  };

  const triggers = React.Children.toArray(children).filter(
    child => (child as React.ReactElement).type === TabsTrigger
  );

  const contents = React.Children.toArray(children).filter(
    child => (child as React.ReactElement).type === TabsContent
  );

  const validTriggers = triggers.filter(trigger =>
    (trigger as React.ReactElement<{ value: string }>).props.value === activeTab
  );

  const validContents = contents.filter(content =>
    (content as React.ReactElement<{ value: string }>).props.value === activeTab
  );

  return (
    <div className={className}>
      <div className="flex border-b">
        {triggers.map((trigger, index) => {
          const triggerElement = trigger as React.ReactElement<TabsTriggerProps>;
          const isActive = triggerElement.props.value === activeTab;

          return (
            <button
              key={index}
              className={`py-2 px-4 font-medium text-sm border-b-2 -mb-px ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => handleTabChange(triggerElement.props.value)}
            >
              {triggerElement.props.children}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        {validContents}
      </div>
    </div>
  );
};

const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex border-b ${className}`}>
      {children}
    </div>
  );
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, value, className = '' }) => {
  return null; // This component is only used for data extraction in Tabs
};

const TabsContent: React.FC<TabsContentProps> = ({ children, value, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
