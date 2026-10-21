import React, {} from 'react';
import { Home, LayoutDashboard, Users, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: number;
}

interface DashboardSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed = false,
  onToggle,
  activeItem = 'home',
  onItemClick
}) => {
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'members', label: 'Members', icon: <Users className="h-5 w-5" />, badge: 12 },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> }
  ];

  return (
    <aside
      className={`bg-background border-r h-full transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-full"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeItem === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start ${collapsed ? 'px-2' : 'px-4'}`}
              onClick={() => onItemClick?.(item.id)}
            >
              {item.icon}
              {!collapsed && (
                <>
                  <span className="ml-3">{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-primary text-white">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            className={`w-full justify-start ${collapsed ? 'px-2' : 'px-4'}`}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
