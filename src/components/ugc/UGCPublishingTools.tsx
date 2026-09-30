import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

interface PublishingSettings {
  visibility: 'public' | 'followers' | 'private';
  communities: string[];
  scheduleDate?: string;
  scheduleTime?: string;
  monetization: {
    enablePaywall: boolean;
    price?: number;
    currency: string;
  };
}

const UGCPublishingTools: React.FC = () => {
  const { showToast } = useAppContext();
  const [settings, setSettings] = React.useState<PublishingSettings>({
    visibility: 'public',
    communities: [],
    monetization: {
      enablePaywall: false,
      price: 0,
      currency: 'FIC'
    }
  });

  const [availableCommunities] = React.useState([
    { id: '1', name: 'Photography Enthusiasts' },
    { id: '2', name: 'Music Creators' },
    { id: '3', name: 'Travel Bloggers' },
    { id: '4', name: 'Food Lovers' }
  ]);

  const handleVisibilityChange = (
    visibility: 'public' | 'followers' | 'private',
  ) => {
    setSettings((prev) => ({ ...prev, visibility }));
  };

  const handleCommunityToggle = (communityId: string) => {
    setSettings((prev) => {
      const communities = prev.communities.includes(communityId)
        ? prev.communities.filter((id) => id !== communityId)
        : [...prev.communities, communityId];

      return { ...prev, communities };
    });
  };

  const handleScheduleChange = (field: 'date' | 'time', value: string) => {
    setSettings((prev) => ({
      ...prev,
      [`schedule${field.charAt(0).toUpperCase() + field.slice(1)}`]: value
    }));
  };

  const handleMonetizationToggle = () => {
    setSettings((prev) => ({
      ...prev,
      monetization: {
        ...prev.monetization,
        enablePaywall: !prev.monetization.enablePaywall
      }
    }));
  };

  const handlePriceChange = (price: number) => {
    setSettings((prev) => ({
      ...prev,
      monetization: {
        ...prev.monetization,
        price
      }
    }));
  };

  const handleSubmit = () => {
    // Logic to publish content with these settings
    console.info('Publishing with settings:', settings);
    showToast('Content published successfully!', 'success');
  };

  return (
    <div className="ugc-publishing-tools">
      <h3>Publishing Settings</h3>

      <div className="publishing-section">
        <h4>Visibility</h4>
        <div className="visibility-options">
          <label className="radio-option">
            <input
              type="radio"
              name="visibility"
              checked={settings.visibility === 'public'}
              onChange={() => handleVisibilityChange('public')}
            />
            <span>Public</span>
            <p className="option-description">Visible to everyone</p>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="visibility"
              checked={settings.visibility === 'followers'}
              onChange={() => handleVisibilityChange('followers')}
            />
            <span>Followers Only</span>
            <p className="option-description">Visible only to your followers</p>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="visibility"
              checked={settings.visibility === 'private'}
              onChange={() => handleVisibilityChange('private')}
            />
            <span>Private</span>
            <p className="option-description">Visible only to you</p>
          </label>
        </div>
      </div>

      <div className="publishing-section">
        <h4>Communities</h4>
        <div className="communities-selector">
          {availableCommunities.map((community) => (
            <label key={community.id} className="checkbox-option">
              <input
                type="checkbox"
                checked={settings.communities.includes(community.id)}
                onChange={() => handleCommunityToggle(community.id)}
              />
              <span>{community.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="publishing-section">
        <h4>Schedule Publication</h4>
        <div className="schedule-controls">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={settings.scheduleDate || ''}
              onChange={(e) => handleScheduleChange('date', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              value={settings.scheduleTime || ''}
              onChange={(e) => handleScheduleChange('time', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="publishing-section">
        <h4>Monetization</h4>
        <div className="monetization-controls">
          <label className="switch-option">
            <span>Enable Paywall</span>
            <div className="switch">
              <input
                type="checkbox"
                checked={settings.monetization.enablePaywall}
                onChange={handleMonetizationToggle}
              />
              <span className="slider"></span>
            </div>
          </label>

          {settings.monetization.enablePaywall && (
            <div className="price-controls">
              <div className="form-group">
                <label>Price</label>
                <div className="price-input">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.monetization.price || 0}
                    onChange={(e) =>
                      handlePriceChange(parseFloat(e.target.value) || 0)
                    }
                  />
                  <select
                    value={settings.monetization.currency}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        monetization: {
                          ...prev.monetization,
                          currency: e.target.value
                        }
                      }))
                    }
                  >
                    <option value="FIC">FIC</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="publish-actions">
        <button className="btn-secondary">Save as Draft</button>
        <button className="btn-primary" onClick={handleSubmit}>
          Publish
        </button>
      </div>
    </div>
  );
};

export default UGCPublishingTools;
