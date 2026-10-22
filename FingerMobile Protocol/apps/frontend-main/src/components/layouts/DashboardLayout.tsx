import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Settings, Users } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebar,
  header
}) => {
  const defaultSidebar = (
    <div className="w-64 bg-background border-r border-slate-200 p-4">
      <nav className="space-y-2">
        <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-800 font-medium">
          <LayoutDashboard className="h-5 w-5 text-slate-700" />
          <span>Dashboard</span>
        </Link>
        <Link to="/dashboard/members" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-800 font-medium">
          <Users className="h-5 w-5 text-slate-700" />
          <span>Users</span>
        </Link>
        <Link to="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-800 font-medium">
          <Settings className="h-5 w-5 text-slate-700" />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );

  const defaultHeader = (
    <header className="h-16 border-b border-slate-200 bg-background px-6 flex items-center justify-between">
      <h1 className="text-xl font-black text-slate-900">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-700 font-semibold">Welcome back</span>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {sidebar || defaultSidebar}
        <div className="flex-1">
          {header || defaultHeader}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
