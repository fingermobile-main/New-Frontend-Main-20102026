import React, {} from 'react';

interface SheetProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

interface SheetContentProps {
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface SheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface SheetDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface SheetCloseProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Sheet = ({ children, open, onOpenChange }: SheetProps) => {
  // This passes the open state and toggle function down to child components
  const cloneChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      if ((child.type as any).name === 'SheetContent') {
        return React.cloneElement(child as React.ReactElement, { 
          open,
          onOpenChange
        });
      }
      if ((child.type as any).name === 'SheetTrigger') {
        return React.cloneElement(child as React.ReactElement, { 
          onOpenChange
        });
      }
    }
    return child;
  });

  return <>{cloneChildren}</>;
};

const SheetTrigger: React.FC<{ children: React.ReactNode; onOpenChange?: (open: boolean) => void }> = ({ 
  children, 
  onOpenChange 
}) => {
  const cloneChild = React.isValidElement(children) 
    ? React.cloneElement(children as React.ReactElement, { 
        onClick: (e: React.MouseEvent) => {
          onOpenChange && onOpenChange(true);
          if ((children as React.ReactElement).props.onClick) {
            (children as React.ReactElement).props.onClick(e);
          }
        }
      })
    : children;

  return <>{cloneChild}</>;
};

const SheetContent: React.FC<SheetContentProps> = ({ 
  children, 
  side = 'right', 
  className = '',
  open,
  onOpenChange
}) => {
  if (!open) return null;

  const sideClasses = {
    top: 'inset-x-0 top-0 border-b',
    right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
    bottom: 'inset-x-0 bottom-0 border-t',
    left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex"
      onClick={(e) => {
        e.stopPropagation();
        if (onOpenChange) {
          onOpenChange(false);
        }
      }}
      role="button" tabIndex={0}
    >
      <div className="fixed inset-0 z-50 bg-black/50" />
      <div 
        className={`fixed z-50 bg-background ${sideClasses[side]} ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="button" tabIndex={0}
      >
        <div className="h-full overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const SheetHeader: React.FC<SheetHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
};

const SheetTitle: React.FC<SheetTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 
      className={`text-lg font-semibold text-foreground ${className}`}
      id="sheet-title"
    >
      {children}
    </h2>
  );
};

const SheetDescription: React.FC<SheetDescriptionProps> = ({ children, className = '' }) => {
  return (
    <p 
      className={`text-sm text-muted-foreground ${className}`}
      id="sheet-description"
    >
      {children}
    </p>
  );
};

const SheetClose: React.FC<SheetCloseProps> = ({ children, onClick, className = '' }) => {
  return (
    <button
      type="button"
      className={`flex h-8 w-8 items-center justify-center rounded-md text-foreground/50 transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none ${className}`}
      onClick={(e) => {
        onClick?.();
        // Find parent sheet and close it
        const sheet = (e.target as HTMLElement).closest('[data-sheet]');
        if (sheet) {
          // Close the sheet by calling the onOpenChange prop
        }
      }}
    >
      {children}
    </button>
  );
};

interface SheetComponent extends React.FC<SheetProps> {
  Content: React.FC<SheetContentProps>;
  Header: React.FC<SheetHeaderProps>;
  Title: React.FC<SheetTitleProps>;
  Description: React.FC<SheetDescriptionProps>;
  Close: React.FC<SheetCloseProps>;
  Trigger: React.FC<{ children: React.ReactNode; onOpenChange?: (open: boolean) => void }>;
}

const TypedSheet = Sheet as SheetComponent;
TypedSheet.Content = SheetContent;
TypedSheet.Header = SheetHeader;
TypedSheet.Title = SheetTitle;
TypedSheet.Description = SheetDescription;
TypedSheet.Close = SheetClose;
TypedSheet.Trigger = SheetTrigger;

export { TypedSheet as Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose };
export default TypedSheet;