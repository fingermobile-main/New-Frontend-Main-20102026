import React, { useState } from 'react';
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  children?: NavItem[];
}

interface NavigationProps {
  items: NavItem[];
  logo?: React.ReactNode;
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  items,
  logo,
  className = ""
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  const handleItemClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (item.children && item.label) {
      setActiveDropdown(activeDropdown === item.label ? null : item.label);
    }
  };

  return (
    <nav className={`bg-background border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            {logo || (
              <div className="text-xl font-bold text-primary">Logo</div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {items.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => handleItemClick(item)}
                      className="flex items-center gap-1"
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-lg shadow-lg py-2 z-50">
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            onClick={child.onClick}
                            className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {items.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleItemClick(item)}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    </Button>
                    {activeDropdown === item.label && (
                      <div className="pl-4 space-y-1">
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            onClick={child.onClick}
                            className="block px-3 py-2 text-base font-medium hover:bg-muted rounded-md transition-colors"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    className="block px-3 py-2 text-base font-medium hover:bg-muted rounded-md transition-colors"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
