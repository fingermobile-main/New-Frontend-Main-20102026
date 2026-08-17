import React, {} from 'react';

interface HoverCardProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface HoverCardContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  open?: boolean;
}

interface HoverCardTriggerProps {
  children: React.ReactNode;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

const HoverCard = ({ children, open, onOpenChange }: HoverCardProps) => {
  // This is a simplified implementation since we can't easily implement true hover behavior in a static component
  // In a real implementation, we would handle mouse events to control the open state
  return (
    <div className="relative inline-block">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && (child.type as any).name === 'HoverCardTrigger') {
          return React.cloneElement(child as React.ReactElement<any>, { onOpenChange });
        }
        if (React.isValidElement(child) && (child.type as any).name === 'HoverCardContent') {
          return open ? React.cloneElement(child as React.ReactElement<any>, { open }) : null;
        }
        return child;
      })}
    </div>
  );
};

const HoverCardContent: React.FC<HoverCardContentProps> = ({ 
  children, 
  className = '',
  align = 'center',
  open
}) => {
  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0'
  };

  return (
    <div
      className={`absolute z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none ${alignmentClasses[align]} top-full mt-2 ${className}`}
    >
      {children}
    </div>
  );
};

const HoverCardTrigger: React.FC<HoverCardTriggerProps> = ({ children, className = '', onOpenChange }) => {
  return (
    <div 
      className={className}
      onMouseEnter={() => onOpenChange && onOpenChange(true)}
      onMouseLeave={() => onOpenChange && onOpenChange(false)}
    >
      {children}
    </div>
  );
};

interface HoverCardComponent extends React.FC<HoverCardProps> {
  Content: React.FC<HoverCardContentProps>;
  Trigger: React.FC<HoverCardTriggerProps>;
}

const TypedHoverCard = HoverCard as HoverCardComponent;
TypedHoverCard.Content = HoverCardContent;
TypedHoverCard.Trigger = HoverCardTrigger;

export { TypedHoverCard as HoverCard, HoverCardContent, HoverCardTrigger };