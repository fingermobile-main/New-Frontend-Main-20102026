import React, { useState, useEffect } from 'react';
import { electronAPI } from '../preload';
import { ApiService } from '../services/ApiService';
import './AuthScreen.css';

/**
 * Authentication Screen - Desktop
 * Features:
 * - Login form
 * - Registration form
 * - Biometric authentication (simulated)
 * - Secure token storage
 * - Remember me
 * - Forgot password
 */
const AuthScreen = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    membername: '',
    confirmPassword: ''
  });

  // Check for saved credentials on mount
  useEffect(() => {
    const checkSavedCredentials = async () => {
      try {
        const token = await electronAPI?.getToken('auth_token');
        if (token) {
          ApiService.setAuthToken(token);
          onAuthenticated?.();
        }
      } catch (err) {
        console.error('Error checking saved credentials:', err);
      }
    };

    checkSavedCredentials();
  }, [onAuthenticated]);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await ApiService.request(`${ApiService.baseURLs.lendsqr}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (result.success) {
        const token = result.data.token;
        ApiService.setAuthToken(token);

        if (rememberMe && electronAPI?.storeToken) {
          await electronAPI.storeToken('auth_token', token);
        }

        if (electronAPI?.showNotification) {
          electronAPI.showNotification({
            title: 'Welcome Back! 👋',
            body: `Logged in as ${formData.email}`
          });
        }

        onAuthenticated?.();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const result = await ApiService.request(`${ApiService.baseURLs.lendsqr}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          membername: formData.membername
        })
      });

      if (result.success) {
        if (electronAPI?.showNotification) {
          electronAPI.showNotification({
            title: 'Welcome to FingerMobile! 🎉',
            body: 'Account created successfully'
          });
        }

        setIsLogin(true);
        setFormData({
          email: '',
          password: '',
          membername: '',
          confirmPassword: ''
        });
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle biometric login
  const handleBiometricLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate biometric authentication
      const confirmed = window.confirm('Use biometric authentication?\n\nClick OK to simulate successful authentication.');
      
      if (confirmed) {
        // In production, this would use Windows Hello or Touch ID via native APIs
        const token = process.env.token || "placeholder-token" + Date.now(); // TODO: Replace with actual biometric authentication token from OS-level API
        ApiService.setAuthToken(token);
        
        if (electronAPI?.storeToken) {
          await electronAPI.storeToken('auth_token', token);
        }

        if (electronAPI?.showNotification) {
          electronAPI.showNotification({
            title: 'Biometric Auth Successful! ✓',
            body: 'Welcome back!'
          });
        }

        onAuthenticated?.();
      } else {
        setError('Biometric authentication cancelled');
      }
    } catch (err) {
      setError(err.message || 'Biometric auth failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    if (electronAPI?.showNotification) {
      electronAPI.showNotification({
        title: 'Password Reset',
        body: 'Password reset link sent to your email'
      });
    }
    setError(null);
  };

  return (
    <div className="auth-screen">
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">
              <span className="logo-icon">🚀</span>
              <h1>FingerMobile</h1>
            </div>
            <p className="tagline">Your Gateway to Digital Excellence</p>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {isLogin ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="forgot-password"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="button-spinner"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <span>🔐</span> Login
                  </>
                )}
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <button
                type="button"
                className="biometric-button"
                onClick={handleBiometricLogin}
                disabled={isLoading}
              >
                <span>👆</span> Use Biometric Authentication
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label htmlFor="register-name">Full Name</label>
                <input
                  type="text"
                  id="register-name"
                  name="membername"
                  value={formData.membername}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  minLength="8"
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-confirm">Confirm Password</label>
                <input
                  type="password"
                  id="register-confirm"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="button-spinner"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span>🎉</span> Create Account
                  </>
                )}
              </button>
            </form>
          )}

          {error && (
            <div className="error-message">
              <span>⚠️</span>
              <span>{error}</span>
              <button onClick={() => setError(null)} className="error-close">✕</button>
            </div>
          )}

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="toggle-auth"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
