import React, {useState, useEffect} from 'react';
interface MemberProfile {
  id: number;
  membername: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  timezone: string;
  language: string;
  themePreference: string;
  createdAt: string;
  updatedAt: string;
}

interface MemberPreferences {
  theme: string;
  language: string;
  timezone: string;
  notifications: Record<string, boolean>;
  email: string;
}

interface Activity {
  id: number;
  action: string;
  timestamp: string;
  description?: string;
}

interface MemberProfileProps {
  theme: 'light' | 'dark' | 'blue';
}

const MemberProfile: React.FC<MemberProfileProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'activity'>('profile');
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [preferences, setPreferences] = useState<MemberPreferences | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for profile update
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  // Form states for preferences
  const [prefTheme, setPrefTheme] = useState<string>('light');
  const [prefLanguage, setPrefLanguage] = useState<string>('en');
  const [prefTimezone, setPrefTimezone] = useState<string>('UTC');
  const [prefNotifications, setPrefNotifications] = useState<Record<string, boolean>>({
    email: true,
    push: true,
    sms: false
  });

  // Form states for password change
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Fetch data on initial load
  useEffect(() => {
    fetchProfile();
    fetchPreferences();
    fetchActivity();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/editor/member-profile/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setProfile(result.data);
        setFirstName(result.data.firstName || '');
        setLastName(result.data.lastName || '');
        setPhone(result.data.phone || '');
        setBio(result.data.bio || '');
        setAvatarUrl(result.data.avatarUrl || '');
      } else {
        setError(result.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/editor/member-profile/preferences', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setPreferences(result.data);
        setPrefTheme(result.data.theme || 'light');
        setPrefLanguage(result.data.language || 'en');
        setPrefTimezone(result.data.timezone || 'UTC');
        setPrefNotifications(result.data.notifications || {
          email: true,
          push: true,
          sms: false
        });
      } else {
        setError(result.message || 'Failed to fetch preferences');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await fetch('/api/editor/member-profile/activity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setActivities(result.data);
      } else {
        setError(result.message || 'Failed to fetch activity');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/api/editor/member-profile/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          bio,
          avatarUrl
        })
      });

      const result = await response.json();

      if (result.success) {
        setProfile(result.data);
        alert('Profile updated successfully!');
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      const response = await fetch('/api/editor/member-profile/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          theme: prefTheme,
          language: prefLanguage,
          timezone: prefTimezone,
          notifications: prefNotifications
        })
      });

      const result = await response.json();

      if (result.success) {
        setPreferences(result.data);
        alert('Preferences updated successfully!');
      } else {
        setError(result.message || 'Failed to update preferences');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    try {
      const response = await fetch('/api/editor/member-profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const result = await response.json();

      if (result.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        alert('Password changed successfully!');
      } else {
        setError(result.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div
      className="member-profile-panel"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme === 'dark' ? '#1f2937' : theme === 'blue' ? '#dbeafe' : '#e5e7eb',
        color: theme === 'dark' ? 'white' : '#1f2937',
        padding: '1rem'
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0' }}>Member Profile & Settings</h3>

      {error && (
        <div style={{
          padding: '0.75rem',
          color: '#ef4444',
          backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : '#f3f4f6',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          Error: {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'profile' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
            color: theme === 'dark' ? 'white' : '#1f2937',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'profile' ? 'bold' : 'normal'
          }}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'preferences' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
            color: theme === 'dark' ? 'white' : '#1f2937',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'preferences' ? 'bold' : 'normal'
          }}
        >
          Preferences
        </button>
        <button
          onClick={() => setActiveTab('security')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'security' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
            color: theme === 'dark' ? 'white' : '#1f2937',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'security' ? 'bold' : 'normal'
          }}
        >
          Security
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'activity' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
            color: theme === 'dark' ? 'white' : '#1f2937',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'activity' ? 'bold' : 'normal'
          }}
        >
          Activity
        </button>
      </div>

      {loading && activeTab === 'profile' && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading...
        </div>
      )}

      {!loading && activeTab === 'profile' && profile && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Profile Information</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : '#f3f4f6',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Phone</label>
              <input
                type="tel"
                value={phone || ''}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Avatar URL</label>
              <input
                type="text"
                value={avatarUrl || ''}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Bio</label>
              <textarea
                value={bio || ''}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937',
                  minHeight: '80px'
                }}
              />
            </div>

            <button
              onClick={handleUpdateProfile}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#3b82f6' : '#3b82f6'),
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Update Profile
            </button>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px'
          }}>
            <h4>Account Information</h4>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>membername:</strong> {profile.membername}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Member Since:</strong> {formatDate(profile.createdAt)}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Last Updated:</strong> {formatDate(profile.updatedAt)}
            </div>
          </div>
        </div>
      )}

      {!loading && activeTab === 'preferences' && preferences && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Preferences</h4>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Theme</label>
              <select
                value={prefTheme}
                onChange={(e) => setPrefTheme(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="blue">Blue</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Language</label>
              <select
                value={prefLanguage}
                onChange={(e) => setPrefLanguage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Timezone</label>
              <select
                value={prefTimezone}
                onChange={(e) => setPrefTimezone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="CET">Central European Time</option>
                <option value="JST">Japan Standard Time</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h5>Notification Preferences</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="email-notifications"
                    checked={prefNotifications.email}
                    onChange={(e) => setPrefNotifications({...prefNotifications, email: e.target.checked})}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <label htmlFor="email-notifications">Email Notifications</label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="push-notifications"
                    checked={prefNotifications.push}
                    onChange={(e) => setPrefNotifications({...prefNotifications, push: e.target.checked})}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <label htmlFor="push-notifications">Push Notifications</label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="sms-notifications"
                    checked={prefNotifications.sms}
                    onChange={(e) => setPrefNotifications({...prefNotifications, sms: e.target.checked})}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <label htmlFor="sms-notifications">SMS Notifications</label>
                </div>
              </div>
            </div>

            <button
              onClick={handleUpdatePreferences}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#3b82f6' : '#3b82f6'),
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Update Preferences
            </button>
          </div>
        </div>
      )}

      {!loading && activeTab === 'security' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Change Password</h4>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              />
            </div>

            <button
              onClick={handleChangePassword}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#3b82f6' : '#3b82f6'),
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Change Password
            </button>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px'
          }}>
            <h4>Security Settings</h4>
            <div style={{ marginBottom: '1rem' }}>
              <h5>Two-Factor Authentication</h5>
              <p>Two-factor authentication adds an extra layer of security to your account.</p>
              <button
                aria-label="Enable Two-Factor Authentication"
                onClick={() => alert("Two-factor authentication settings updated")}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: (theme === 'dark' ? '#10b981' : theme === 'blue' ? '#10b981' : '#10b981'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Enable 2FA
              </button>
            </div>

            <div>
              <h5>Session Management</h5>
              <p>Manage your active sessions across different devices.</p>
              <button
                aria-label="View Active Sessions"
                onClick={() => alert("Active sessions retrieved")}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: (theme === 'dark' ? '#ef4444' : theme === 'blue' ? '#ef4444' : '#ef4444'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                View Active Sessions
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && activeTab === 'activity' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px'
          }}>
            <h4>Recent Activity</h4>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                No recent activity
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activities.map(activity => (
                  <div
                    key={activity.id}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#dbeafe' : '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: 'bold' }}>
                        {activity.action}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.9rem' }}>
                      {activity.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProfile;
