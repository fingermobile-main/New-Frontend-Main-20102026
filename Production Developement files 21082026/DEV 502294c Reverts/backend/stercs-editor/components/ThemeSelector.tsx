import React, {useState, useEffect} from 'react';
interface Theme {
  id: string;
  name: string;
  properties: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    borderRadius: string;
    boxShadow: string;


interface ThemeSelectorProps {
  currentTheme: 'light' | 'dark' | 'blue';
  onThemeChange: (themeId: string) => void;
  theme: 'light' | 'dark' | 'blue';

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange, theme }) => {
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCustomThemeForm, setShowCustomThemeForm] = useState<boolean>(false);
  const [customThemeName, setCustomThemeName] = useState<string>('');
  const [customThemePrimaryColor, setCustomThemePrimaryColor] = useState<string>('#3b82f6');
  const [customThemeBgColor, setCustomThemeBgColor] = useState<string>('#ffffff');
  const [customThemeTextColor, setCustomThemeTextColor] = useState<string>('#1f2937');

  // Fetch available themes
  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/themes/available', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setAvailableThemes(result.data);
       else {
        setError(result.message || 'Failed to fetch themes');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
     finally {
      setLoading(false);


  const handleThemeSelect = (themeId: string) => {
    onThemeChange(themeId);

  const handleCreateCustomTheme = async () => {
    if (!customThemeName.trim()) {
      setError('Theme name is required');
      return;

    try {
      const response = await fetch('/api/themes/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: customThemeName,
          properties: {
            primaryColor: customThemePrimaryColor,
            backgroundColor: customThemeBgColor,
            textColor: customThemeTextColor,
            secondaryColor: customThemePrimaryColor,
            accentColor: customThemePrimaryColor,
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'

        })
      });

      const result = await response.json();

      if (result.success) {
        setCustomThemeName('');
        setShowCustomThemeForm(false);
        fetchThemes(); // Refresh the themes list
       else {
        setError(result.message || 'Failed to create custom theme');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  return (
    <div 
      className="theme-selector-panel" 
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Theme Selector</h3>
      
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
      
      {loading ? (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading themes...
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <h4>Available Themes</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableThemes.map(themeOption => (
                <div
                  key={themeOption.id}
                  onClick={() => handleThemeSelect(themeOption.id)}
                  style={{
                    flex: '1 1 100px',
                    padding: '0.75rem',
                    margin: '0.25rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: themeOption.properties.backgroundColor,
                    color: themeOption.properties.textColor,
                    border: currentTheme === themeOption.id ? '2px solid #3b82f6' : '1px solid #d1d5db',
                    boxShadow: themeOption.properties.boxShadow,
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {themeOption.name}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.25rem',
                    height: '20px'
                  }}>
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
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4>Custom Themes</h4>
              <button
                onClick={() => setShowCustomThemeForm(!showCustomThemeForm)}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db',
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
              <div style={{ 
                padding: '1rem', 
                backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : '#f3f4f6',
                borderRadius: '6px',
                marginBottom: '1rem'
              }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Theme Name</label>
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
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Primary Color</label>
                  <input
                    type="color"
                    value={customThemePrimaryColor}
                    onChange={(e) => setCustomThemePrimaryColor(e.target.value)}
                    style={{ width: '100%', height: '40px' }}
                  />
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Background Color</label>
                  <input
                    type="color"
                    value={customThemeBgColor}
                    onChange={(e) => setCustomThemeBgColor(e.target.value)}
                    style={{ width: '100%', height: '40px' }}
                  />
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Text Color</label>
                  <input
                    type="color"
                    value={customThemeTextColor}
                    onChange={(e) => setCustomThemeTextColor(e.target.value)}
                    style={{ width: '100%', height: '40px' }}
                  />
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
          </div>
        </>
      )}
    </div>
  );
export default ThemeSelector;