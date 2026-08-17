import React, {} from 'react';

interface MenubarProps {
  children: React.ReactNode;
  className?: string;
}

interface MenubarMenuProps {
  children: React.ReactNode;
}

interface MenubarTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface MenubarContentProps {
  children: React.ReactNode;
  className?: string;
}

interface MenubarItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  inset?: boolean;
}

interface MenubarLabelProps {
  children: React.ReactNode;
  className?: string;
}

const Menubar = ({ children, className = '' }: MenubarProps) => {
  return (
    <div 
      role="menubar"
      className={`flex h-10 items-center space-x-1 rounded-md border bg-background p-1 ${className}`}
    >
      {children}
    </div>
  );
};

const MenubarMenu: React.FC<MenubarMenuProps> = ({ children }) => {
  return <>{children}</>;
};

const MenubarTrigger: React.FC<MenubarTriggerProps> = ({ children, className = '' }) => {
  return (
    <button
      className={`flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground ${className}`}
      role="menuitem"
    >
      {children}
    </button>
  );
};

const MenubarContent: React.FC<MenubarContentProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
      role="menu"
    >
      {children}
    </div>
  );
};

const MenubarItem: React.FC<MenubarItemProps> = ({ children, onClick, className = '', inset = false }) => {
  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
        inset ? 'pl-8' : ''
      } ${className}`}
      role="menuitem"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const MenubarLabel: React.FC<MenubarLabelProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`px-2 py-1.5 text-sm font-semibold ${className}`}
      role="presentation"
    >
      {children}
    </div>
  );
};

interface MenubarComponent extends React.FC<MenubarProps> {
  Menu: React.FC<MenubarMenuProps>;
  Trigger: React.FC<MenubarTriggerProps>;
  Content: React.FC<MenubarContentProps>;
  Item: React.FC<MenubarItemProps>;
  Label: React.FC<MenubarLabelProps>;
}

const TypedMenubar = Menubar as MenubarComponent;
TypedMenubar.Menu = MenubarMenu;
TypedMenubar.Trigger = MenubarTrigger;
TypedMenubar.Content = MenubarContent;
TypedMenubar.Item = MenubarItem;
TypedMenubar.Label = MenubarLabel;

export { TypedMenubar as Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarLabel };
export default TypedMenubar;