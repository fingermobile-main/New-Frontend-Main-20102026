import React, { useState } from 'react';

interface ActionMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const ActionMenuItem: React.FC<ActionMenuItemProps> = ({ children, onClick }) => {
  return (
    <div 
      className="px-4 py-2 text-sm hover:bg-accent cursor-pointer"
      onClick={onClick} role="button" tabIndex={0}
    >
      {children}
    </div>
  );
};

interface ActionMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ children, trigger }) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <div className="relative inline-block text-left">
      <div onClick={() => setOpen(!open)} role="button" tabIndex={0}>
        {trigger}
      </div>
      
      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1" role="menu">
            {React.Children.map(children, (child) => 
              React.cloneElement(child as React.ReactElement<any>, { 
                onClick: () => {
                  (child as React.ReactElement<any>).props.onClick?.();
                  setOpen(false);
                } 
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { ActionMenu, ActionMenuItem };