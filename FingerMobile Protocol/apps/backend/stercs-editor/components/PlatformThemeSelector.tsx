import React, { useState, useEffect } from 'react';

interface Theme {
  id: string;
  name: string;
  description?: string;
  properties: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    borderRadius: string;
    boxShadow: string;
    fontFamily?: string;
    backgroundImage?: string | null;
    backgroundPattern?: string | null;
    backgroundGradient?: string | null;
  };
  isPublic: boolean;
  createdBy: string;
  createdBymembername: string;
  scheduledChanges: any[];
  createdAt: string;
  updatedAt: string;
}

interface PlatformThemeSelectorProps {
  theme: 'light' | 'dark' | 'blue';
}

const PlatformThemeSelector: React.FC<PlatformThemeSelectorProps> = ({
  theme
}) => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCustomThemeForm, setShowCustomThemeForm] =
    useState<boolean>(false);
  const [customThemeName, setCustomThemeName] = useState<string>('');
  const [customThemeDescription, setCustomThemeDescription] =
    useState<string>('');
  const [customThemePrimaryColor, setCustomThemePrimaryColor] =
    useState<string>('#3b82f6');
  const [customThemeBgColor, setCustomThemeBgColor] =
    useState<string>('#ffffff');
  const [customThemeTextColor, setCustomThemeTextColor] =
    useState<string>('#1f2937');
  const [customThemeAccentColor, setCustomThemeAccentColor] =
    useState<string>('#8b5cf6');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [scheduleThemeId, setScheduleThemeId] = useState<string>('');

  // Fetch available themes
  useEffect(() => {
    fetchThemes();
    fetchActiveTheme();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/platform-themes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || 'fake-token'}`, // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setThemes(result.data);
      } else {
        setError(result.message || 'Failed to fetch themes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchActiveTheme = async () => {
    try {
      const response = await fetch('/api/platform-themes/member/active', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || 'fake-token'}`, // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setActiveTheme(result.data);
      } else {
        setError(result.message || 'Failed to fetch active theme');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
    member;
  };

  const handleThemeSelect = async (themeId: string) => {
    try {
      const response = await fetch('/api/platform-themes/member/active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || 'fake-token'}`, // In real app, use proper auth
        },
        body: JSON.stringify({ themeId })
      });

      const result = await response.json();

      if (result.success) {
        // Find the selected theme and update active theme
        const selectedTheme = themes.find((t) => t.id === themeId);
        if (selectedTheme) {
          setActiveTheme(selectedTheme);
        }
      } else {
        setError(result.message || 'Failed to set theme');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateCustomTheme = async () => {
    if (!customThemeName.trim()) {
      setError('Theme name is required');
      return;
    }

    try {
      const response = await fetch('/api/platform-themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || 'fake-token'}`, // In real app, use proper auth
        },
        body: JSON.stringify({
          name: customThemeName,
          description: customThemeDescription,
          properties: {
            primaryColor: customThemePrimaryColor,
            secondaryColor: customThemePrimaryColor,
            backgroundColor: customThemeBgColor,
            textColor: customThemeTextColor,
            accentColor: customThemeAccentColor,
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            backgroundImage: null,
            backgroundPattern: null,
            backgroundGradient: null
          },
          isPublic
        })
      });

      const result = await response.json();

      if (result.success) {
        setCustomThemeName('');
        setCustomThemeDescription('');
        setCustomThemePrimaryColor('#3b82f6');
        setCustomThemeBgColor('#ffffff');
        setCustomThemeTextColor('#1f2937');
        setCustomThemeAccentColor('#8b5cf6');
        setIsPublic(false);
        setShowCustomThemeForm(false);
        fetchThemes(); // Refresh the themes list
      } else {
        setError(result.message || 'Failed to create custom theme');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleScheduleTheme = async () => {
    if (!scheduleThemeId || !scheduledAt) {
      setError('Both theme and scheduled time are required');
      return;
    }

    try {
      const response = await fetch(
        `/api/platform-themes/${scheduleThemeId}/schedule`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || 'fake-token'}`, // In real app, use proper auth
          },
          body: JSON.stringify({
            scheduledAt
          })
        },
      );

      const result = await response.json();

      if (result.success) {
        setScheduleThemeId('');
        setScheduledAt('');
        alert('Theme scheduled successfully!');
      } else {
        setError(result.message || 'Failed to schedule theme');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const applyThemeToDocument = (themeProps: any) => {
    if (!themeProps) return;

    // Apply theme properties to document root
    const root = document.documentElement;
    root.style.setProperty('--primary-color', themeProps.primaryColor);
    root.style.setProperty('--secondary-color', themeProps.secondaryColor);
    root.style.setProperty('--background-color', themeProps.backgroundColor);
    root.style.setProperty('--text-color', themeProps.textColor);
    root.style.setProperty('--accent-color', themeProps.accentColor);
    root.style.setProperty('--border-radius', themeProps.borderRadius);
    root.style.setProperty('--box-shadow', themeProps.boxShadow);

    if (themeProps.backgroundImage) {
      document.body.style.backgroundImage = `url(${themeProps.backgroundImage})`;
    } else if (themeProps.backgroundGradient) {
      document.body.style.background = themeProps.backgroundGradient;
    } else {
      document.body.style.background = themeProps.backgroundColor;
    }
  };

  // Apply active theme when it changes
  useEffect(() => {
    if (activeTheme) {
      applyThemeToDocument(activeTheme.properties);
    }
  }, [activeTheme]);

  return (
    <div
      className="platform-theme-selector-panel"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor:
          theme === 'dark'
            ? '#1f2937'
            : theme === 'blue'
              ? '#dbeafe'
              : '#e5e7eb',
        color: theme === 'dark' ? 'white' : '#1f2937',
        padding: '1rem'
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0' }}>Platform Theme Selector</h3>

      {error && (
        <div
          style={{
            padding: '0.75rem',
            color: '#ef4444',
            backgroundColor:
              theme === 'dark'
                ? '#374151'
                : theme === 'blue'
                  ? '#eff6ff'
                  : '#f3f4f6',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}
        >
          Error: {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading themes...
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <h4>Active Theme: {activeTheme?.name || 'Default'}</h4>
            {activeTheme && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  backgroundColor: activeTheme.properties.backgroundColor,
                  color: activeTheme.properties.textColor,
                  border: '1px solid #d1d5db',
                  boxShadow: activeTheme.properties.boxShadow
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {activeTheme.name}
                </div>
                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {activeTheme.description}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.5rem'
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: activeTheme.properties.primaryColor,
                      borderRadius: '2px'
                    }}
                  />
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: activeTheme.properties.secondaryColor,
                      borderRadius: '2px'
                    }}
                  />
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: activeTheme.properties.accentColor,
                      borderRadius: '2px'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}
            >
              <h4>Available Themes</h4>
              <button
                onClick={() => setShowCustomThemeForm(!showCustomThemeForm)}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor:
                    theme === 'dark'
                      ? '#374151'
                      : theme === 'blue'
                        ? '#3b82f6'
                        : '#d1d5db',
                  color: theme === 'dark' ? 'white' : '#1f2937',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {showCustomThemeForm ? 'Cancel' : 'Create Custom'}
              </button>
            </div>

            {showCustomThemeForm && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor:
                    theme === 'dark'
                      ? '#374151'
                      : theme === 'blue'
                        ? '#eff6ff'
                        : '#f3f4f6',
                  borderRadius: '6px',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                    Theme Name
                  </label>
                  <input
                    type="text"
                    value={customThemeName}
                    onChange={(e) => setCustomThemeName(e.target.value)}
                    placeholder="Enter theme name"
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

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                    Description
                  </label>
                  <textarea
                    value={customThemeDescription}
                    onChange={(e) => setCustomThemeDescription(e.target.value)}
                    placeholder="Enter theme description"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                      color: theme === 'dark' ? 'white' : '#1f2937',
                      minHeight: '60px'
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}
                >
                  <div>
                    <label
                      style={{ display: 'block', marginBottom: '0.25rem' }}
                    >
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={customThemePrimaryColor}
                      onChange={(e) =>
                        setCustomThemePrimaryColor(e.target.value)
                      }
                      style={{ width: '100%', height: '40px' }}
                    />
                  </div>

                  <div>
                    <label
                      style={{ display: 'block', marginBottom: '0.25rem' }}
                    >
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={customThemeBgColor}
                      onChange={(e) => setCustomThemeBgColor(e.target.value)}
                      style={{ width: '100%', height: '40px' }}
                    />
                  </div>

                  <div>
                    <label
                      style={{ display: 'block', marginBottom: '0.25rem' }}
                    >
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={customThemeTextColor}
                      onChange={(e) => setCustomThemeTextColor(e.target.value)}
                      style={{ width: '100%', height: '40px' }}
                    />
                  </div>

                  <div>
                    <label
                      style={{ display: 'block', marginBottom: '0.25rem' }}
                    >
                      Accent Color
                    </label>
                    <input
                      type="color"
                      value={customThemeAccentColor}
                      onChange={(e) =>
                        setCustomThemeAccentColor(e.target.value)
                      }
                      style={{ width: '100%', height: '40px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Make theme public
                  </label>
                </div>

                <button
                  onClick={handleCreateCustomTheme}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Create Theme
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {themes.map((themeOption) => (
                <div
                  key={themeOption.id}
                  onClick={() => handleThemeSelect(themeOption.id)}
                  style={{
                    flex: '1 1 150px',
                    padding: '0.75rem',
                    margin: '0.25rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: themeOption.properties.backgroundColor,
                    color: themeOption.properties.textColor,
                    border:
                      activeTheme?.id === themeOption.id
                        ? '2px solid #3b82f6'
                        : '1px solid #d1d5db',
                    boxShadow: themeOption.properties.boxShadow,
                    transition: 'transform 0.2s',
                    minHeight: '100px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'scale(1.02)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {themeOption.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      marginBottom: '0.5rem',
                      flex: 1
                    }}
                  >
                    {themeOption.description}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.25rem',
                      height: '20px'
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: themeOption.properties.primaryColor,
                        borderRadius: '2px'
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: themeOption.properties.secondaryColor,
                        borderRadius: '2px'
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: themeOption.properties.accentColor,
                        borderRadius: '2px'
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      marginTop: '0.25rem',
                      color: '#6b7280'
                    }}
                  >
                    {themeOption.isPublic ? 'Public' : 'Private'} • By{' '}
                    {themeOption.createdBymembername}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4>Schedule Theme Changes</h4>
            <div
              style={{
                padding: '1rem',
                backgroundColor:
                  theme === 'dark'
                    ? '#374151'
                    : theme === 'blue'
                      ? '#eff6ff'
                      : '#f3f4f6',
                borderRadius: '6px'
              }}
            >
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Select Theme to Schedule
                </label>
                <select
                  value={scheduleThemeId}
                  onChange={(e) => setScheduleThemeId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="">Select a theme</option>
                  {themes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                  Schedule Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
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
                onClick={handleScheduleTheme}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Schedule Theme Change
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlatformThemeSelector;
