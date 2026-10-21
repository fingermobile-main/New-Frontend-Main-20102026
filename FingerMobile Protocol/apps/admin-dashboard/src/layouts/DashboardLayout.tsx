import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoutButton from '../components/LogoutButton';
import { 
  Users, ShoppingBag, Image, BarChart2, Shield, 
  DollarSign, MessageSquare, Map, Briefcase, 
  Server, ShieldAlert, Cpu
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  // Check if we're in a special dashboard (super admin, stercs, or nexusgnn)
  const isSpecialDashboard = location.pathname.startsWith('/super-admin') || 
                           location.pathname.startsWith('/stercs') ||
                           location.pathname.startsWith('/nexusgnn');
  
  // For special dashboards, show specialized menu
  if (isSpecialDashboard) {
    const specialMenuItems = [
      { name: 'Super Admin', icon: Server, path: '/super-admin' },
      { name: 'NexusGNN Intelligence', icon: Cpu, path: '/nexusgnn' },
      { name: 'STERCS', icon: ShieldAlert, path: '/stercs' },
      { name: 'Master Dashboard', icon: BarChart2, path: '/' },
    ];
    
    return (
      <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-800">
          FM Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {specialMenuItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`flex items-center space-x-3 p-2 rounded ${
                location.pathname === item.path 
                  ? 'bg-gray-700 text-white' 
                  : 'hover:bg-gray-800'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    );
  }
  
  // Regular menu for standard dashboard
  const menuItems = [
    { name: 'Users & Members', icon: Users, path: '/users' },
    { name: 'Store & Products', icon: ShoppingBag, path: '/store' },
    { name: 'Gallery & Media', icon: Image, path: '/gallery' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
    { name: 'NexusGNN Intelligence', icon: Cpu, path: '/nexusgnn' },
    { name: 'Security', icon: Shield, path: '/security' },
    { name: 'Monetization', icon: DollarSign, path: '/monetization' },
    { name: 'Communication', icon: MessageSquare, path: '/communication' },
    { name: 'Geofencing', icon: Map, path: '/geofencing' },
    { name: 'Franchise', icon: Briefcase, path: '/franchise' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-800">
        FM Admin
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            className={`flex items-center space-x-3 p-2 rounded ${
              location.pathname === item.path 
                ? 'bg-gray-700 text-white' 
                : 'hover:bg-gray-800'
            }`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if we're in a special dashboard (super admin or stercs)
  const isSpecialDashboard = location.pathname.startsWith('/super-admin') || 
                           location.pathname.startsWith('/stercs');

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {isSpecialDashboard 
              ? (location.pathname.startsWith('/super-admin') ? 'Super Admin Dashboard' : 'STERCS Dashboard')
              : 'Dashboard Overview'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
              </div>
              <span className="text-gray-600">{user?.username || user?.email}</span>
            </div>
            <div className="p-2 hover:bg-gray-800 rounded">
              <LogoutButton />
            </div>
          </div>
        </header>
        <main className="p-6 flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;