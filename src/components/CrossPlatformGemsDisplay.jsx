import React, { useState, useEffect } from 'react';
import './CrossPlatformGemsDisplay.css';

const CrossPlatformGemsDisplay = ({ userId }) => {
  const [gems, setGems] = useState(null);
  const [hallmarks, setHallmarks] = useState([]);
  const [platformSettings, setPlatformSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user's gems
        const gemsResponse = await fetch('/api/gems/total', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (gemsResponse.ok) {
          const gemsData = await gemsResponse.json();
          setGems(gemsData.data.totalGems);
        }

        // Fetch user's hallmarks
        const hallmarksResponse = await fetch(`/api/hallmarks/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (hallmarksResponse.ok) {
          const hallmarksData = await hallmarksResponse.json();
          setHallmarks(hallmarksData.data);
        }

        // Fetch platform-specific settings
        const platformResponse = await fetch('/api/gems/platform-settings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (platformResponse.ok) {
          const platformData = await platformResponse.json();
          setPlatformSettings(platformData.data);
        }
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Determine platform from user agent
  const detectPlatform = () => {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Android')) return 'mobile_android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'mobile_ios';
    if (userAgent.includes('Mac')) return 'desktop_mac';
    if (userAgent.includes('Win')) return 'desktop_windows';
    
    return 'web';
  };

  const currentPlatform = detectPlatform();

  if (loading) {
    return <div className="cross-platform-gems-loading">Loading your achievements...</div>;
  }

  if (error) {
    return <div className="cross-platform-gems-error">{error}</div>;
  }

  // Group hallmarks by rarity for display
  const groupedHallmarks = hallmarks.reduce((acc, uh) => {
    const { hallmark } = uh;
    if (!acc[hallmark.rarity]) {
      acc[hallmark.rarity] = [];
    }
    acc[hallmark.rarity].push(hallmark);
    return acc;
  }, {});

  const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
  const orderedHallmarks = rarityOrder.flatMap(rarity => 
    groupedHallmarks[rarity] ? groupedHallmarks[rarity].map(h => ({ ...h, rarity })) : []
  );

  return (
    <div className="cross-platform-gems-container">
      <div className="platform-indicator">
        <span className={`platform-badge platform-${currentPlatform}`}>
          {currentPlatform.replace('_', ' ').toUpperCase()}
        </span>
        <p>Platform-specific settings applied</p>
      </div>

      <div className="gems-section">
        <h3>Your Gems</h3>
        <div className="gems-count">
          <span className="gem-icon">💎</span>
          <span className="gem-number">{gems || 0}</span>
        </div>
        <p>Total Gems earned through engagement</p>
        
        {platformSettings && (
          <div className="platform-notes">
            <p><strong>Platform Settings:</strong></p>
            <ul>
              <li>Cognitive Load Thresholds: Low {platformSettings.cognitiveLoadThresholds.low}- High {platformSettings.cognitiveLoadThresholds.high}</li>
              <li>Max Gems per Hour: {platformSettings.antiBotThresholds.maxGemsPerHour}</li>
              <li>Quiet Hours: {platformSettings.notificationSettings.quietHoursStart} - {platformSettings.notificationSettings.quietHoursEnd}</li>
            </ul>
          </div>
        )}
      </div>

      <div className="hallmarks-section">
        <h3>Your Hallmarks</h3>
        {orderedHallmarks.length > 0 ? (
          <div className="hallmarks-grid">
            {orderedHallmarks.map((hallmark, index) => (
              <div 
                key={index} 
                className={`hallmark-card rarity-${hallmark.rarity}`}
                title={`${hallmark.name}: ${hallmark.description}`}
              >
                <div className="hallmark-icon">🏆</div>
                <div className="hallmark-info">
                  <h4>{hallmark.name}</h4>
                  <p>{hallmark.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hallmarks yet. Keep engaging to earn your first!</p>
        )}
      </div>

      <div className="platform-features">
        <h3>Platform Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>Animations</h4>
            <p>{platformSettings?.performance.animationPreference || 'Not loaded'}</p>
          </div>
          <div className="feature-card">
            <h4>Haptic Feedback</h4>
            <p>
              {platformSettings 
                ? platformSettings.platform === 'mobile_android' || platformSettings.platform === 'mobile_ios' 
                  ? 'Available' 
                  : 'Unavailable' 
                : 'Loading...'}
            </p>
          </div>
          <div className="feature-card">
            <h4>Biometric Auth</h4>
            <p>
              {platformSettings 
                ? platformSettings.platform === 'mobile_android' || 
                  platformSettings.platform === 'mobile_ios' ||
                  platformSettings.platform === 'desktop_mac' ||
                  platformSettings.platform === 'desktop_windows'
                  ? 'Available' 
                  : 'Limited' 
                : 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossPlatformGemsDisplay;