import React, {useState, useEffect} from 'react';
interface DocumentationSection {
  title: string;
  content: string;

interface ComponentReference {
  name: string;
  description?: string;
  props: Array<{
    name: string;
    type: string;
    default: string;
    description?: string;
  }>;

interface DocumentationProps {
  theme: 'light' | 'dark' | 'blue';

const Documentation: React.FC<DocumentationProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'quick-start' | 'components' | 'api' | 'tutorials' | 'search'>('quick-start');
  const [quickStartGuide, setQuickStartGuide] = useState<DocumentationSection[]>([]);
  const [componentReference, setComponentReference] = useState<ComponentReference[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch documentation data on initial load
  useEffect(() => {
    fetchQuickStartGuide();
    fetchComponentReference();
  }, []);

  const fetchQuickStartGuide = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/editor/documentation/quick-start', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setQuickStartGuide(result.data.sections);
       else {
        setError(result.message || 'Failed to fetch quick start guide');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
     finally {
      setLoading(false);


  const fetchComponentReference = async () => {
    try {
      const response = await fetch('/api/editor/documentation/components/reference', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setComponentReference(result.data.components);
       else {
        setError(result.message || 'Failed to fetch component reference');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;

    try {
      const response = await fetch(`/api/editor/documentation/search/${searchQuery}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setSearchResults(result.data);
       else {
        setError(result.message || 'Failed to search documentation');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  return (
    <div 
      className="documentation-panel" 
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Documentation & Help</h3>
      
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
        {(['quick-start', 'components', 'api', 'tutorials', 'search'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeTab === tab ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
              color: theme === 'dark' ? 'white' : '#1f2937',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 'bold' : 'normal'
            }}
          >
            {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading documentation...
        </div>
      )}

      {!loading && activeTab === 'quick-start' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <h4>STERCS Editor Quick Start Guide</h4>
          {quickStartGuide.map((section, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '1.5rem', 
                padding: '1rem', 
                backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
            >
              <h5 style={{ margin: '0 0 0.5rem 0', color: theme === 'dark' ? 'white' : '#1f2937' }}>{section.title}</h5>
              <div style={{ whiteSpace: 'pre-line', color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                {section.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === 'components' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <h4>Component Reference Guide</h4>
          {componentReference.map((component, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '1.5rem', 
                padding: '1rem', 
                backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
            >
              <h5 style={{ margin: '0 0 0.5rem 0', color: theme === 'dark' ? 'white' : '#1f2937' }}>
                {component.name}
              </h5>
              <p style={{ margin: '0 0 1rem 0', color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                {component.description}
              </p>
              
              <h6 style={{ margin: '0 0 0.5rem 0', color: theme === 'dark' ? 'white' : '#1f2937' }}>Properties:</h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {component.props.map((prop, propIndex) => (
                  <div 
                    key={propIndex} 
                    style={{ 
                      padding: '0.5rem', 
                      backgroundColor: theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#dbeafe' : '#f9fafb',
                      borderRadius: '4px'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {prop.name}: <span style={{ color: '#3b82f6', fontWeight: 'normal' }}>{prop.type}</span> 
                      {prop.default && <span style={{ color: '#6b7280', fontSize: '0.875rem', fontStyle: 'italic' }}> (default: {prop.default})</span>}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}>
                      {prop.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === 'search' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Search Documentation</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search term..."
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#3b82f6' : '#3b82f6'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </div>
          </div>
          
          {searchResults.length > 0 ? (
            <div>
              <h4>Search Results</h4>
              {searchResults.map((result, index) => (
                <div 
                  key={index} 
                  style={{ 
                    marginBottom: '1rem', 
                    padding: '1rem', 
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <h5 style={{ margin: '0 0 0.5rem 0', color: theme === 'dark' ? 'white' : '#1f2937' }}>
                    {result.type}
                  </h5>
                  <div style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                    {result.excerpt}
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
              No results found for "{searchQuery}"
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
              Enter a search term to find documentation
            </div>
          )}
        </div>
      )}

      {!loading && (activeTab === 'api' || activeTab === 'tutorials') && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
          {activeTab === 'api' 
            ? 'API documentation will be displayed here' 
            : 'Tutorials will be displayed here'}
          <p style={{ marginTop: '1rem' }}>This section is coming soon in a future update.</p>
        </div>
      )}
    </div>
  );
export default Documentation;