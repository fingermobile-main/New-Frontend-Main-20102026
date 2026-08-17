import React, {} from 'react';

interface ContextMenuProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ContextMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

interface ContextMenuContentProps {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
}

interface ContextMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  inset?: boolean;
}

const ContextMenu = ({ children, open, onOpenChange }: ContextMenuProps) => {
  // This is a simplified implementation since we can't easily implement true context menu behavior in a static component
  // In a real implementation, we would handle right-click events to control the open state
  return (
    <div className="relative inline-block">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && (child.type as any).name === 'ContextMenuTrigger') {
          return React.cloneElement(child as React.ReactElement<any>, { onOpenChange });
        }
        if (React.isValidElement(child) && (child.type as any).name === 'ContextMenuContent') {
          return open ? React.cloneElement(child as React.ReactElement<any>, { open }) : null;
        }
        return child;
      })}
    </div>
  );
};

const ContextMenuTrigger: React.FC<ContextMenuTriggerProps> = ({ children, className = '', onOpenChange }) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenChange) {
      onOpenChange(true);
    }
  };

  return (
    <div 
      className={className}
      onContextMenu={handleContextMenu}
    >
      {children}
    </div>
  );
};

const ContextMenuContent: React.FC<ContextMenuContentProps> = ({ children, className = '', open }) => {
  return (
    <div
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out ${className}`}
    >
      {children}
    </div>
  );
};

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ 
  children, 
  onClick, 
  className = '', 
  inset = false 
}) => {
  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
        inset ? 'pl-8' : ''
      } ${className}`}
      onClick={onClick} role="button" tabIndex={0}
    >
      {children}
    </div>
  );
};

interface ContextMenuComponent extends React.FC<ContextMenuProps> {
  Trigger: React.FC<ContextMenuTriggerProps>;
  Content: React.FC<ContextMenuContentProps>;
  Item: React.FC<ContextMenuItemProps>;
}

const TypedContextMenu = ContextMenu as ContextMenuComponent;
TypedContextMenu.Trigger = ContextMenuTrigger;
TypedContextMenu.Content = ContextMenuContent;
TypedContextMenu.Item = ContextMenuItem;

export { TypedContextMenu as ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem };