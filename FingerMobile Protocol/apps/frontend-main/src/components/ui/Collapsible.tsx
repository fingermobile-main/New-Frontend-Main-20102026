import React, { useState } from 'react';
interface CollapsibleProps {
  children: React.ReactNode;
  className?: string;
}

interface CollapsibleTriggerProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  toggle?: () => void;
}

interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
}

const Collapsible = ({ children, className = '' }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // We'll pass the isOpen state and toggle function down to child components
  const cloneChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement, {
        isOpen,
        toggle: () => setIsOpen(!isOpen)
      });
    }
    return child;
  });

  return (
    <div className={className}>
      {cloneChildren}
    </div>
  );
};

const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({
  children,
  className = '',
  isOpen,
  toggle
}) => {
  const cloneTrigger = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement, {
      onClick: toggle,
      'aria-expanded': isOpen
    })
    : children;

  return (
    <div className={className}>
      {cloneTrigger}
    </div>
  );
};

const CollapsibleContent: React.FC<CollapsibleContentProps> = ({
  children,
  className = '',
  isOpen
}) => {
  if (!isOpen) return null;

  return (
    <div className={className}>
      {children}
    </div>
  );
};

interface CollapsibleComponent extends React.FC<CollapsibleProps> {
  Trigger: React.FC<CollapsibleTriggerProps>;
  Content: React.FC<CollapsibleContentProps>;
}

const TypedCollapsible = Collapsible as CollapsibleComponent;
TypedCollapsible.Trigger = CollapsibleTrigger;
TypedCollapsible.Content = CollapsibleContent;

export { TypedCollapsible as Collapsible, CollapsibleTrigger, CollapsibleContent };
export default TypedCollapsible;
