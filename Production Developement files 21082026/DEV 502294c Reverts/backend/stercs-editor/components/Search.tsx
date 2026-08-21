import React, {useState} from 'react';
interface SearchResult {
  name?: string;
  path?: string;
  type?: string;
  matches?: Array<{
    lineNumber: number;
    content: string;
    context: Array<{
      lineNumber: number;
      content: string;
      isMatch: boolean;
    }>;
  }>;

interface SearchProps {
  theme: 'light' | 'dark' | 'blue';

const Search: React.FC<SearchProps> = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchType, setSearchType] = useState<'files' | 'content' | 'components' | 'projects'>('files');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let endpoint = '';
      let params = '';
      
      switch (searchType) {
        case 'files':
          if (!projectId) {
            setError('Project ID is required for file search');
            setLoading(false);
            return;

          endpoint = `/api/search/files`;
          params = `projectId=${projectId}&searchTerm=${encodeURIComponent(searchTerm)}`;
          break;
        case 'content':
          if (!projectId) {
            setError('Project ID is required for content search');
            setLoading(false);
            return;

          endpoint = `/api/search/content`;
          params = `projectId=${projectId}&searchTerm=${encodeURIComponent(searchTerm)}`;
          break;
        case 'components':
          endpoint = `/api/search/components`;
          params = `searchTerm=${encodeURIComponent(searchTerm)}`;
          break;
        case 'projects':
          endpoint = `/api/search/projects`;
          params = `searchTerm=${encodeURIComponent(searchTerm)}`;
          break;
        default:
          setError('Invalid search type');
          setLoading(false);
          return;

      const response = await fetch(`${endpoint}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });
      
      const result = await response.json();
      
      if (result.success) {
        setResults(result.data.results || []);
       else {
        setError(result.message || 'Search failed');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
     finally {
      setLoading(false);


  return (
    <div 
      className="search-panel" 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: theme === 'dark' ? '#1f2937' : theme === 'blue' ? '#dbeafe' : '#e5e7eb',
        color: theme === 'dark' ? 'white' : '#1f2937'
      }}
    >
      <div style={{ 
        padding: '0.75rem', 
        borderBottom: '1px solid #d1d5db'
      }}>
        <h3 style={{ margin: '0 0 0.75rem 0' }}>Search</h3>
        
        <form onSubmit={handleSearch}>
          <div style={{ marginBottom: '0.75rem' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter search term"
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
          
          <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '1rem' }}>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                color: theme === 'dark' ? 'white' : '#1f2937'
              }}
            >
              <option value="files">Files</option>
              <option value="content">Content</option>
              <option value="components">Components</option>
              <option value="projects">Projects</option>
            </select>
            
            {searchType !== 'components' && searchType !== 'projects' && (
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="Project ID"
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              />
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: loading ? '#9ca3af' : (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db'),
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || !searchTerm.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div style={{ 
          padding: '1rem', 
          color: '#ef4444',
          backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : '#f3f4f6'
        }}>
          Error: {error}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
        {results.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
            {searchTerm ? 'No results found' : 'Enter a search term to begin'}
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {results.map((result, index) => (
              <li key={index} style={{ 
                marginBottom: '0.75rem', 
                padding: '0.75rem',
                backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}>
                {result.name && (
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {result.name}
                  </div>
                )}
                {result.path && (
                  <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem', color: '#6b7280' }}>
                    {result.path}
                  </div>
                )}
                {result.type && (
                  <div style={{ fontSize: '0.7rem', marginBottom: '0.25rem', color: '#9ca3af' }}>
                    Type: {result.type}
                  </div>
                )}
                {result.matches && result.matches.map((match, matchIndex) => (
                  <div key={matchIndex} style={{ marginTop: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      Line {match.lineNumber}: {match.content}
                    </div>
                    {match.context && match.context.length > 0 && (
                      <div style={{ 
                        marginTop: '0.25rem', 
                        padding: '0.25rem',
                        backgroundColor: theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#dbeafe' : '#f9fafb',
                        borderLeft: '2px solid #3b82f6',
                        fontSize: '0.8rem'
                      }}>
                        {match.context.map((ctx, ctxIndex) => (
                          <div 
                            key={ctxIndex} 
                            style={{ 
                              padding: '0.1rem 0',
                              backgroundColor: ctx.isMatch ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#dbeafe' : '#e5e7eb') : 'transparent'
                            }}
                          >
                            {ctx.lineNumber}: {ctx.content}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
export default Search;