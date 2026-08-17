import React, { useState } from 'react';
interface SettingsState {
  notifications: boolean;
  privacy: string;
  theme: string;
  language: string;
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    privacy: 'public',
    theme: 'light',
    language: 'en'
  });

  const handleToggle = (setting: keyof SettingsState) => {
    setSettings(prev => ({
      ...prev,
      [setting]: typeof prev[setting] === 'boolean' ? !prev[setting] : prev[setting]
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.info('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
        <div className="setting-group">
          <h3>Notifications</h3>
          <div className="setting-item">
            <label>Enable Notifications</label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
              />
            </div>
          </div>
        </div>

        <div className="setting-group">
          <h3>Privacy</h3>
          <div className="setting-item">
            <label>Profile Visibility</label>
            <select
              name="privacy"
              value={settings.privacy}
              onChange={handleSelectChange}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends only</option>
            </select>
          </div>
        </div>

        <div className="setting-group">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label>Theme</label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleSelectChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        <div className="setting-group">
          <h3>Language</h3>
          <div className="setting-item">
            <label>Display Language</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleSelectChange}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
};

export default SettingsPage;