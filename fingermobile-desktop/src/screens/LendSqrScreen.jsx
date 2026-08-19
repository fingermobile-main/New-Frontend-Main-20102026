import React, { useState, useEffect, useCallback } from 'react';
import { ApiService } from '../../services/ApiService';
import { electronAPI } from '../../preload';
import './LendSqrScreen.css';

/**
 * LendSqr Screen - Complete Desktop Implementation
 * Features:
 * - Loading states
 * - Error handling
 * - Offline detection
 * - Caching
 * - Pull to refresh (via button)
 * - Credit score display
 * - Loan management
 */
const LendSqrScreen = () => {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState(null);
  const [loans, setLoans] = useState([]);
  const [creditScore, setCreditScore] = useState(null);
  const [selectedTab, setSelectedTab] = useState('loans');
  const [isApplying, setIsApplying] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    loanType: 'personal',
    amount: '',
    tenure: '12',
    purpose: ''
  });

  // Load data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check connectivity
      const isConnected = await ApiService.checkConnectivity();
      setIsOffline(!isConnected);

      // Load loans
      const loansResult = await ApiService.getLoans({ page: 1, limit: 10, useCache: true });
      
      // Load credit score
      const scoreResult = await ApiService.getCurrentCreditScore({ useCache: true });

      if (loansResult.success) {
        setLoans(loansResult.data || []);
      }

      if (scoreResult.success) {
        setCreditScore(scoreResult.data);
      }

      if (!loansResult.success && !scoreResult.success) {
        setError(loansResult.error || scoreResult.error || 'Failed to load data');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit loan application
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setIsApplying(true);

    try {
      const result = await ApiService.createLoan({
        loanType: formData.loanType,
        amount: parseFloat(formData.amount),
        tenure: parseInt(formData.tenure),
        purpose: formData.purpose
      });

      if (result.success) {
        // Show notification
        if (electronAPI?.showNotification) {
          electronAPI.showNotification({
            title: 'Application Submitted',
            body: 'Your loan application has been submitted successfully!'
          });
        }

        // Reset form
        setFormData({
          loanType: 'personal',
          amount: '',
          tenure: '12',
          purpose: ''
        });

        // Switch to loans tab and refresh
        setSelectedTab('loans');
        await loadData();
      } else {
        setError(result.error || 'Failed to submit application');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  // Cancel loan
  const handleCancelLoan = async (loanId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this loan application?');
    if (!confirmed) return;

    try {
      const result = await ApiService.cancelLoan(loanId);
      
      if (result.success) {
        if (electronAPI?.showNotification) {
          electronAPI.showNotification({
            title: 'Application Cancelled',
            body: 'Your loan application has been cancelled.'
          });
        }
        await loadData();
      } else {
        setError(result.error || 'Failed to cancel loan');
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel loan');
    }
  };

  // Get score color
  const getScoreColor = (score) => {
    if (!score) return '#9e9e9e';
    if (score >= 750) return '#4caf50';
    if (score >= 650) return '#ff9800';
    return '#f44336';
  };

  // Get score label
  const getScoreLabel = (score) => {
    if (!score) return 'No Score';
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  // Format amount
  const formatAmount = (amount) => {
    if (!amount) return '₦0.00';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="lendsqr-screen loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your loans...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && loans.length === 0 && !creditScore) {
    return (
      <div className="lendsqr-screen error-screen">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Failed to Load Data</h2>
          <p className="error-message">{error}</p>
          <button onClick={loadData} className="retry-button">
            <span>🔄</span> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lendsqr-screen">
      {/* Offline Banner */}
      {isOffline && (
        <div className="offline-banner">
          <span className="offline-icon">📴</span>
          <span>You are offline. Showing cached data.</span>
        </div>
      )}

      {/* Header */}
      <div className="lendsqr-header">
        <h1>LendSqr</h1>
        <button onClick={loadData} className="refresh-button" title="Refresh">
          <span>🔄</span>
        </button>
      </div>

      {/* Credit Score Card */}
      {creditScore && (
        <div 
          className="credit-score-card"
          style={{
            background: `linear-gradient(135deg, ${getScoreColor(creditScore.score)}, ${getScoreColor(creditScore.score)}dd)`
          }}
        >
          <div className="score-header">
            <h3>Credit Score</h3>
            <span className="score-icon">📊</span>
          </div>
          <div className="score-value">{creditScore.score}</div>
          <div className="score-label">{getScoreLabel(creditScore.score)}</div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab ${selectedTab === 'loans' ? 'active' : ''}`}
          onClick={() => setSelectedTab('loans')}
        >
          My Loans
        </button>
        <button
          className={`tab ${selectedTab === 'apply' ? 'active' : ''}`}
          onClick={() => setSelectedTab('apply')}
        >
          Apply Now
        </button>
      </div>

      {/* Content */}
      <div className="tab-content">
        {selectedTab === 'loans' ? (
          /* Loans Tab */
          <div className="loans-tab">
            {loans.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💰</div>
                <h3>No Loans Yet</h3>
                <p>Apply for your first loan to get started</p>
                <button onClick={() => setSelectedTab('apply')} className="action-button">
                  Apply for Loan
                </button>
              </div>
            ) : (
              <div className="loans-list">
                {loans.map((loan) => (
                  <div key={loan.id} className="loan-card">
                    <div className="loan-header">
                      <h4 className="loan-type">{loan.loan_type || 'Personal Loan'}</h4>
                      <span className={`status-badge status-${loan.status}`}>
                        {loan.status?.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="loan-amount">
                      {formatAmount(loan.amount)}
                    </div>
                    
                    <div className="loan-details">
                      <div className="detail-chip">
                        <span>📅</span>
                        <span>{loan.tenure_months} months</span>
                      </div>
                      <div className="detail-chip">
                        <span>📊</span>
                        <span>{loan.interest_rate}%</span>
                      </div>
                    </div>
                    
                    <div className="loan-purpose">
                      <strong>Purpose:</strong> {loan.purpose || 'N/A'}
                    </div>
                    
                    <div className="loan-date">
                      Created: {formatDate(loan.created_at)}
                    </div>
                    
                    {loan.status === 'pending' && (
                      <button
                        onClick={() => handleCancelLoan(loan.id)}
                        className="cancel-button"
                      >
                        <span>❌</span> Cancel Application
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Apply Tab */
          <div className="apply-tab">
            <form onSubmit={handleSubmitApplication} className="loan-form">
              <h2>Loan Application</h2>
              
              <div className="form-group">
                <label htmlFor="loanType">Loan Type</label>
                <select
                  id="loanType"
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="personal">Personal Loan</option>
                  <option value="business">Business Loan</option>
                  <option value="emergency">Emergency Loan</option>
                  <option value="asset">Asset Financing</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="amount">Loan Amount (₦)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="e.g., 50000"
                  min="1000"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="tenure">Tenure (months)</label>
                <input
                  type="number"
                  id="tenure"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleInputChange}
                  placeholder="e.g., 12"
                  min="1"
                  max="60"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="purpose">Purpose</label>
                <textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  placeholder="Why do you need this loan?"
                  rows="4"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="submit-button"
                disabled={isApplying}
              >
                {isApplying ? (
                  <>
                    <div className="button-spinner"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span>📝</span> Submit Application
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Error Toast */}
      {error && (
        <div className="error-toast">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="toast-close">✕</button>
        </div>
      )}
    </div>
  );
};

export default LendSqrScreen;
