import React, {useState, useEffect} from 'react';
interface Api {
  id: number;
  name: string;
  description?: string;
  projectId: number;
  baseUrl: string;
  endpoints: string[];
  authType: string;
  createdAt: string;
  updatedAt: string;
}

interface Endpoint {
  id: number;
  apiId: number;
  path: string;
  method: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface TestResult {
  id: number;
  endpointId: number;
  statusCode: number;
  responseTime: number;
  createdAt: string;
}

interface ApiManagerProps {
  theme: 'light' | 'dark' | 'blue';
}

const ApiManager: React.FC<ApiManagerProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'apis' | 'endpoints' | 'tests'>('apis');
  const [apis, setApis] = useState<Api[]>([]);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApi, setSelectedApi] = useState<number | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<number | null>(null);
  
  // Form states for APIs
  const [newApiName, setNewApiName] = useState<string>('');
  const [newApiDescription, setNewApiDescription] = useState<string>('');
  const [newApiProjectId, setNewApiProjectId] = useState<string>('1');
  const [newApiBaseUrl, setNewApiBaseUrl] = useState<string>('');
  const [newApiAuthType, setNewApiAuthType] = useState<string>('none');
  
  // Form states for endpoints
  const [newEndpointPath, setNewEndpointPath] = useState<string>('');
  const [newEndpointMethod, setNewEndpointMethod] = useState<string>('GET');
  const [newEndpointDescription, setNewEndpointDescription] = useState<string>('');

  // Fetch data on initial load
  useEffect(() => {
    fetchApis();
  }, []);

  useEffect(() => {
    if (selectedApi) {
      fetchEndpoints(selectedApi);
    }
  }, [selectedApi]);

  useEffect(() => {
    if (selectedEndpoint) {
      fetchTestResults(selectedEndpoint);
    }
  }, [selectedEndpoint]);

  const fetchApis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/editor/apis', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setApis(result.data);
      } else {
        setError(result.message || 'Failed to fetch APIs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchEndpoints = async (apiId: number) => {
    try {
      const response = await fetch(`/api/editor/apis/${apiId}/endpoints`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setEndpoints(result.data);
      } else {
        setError(result.message || 'Failed to fetch endpoints');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchTestResults = async (endpointId: number) => {
    try {
      const response = await fetch(`/api/editor/apis/endpoints/${endpointId}/tests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setTestResults(result.data);
      } else {
        setError(result.message || 'Failed to fetch test results');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateApi = async () => {
    if (!newApiName || !newApiProjectId || !newApiBaseUrl) {
      setError('API name, project ID, and base URL are required');
      return;
    }

    try {
      const response = await fetch('/api/editor/apis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newApiName,
          description: newApiDescription,
          projectId: parseInt(newApiProjectId),
          baseUrl: newApiBaseUrl,
          authType: newApiAuthType
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewApiName('');
        setNewApiDescription('');
        setNewApiProjectId('1');
        setNewApiBaseUrl('');
        setNewApiAuthType('none');
        fetchApis(); // Refresh the APIs list
      } else {
        setError(result.message || 'Failed to create API');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateEndpoint = async () => {
    if (!selectedApi || !newEndpointPath || !newEndpointMethod) {
      setError('API, path, and method are required for endpoint creation');
      return;
    }

    try {
      const response = await fetch(`/api/editor/apis/${selectedApi}/endpoints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          path: newEndpointPath,
          method: newEndpointMethod,
          description: newEndpointDescription
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewEndpointPath('');
        setNewEndpointMethod('GET');
        setNewEndpointDescription('');
        fetchEndpoints(selectedApi); // Refresh the endpoints list
      } else {
        setError(result.message || 'Failed to create endpoint');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleTestEndpoint = async (endpointId: number) => {
    try {
      const response = await fetch(`/api/editor/apis/endpoints/${endpointId}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({})
      });

      const result = await response.json();

      if (result.success) {
        fetchTestResults(endpointId); // Refresh test results
        alert(`Test successful! Status: ${result.data.statusCode}, Response time: ${result.data.responseTime}ms`);
      } else {
        setError(result.message || 'Failed to test endpoint');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return '#10b981';
      case 'POST': return '#3b82f6';
      case 'PUT': return '#f59e0b';
      case 'DELETE': return '#ef4444';
      case 'PATCH': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return '#10b981';
    if (statusCode >= 300 && statusCode < 400) return '#f59e0b';
    if (statusCode >= 400) return '#ef4444';
    return '#6b7280';
  };

  return (
    <div 
      className="api-manager-panel" 
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
      <h3 style={{ margin: '0 0 1rem 0' }}>API Management</h3>
      
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
        {(['apis', 'endpoints', 'tests'] as const).map((tab) => (
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
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading && activeTab !== 'tests' && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading...
        </div>
      )}

      {!loading && activeTab === 'apis' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Create New API</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>API Name</label>
              <input
                type="text"
                value={newApiName}
                onChange={(e) => setNewApiName(e.target.value)}
                placeholder="Enter API name"
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
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Description</label>
              <textarea
                value={newApiDescription}
                onChange={(e) => setNewApiDescription(e.target.value)}
                placeholder="Enter API description"
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
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Project ID</label>
                <input
                  type="number"
                  value={newApiProjectId}
                  onChange={(e) => setNewApiProjectId(e.target.value)}
                  placeholder="Project ID"
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Authentication Type</label>
                <select
                  value={newApiAuthType}
                  onChange={(e) => setNewApiAuthType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="none">None</option>
                  <option value="api_key">API Key</option>
                  <option value="oauth">OAuth</option>
                  <option value="jwt">JWT</option>
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Base URL</label>
              <input
                type="text"
                value={newApiBaseUrl}
                onChange={(e) => setNewApiBaseUrl(e.target.value)}
                placeholder="https://api.example.com"
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
              onClick={handleCreateApi}
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
              Create API
            </button>
          </div>
          
          <h4>Your APIs</h4>
          {apis.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No APIs created yet. Create your first API!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {apis.map(api => (
                <div 
                  key={api.id}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {api.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        Project: {api.projectId} • Auth: {api.authType}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedApi(api.id);
                        setActiveTab('endpoints');
                      }}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: (theme === 'dark' ? '#10b981' : theme === 'blue' ? '#10b981' : '#10b981'),
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      Endpoints
                    </button>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Base URL: {api.baseUrl}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Created: {formatDate(api.createdAt)} • Updated: {formatDate(api.updatedAt)}
                  </div>
                  {api.description && (
                    <div style={{ fontSize: '0.8rem' }}>
                      {api.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'endpoints' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Create New Endpoint</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>API</label>
              <select
                value={selectedApi || ''}
                onChange={(e) => setSelectedApi(e.target.value ? parseInt(e.target.value) : null)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              >
                <option value="">Select an API</option>
                {apis.map(api => (
                  <option key={api.id} value={api.id}>
                    {api.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Method</label>
                <select
                  value={newEndpointMethod}
                  onChange={(e) => setNewEndpointMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Path</label>
                <input
                  type="text"
                  value={newEndpointPath}
                  onChange={(e) => setNewEndpointPath(e.target.value)}
                  placeholder="/members"
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
            
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Description</label>
              <textarea
                value={newEndpointDescription}
                onChange={(e) => setNewEndpointDescription(e.target.value)}
                placeholder="Enter endpoint description"
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
            
            <button
              onClick={handleCreateEndpoint}
              disabled={!selectedApi}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: selectedApi ? (theme === 'dark' ? '#10b981' : theme === 'blue' ? '#10b981' : '#10b981') : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: selectedApi ? 'pointer' : 'not-allowed'
              }}
            >
              Create Endpoint
            </button>
          </div>
          
          <h4>API Endpoints</h4>
          {endpoints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No endpoints created yet. Select an API and create your first endpoint!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {endpoints.map(endpoint => (
                <div 
                  key={endpoint.id}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          backgroundColor: 
                            endpoint.method === 'GET' ? '#d1fae5' : 
                            endpoint.method === 'POST' ? '#dbeafe' : 
                            endpoint.method === 'PUT' ? '#fef3c7' : 
                            endpoint.method === 'DELETE' ? '#fee2e2' : 
                            endpoint.method === 'PATCH' ? '#e0e7ff' : 
                            '#e5e7eb',
                          color: 
                            endpoint.method === 'GET' ? '#065f46' : 
                            endpoint.method === 'POST' ? '#1e40af' : 
                            endpoint.method === 'PUT' ? '#d97706' : 
                            endpoint.method === 'DELETE' ? '#7f1d1d' : 
                            endpoint.method === 'PATCH' ? '#4f46e5' : 
                            '#6b7280',
                          fontWeight: 'bold',
                          marginRight: '0.5rem'
                        }}>
                          {endpoint.method}
                        </span>
                        {endpoint.path}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleTestEndpoint(endpoint.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#3b82f6' : '#3b82f6'),
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        Test
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEndpoint(endpoint.id);
                          setActiveTab('tests');
                        }}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: (theme === 'dark' ? '#8b5cf6' : theme === 'blue' ? '#8b5cf6' : '#8b5cf6'),
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        Tests
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Created: {formatDate(endpoint.createdAt)} • Updated: {formatDate(endpoint.updatedAt)}
                  </div>
                  {endpoint.description && (
                    <div style={{ fontSize: '0.8rem' }}>
                      {endpoint.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'tests' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>API Test Results</h4>
            <p style={{ marginBottom: '1rem', color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
              View test results for your API endpoints.
            </p>
          </div>
          
          {testResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No test results available. Test an endpoint to see results here!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {testResults.map(test => (
                <div 
                  key={test.id}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        Status: 
                        <span style={{ 
                          marginLeft: '0.5rem',
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          backgroundColor: 
                            test.statusCode >= 200 && test.statusCode < 300 ? '#d1fae5' : 
                            test.statusCode >= 300 && test.statusCode < 400 ? '#fef3c7' : 
                            test.statusCode >= 400 ? '#fee2e2' : 
                            '#e5e7eb',
                          color: 
                            test.statusCode >= 200 && test.statusCode < 300 ? '#065f46' : 
                            test.statusCode >= 300 && test.statusCode < 400 ? '#d97706' : 
                            test.statusCode >= 400 ? '#7f1d1d' : 
                            '#6b7280',
                          fontWeight: 'bold'
                        }}>
                          {test.statusCode}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {test.responseTime}ms
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Tested: {formatDate(test.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiManager;