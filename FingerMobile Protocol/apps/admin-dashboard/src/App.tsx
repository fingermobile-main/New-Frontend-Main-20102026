import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardHome from './pages/DashboardHome';
import UsersPage from './pages/UsersPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import StercsDashboard from './pages/StercsDashboard';
import MasterDashboard from './pages/MasterDashboard';
import SecurityOperationsDashboard from './pages/SecurityOperationsDashboard';
import NexusGNNDashboard from './pages/NexusGNNDashboard';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <p className="text-gray-600">This module is currently under development.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="store" element={<PlaceholderPage title="Store, Goods, Items & Products" />} />
            <Route path="gallery" element={<PlaceholderPage title="Gallery & Media" />} />
            <Route path="analytics" element={<PlaceholderPage title="Analytics Dashboard" />} />
            <Route path="nexusgnn" element={<NexusGNNDashboard />} />
            <Route path="security" element={<SecurityOperationsDashboard />} />
            <Route path="monetization" element={<PlaceholderPage title="Monetization Suite" />} />
            <Route path="communication" element={<PlaceholderPage title="Communication Hub" />} />
            <Route path="geofencing" element={<PlaceholderPage title="Geofencing & Heatmaps" />} />
            <Route path="franchise" element={<PlaceholderPage title="Franchise Management" />} />
          </Route>
          <Route 
            path="/nexusgnn" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <NexusGNNDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/master-dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MasterDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super-admin" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SuperAdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stercs" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StercsDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;