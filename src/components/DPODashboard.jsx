import React, { useState, useEffect } from 'react';
import './DPODashboard.css';

const DPODashboard = () => {
  const [complianceData, setComplianceData] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch compliance data
    const fetchComplianceData = async () => {
      try {
        const response = await fetch('/api/moderation/compliance-health', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setComplianceData(data.data);
        }

        // Fetch pending reviews
        const reviewsResponse = await fetch('/api/moderation/pending-reviews', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setPendingReviews(reviewsData.data);
        }
      } catch (err) {
        console.error('Error fetching DPO data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceData();
  }, []);

  if (loading) {
    return <div className="dpo-dashboard-loading">Loading compliance dashboard...</div>;
  }

  if (!complianceData) {
    return <div className="dpo-dashboard-error">Failed to load compliance data</div>;
  }

  // Function to trigger API kill-switch
  const triggerKillSwitch = async (module) => {
    if (window.confirm(`Are you sure you want to isolate the ${module} module?`)) {
      try {
        const response = await fetch('/api/moderation/isolate-module', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ module })
        });

        if (response.ok) {
          alert(`${module} module has been isolated`);
        } else {
          alert(`Failed to isolate ${module} module`);
        }
      } catch (err) {
        console.error('Error isolating module:', err);
        alert('Error occurred while isolating the module');
      }
    }
  };

  return (
    <div className="dpo-dashboard-container">
      <header className="dpo-dashboard-header">
        <h1>Data Protection Officer Dashboard</h1>
        <p>Monitor and manage compliance with NDPA 2023 and Cybercrimes Act 2024</p>
      </header>

      <div className="dashboard-overview">
        <div className="metric-card compliance-health">
          <h3>Compliance Health</h3>
          <div className="gauge-container">
            <div className="gauge">
              <div className="gauge-fill" style={{ width: `${complianceData.overallCompliance}%` }}></div>
            </div>
            <span className="gauge-value">{complianceData.overallCompliance}%</span>
          </div>
        </div>

        <div className="metric-card pending-reviews">
          <h3>Pending Reviews</h3>
          <div className="count-display">{complianceData.pendingReviews}</div>
          <button 
            className="btn-secondary"
            onClick={() => document.getElementById('pending-reviews-section').scrollIntoView()}
          >
            View Details
          </button>
        </div>

        <div className="metric-card underage-users">
          <h3>Underage Users</h3>
          <div className="count-display">{complianceData.underageUsers}</div>
          <button className="btn-secondary">View Compliance</button>
        </div>

        <div className="metric-card data-exports">
          <h3>Data Export Requests</h3>
          <div className="count-display">{complianceData.dataExportRequests}</div>
          <button className="btn-secondary">Manage</button>
        </div>
      </div>

      <section className="kill-switch-controls">
        <h2>API Kill-Switch Controls</h2>
        <p>Emergency isolation controls for platform modules</p>
        <div className="kill-switch-grid">
          <button 
            className="kill-switch-btn tier-3"
            onClick={() => triggerKillSwitch('Gems')}
          >
            Isolate Gems Module
          </button>
          <button 
            className="kill-switch-btn tier-3"
            onClick={() => triggerKillSwitch('Hallmarks')}
          >
            Isolate Hallmarks Module
          </button>
          <button 
            className="kill-switch-btn tier-2"
            onClick={() => triggerKillSwitch('Forum')}
          >
            Isolate Forum Module
          </button>
          <button 
            className="kill-switch-btn tier-2"
            onClick={() => triggerKillSwitch('Groups')}
          >
            Isolate Groups Module
          </button>
        </div>
      </section>

      <section id="pending-reviews-section" className="pending-reviews-section">
        <h2>Pending Content Reviews</h2>
        {pendingReviews.length > 0 ? (
          <div className="reviews-list">
            {pendingReviews.map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-header">
                  <h4>{review.contentTitle}</h4>
                  <span className={`risk-badge risk-${review.riskLevel}`}>
                    {review.riskLevel.toUpperCase()}
                  </span>
                </div>
                <p>{review.contentPreview}</p>
                <div className="review-actions">
                  <button className="btn-approve">Approve</button>
                  <button className="btn-reject">Reject</button>
                  <button className="btn-details">View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending reviews at this time</p>
        )}
      </section>

      <section className="audit-trail">
        <h2>Recent Compliance Actions</h2>
        <table className="audit-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>User</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Content Review</td>
              <td>User_12345</td>
              <td>2 mins ago</td>
              <td><span className="status-completed">Completed</span></td>
            </tr>
            <tr>
              <td>Data Export Request</td>
              <td>User_67890</td>
              <td>15 mins ago</td>
              <td><span className="status-processing">Processing</span></td>
            </tr>
            <tr>
              <td>Hallmark Award</td>
              <td>User_11111</td>
              <td>1 hour ago</td>
              <td><span className="status-completed">Completed</span></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default DPODashboard;