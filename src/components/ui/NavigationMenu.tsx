import { Link} from 'react-router-dom';
import React, {} from 'react';

interface NavigationMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface NavigationMenuItemProps {
  children: React.ReactNode;
}

interface NavigationMenuLinkProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const NavigationMenu = ({ children, className = '' }: NavigationMenuProps) => {
  return (
    <nav className={`relative z-10 flex max-w-max flex-1 items-center ${className}`}>
      <ul className="flex flex-wrap list-none items-center justify-center gap-1">
        {children}
      </ul>
    </nav>
  );
};

const NavigationMenuItem: React.FC<NavigationMenuItemProps> = ({ children }) => {
  return <li>{children}</li>;
};

const NavigationMenuLink: React.FC<NavigationMenuLinkProps> = ({
  children,
  href,
  onClick,
  className = ''
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
    >
      {children}
    </a>
  );
};

interface NavigationMenuComponent extends React.FC<NavigationMenuProps> {
  Item: React.FC<NavigationMenuItemProps>;
  Link: React.FC<NavigationMenuLinkProps>;
}

const TypedNavigationMenu = NavigationMenu as NavigationMenuComponent;
TypedNavigationMenu.Item = NavigationMenuItem;
TypedNavigationMenu.Link = NavigationMenuLink;

export { TypedNavigationMenu as NavigationMenu, NavigationMenuItem, NavigationMenuLink };
