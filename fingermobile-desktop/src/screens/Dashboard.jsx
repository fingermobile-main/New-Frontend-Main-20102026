import React, { useState, useEffect } from 'react';
import { electronAPI } from '../preload';
import AuthScreen from './AuthScreen';
import LendSqrScreen from './LendSqrScreen';
import FingerLuxScreen from './FingerLuxScreen';
import FingerWarsScreen from './FingerWarsScreen';
import { GameOnScreen, NyscScreen, LuminaScreen } from './ServiceScreens';
import './Dashboard.css';

/**
 * Main Dashboard - Desktop Application
 * Features:
 * - Sidebar navigation
 * - Service switching
 * - User profile
 * - Notifications
 * - Settings
 * - Offline indicator
 */
const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedService, setSelectedService] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await electronAPI?.getToken('auth_token');
        if (token) {
          setIsAuthenticated(true);
          // Fetch user profile
          setUser({
            name: 'John Doe',
            email: 'john@example.com',
            avatar: '👤'
          });
        }
      } catch (err) {
        console.error('Auth check error:', err);
      }
    };

    checkAuth();

    // Check connectivity periodically
    const connectivityCheck = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:5030/health', { method: 'HEAD' });
        setIsOffline(!response.ok);
      } catch {
        setIsOffline(true);
      }
    }, 30000);

    return () => clearInterval(connectivityCheck);
  }, []);

  // Listen for notifications from main process
  useEffect(() => {
    if (electronAPI?.onNotification) {
      electronAPI.onNotification((notification) => {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          ...notification
        }]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== Date.now()));
        }, 5000);
      });
    }
  }, []);

  // Handle authentication
  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = async () => {
    await electronAPI?.deleteToken('auth_token');
    setIsAuthenticated(false);
    setSelectedService('home');
    setUser(null);
  };

  // Render selected service
  const renderService = () => {
    switch (selectedService) {
      case 'lendsqr':
        return <LendSqrScreen />;
      case 'fingerlux':
        return <FingerLuxScreen />;
      case 'fingerwars':
        return <FingerWarsScreen />;
      case 'gameon':
        return <GameOnScreen />;
      case 'nysc':
        return <NyscScreen />;
      case 'lumina':
        return <LuminaScreen />;
      default:
        return <HomeScreen onSelectService={setSelectedService} />;
    }
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            {isSidebarOpen && <span className="logo-text">FingerMobile</span>}
          </div>
          <button
            className="toggle-sidebar"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${selectedService === 'home' ? 'active' : ''}`}
            onClick={() => setSelectedService('home')}
          >
            <span className="nav-icon">🏠</span>
            {isSidebarOpen && <span className="nav-text">Home</span>}
          </button>

          <div className="nav-section">
            {isSidebarOpen && <span className="nav-section-title">Services</span>}
            
            <button
              className={`nav-item ${selectedService === 'lendsqr' ? 'active' : ''}`}
              onClick={() => setSelectedService('lendsqr')}
            >
              <span className="nav-icon">💰</span>
              {isSidebarOpen && <span className="nav-text">LendSqr</span>}
            </button>

            <button
              className={`nav-item ${selectedService === 'fingerlux' ? 'active' : ''}`}
              onClick={() => setSelectedService('fingerlux')}
            >
              <span className="nav-icon">💎</span>
              {isSidebarOpen && <span className="nav-text">FingerLux</span>}
            </button>

            <button
              className={`nav-item ${selectedService === 'fingerwars' ? 'active' : ''}`}
              onClick={() => setSelectedService('fingerwars')}
            >
              <span className="nav-icon">🎮</span>
              {isSidebarOpen && <span className="nav-text">FingerWars</span>}
            </button>

            <button
              className={`nav-item ${selectedService === 'gameon' ? 'active' : ''}`}
              onClick={() => setSelectedService('gameon')}
            >
              <span className="nav-icon">🏆</span>
              {isSidebarOpen && <span className="nav-text">GameOn</span>}
            </button>

            <button
              className={`nav-item ${selectedService === 'nysc' ? 'active' : ''}`}
              onClick={() => setSelectedService('nysc')}
            >
              <span className="nav-icon">🎓</span>
              {isSidebarOpen && <span className="nav-text">NYSC</span>}
            </button>

            <button
              className={`nav-item ${selectedService === 'lumina' ? 'active' : ''}`}
              onClick={() => setSelectedService('lumina')}
            >
              <span className="nav-icon">🖼️</span>
              {isSidebarOpen && <span className="nav-text">Lumina</span>}
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="user-profile">
              <div className="user-avatar">{user.avatar}</div>
              {isSidebarOpen && (
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              )}
              {isSidebarOpen && (
                <button className="logout-button" onClick={handleLogout}>
                  🚪 Logout
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <button
              className="menu-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
            <h2 className="page-title">
              {selectedService === 'home' ? 'Home' : 
               selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}
            </h2>
          </div>

          <div className="top-bar-right">
            {isOffline && (
              <div className="offline-indicator">
                <span>📴</span>
                <span>Offline</span>
              </div>
            )}

            <button className="notification-button">
              <span>🔔</span>
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>

            <button className="settings-button">⚙️</button>
          </div>
        </header>

        {/* Service Content */}
        <div className="service-content">
          {renderService()}
        </div>
      </main>

      {/* Notifications Toast */}
      {notifications.length > 0 && (
        <div className="notifications-toast">
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-item">
              <span className="notification-icon">🔔</span>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-body">{notification.body}</div>
              </div>
              <button
                className="notification-close"
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Home Screen - Dashboard Overview
 */
const HomeScreen = ({ onSelectService }) => {
  const services = [
    { id: 'lendsqr', name: 'LendSqr', icon: '💰', description: 'Loans & Credit', color: 'purple' },
    { id: 'fingerlux', name: 'FingerLux', icon: '💎', description: 'Luxury Services', color: 'pink' },
    { id: 'fingerwars', name: 'FingerWars', icon: '🎮', description: 'Gaming Platform', color: 'blue' },
    { id: 'gameon', name: 'GameOn', icon: '🏆', description: 'Sports & Events', color: 'red' },
    { id: 'nysc', name: 'NYSC', icon: '🎓', description: 'Youth Service', color: 'green' },
    { id: 'lumina', name: 'Lumina', icon: '🖼️', description: 'Media Gallery', color: 'indigo' }
  ];

  return (
    <div className="home-screen">
      <div className="welcome-section">
        <h1>Welcome to FingerMobile Desktop</h1>
        <p>Your gateway to digital excellence</p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <button
            key={service.id}
            className="service-card"
            onClick={() => onSelectService(service.id)}
          >
            <div className={`service-icon ${service.color}`}>{service.icon}</div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </button>
        ))}
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">₦0.00</div>
          <div className="stat-label">Total Balance</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">0</div>
          <div className="stat-label">Active Loans</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-value">0</div>
          <div className="stat-label">Games Played</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-value">0</div>
          <div className="stat-label">Notifications</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
