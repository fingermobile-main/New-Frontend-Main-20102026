import React, {useState, useEffect} from 'react';
interface DeploymentConfig {
  id: number;
  name: string;
  description?: string;
  provider: string;
  settings: any;
  projectId: number;
  createdAt: string;
  updatedAt: string;
}

interface Deployment {
  id: number;
  configId: number;
  configName: string;
  provider: string;
  projectId: number;
  status: string;
  notes: string;
  details: string;
  createdAt: string;
  updatedAt: string;
}

interface DeploymentProps {
  theme: 'light' | 'dark' | 'blue';
}

const Deployment: React.FC<DeploymentProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'configs' | 'deployments'>('configs');
  const [configs, setConfigs] = useState<DeploymentConfig[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states for deployment configs
  const [newConfigName, setNewConfigName] = useState<string>('');
  const [newConfigDescription, setNewConfigDescription] = useState<string>('');
  const [newConfigProvider, setNewConfigProvider] = useState<string>('vercel');
  const [newConfigProjectId, setNewConfigProjectId] = useState<string>('1');
  
  // Form states for deployments
  const [newDeploymentConfigId, setNewDeploymentConfigId] = useState<string>('');
  const [newDeploymentProjectId, setNewDeploymentProjectId] = useState<string>('1');
  const [newDeploymentNotes, setNewDeploymentNotes] = useState<string>('');

  // Fetch data on initial load
  useEffect(() => {
    fetchConfigs();
    fetchDeployments();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/editor/deployment/configs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setConfigs(result.data);
      } else {
        setError(result.message || 'Failed to fetch deployment configs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeployments = async () => {
    try {
      const response = await fetch('/api/editor/deployment', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setDeployments(result.data);
      } else {
        setError(result.message || 'Failed to fetch deployments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateConfig = async () => {
    if (!newConfigName.trim() || !newConfigProvider || !newConfigProjectId) {
      setError('Configuration name, provider, and project ID are required');
      return;
    }

    try {
      const response = await fetch('/api/editor/deployment/configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newConfigName,
          description: newConfigDescription,
          provider: newConfigProvider,
          projectId: parseInt(newConfigProjectId)
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewConfigName('');
        setNewConfigDescription('');
        setNewConfigProvider('vercel');
        setNewConfigProjectId('1');
        fetchConfigs(); // Refresh the configs list
      } else {
        setError(result.message || 'Failed to create deployment config');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateDeployment = async () => {
    if (!newDeploymentConfigId || !newDeploymentProjectId) {
      setError('Configuration ID and Project ID are required for deployment');
      return;
    }

    try {
      const response = await fetch('/api/editor/deployment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          configId: parseInt(newDeploymentConfigId),
          projectId: parseInt(newDeploymentProjectId),
          notes: newDeploymentNotes
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewDeploymentConfigId('');
        setNewDeploymentProjectId('1');
        setNewDeploymentNotes('');
        fetchDeployments(); // Refresh the deployments list
      } else {
        setError(result.message || 'Failed to create deployment');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'pending': return '#3b82f6';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };


  return (
    <div 
      className="deployment-panel" 
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Deployment Management</h3>
      
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
        {(['configs', 'deployments'] as const).map((tab) => (
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

      {loading && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading...
        </div>
      )}

      {!loading && activeTab === 'configs' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Create New Deployment Configuration</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Configuration Name</label>
              <input
                type="text"
                value={newConfigName}
                onChange={(e) => setNewConfigName(e.target.value)}
                placeholder="Enter configuration name"
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
                value={newConfigDescription}
                onChange={(e) => setNewConfigDescription(e.target.value)}
                placeholder="Enter configuration description"
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Provider</label>
                <select
                  value={newConfigProvider}
                  onChange={(e) => setNewConfigProvider(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="vercel">Vercel</option>
                  <option value="netlify">Netlify</option>
                  <option value="aws">AWS</option>
                  <option value="gcp">Google Cloud</option>
                  <option value="azure">Azure</option>
                  <option value="digitalocean">DigitalOcean</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Project ID</label>
                <input
                  type="number"
                  value={newConfigProjectId}
                  onChange={(e) => setNewConfigProjectId(e.target.value)}
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
            </div>
            
            <button
              onClick={handleCreateConfig}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: (theme === 'dark' ? '#10b981' : theme === 'blue' ? '#10b981' : '#10b981'),
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Create Configuration
            </button>
          </div>
          
          <h4>Your Deployment Configurations</h4>
          {configs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No deployment configurations created yet. Create your first configuration!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {configs.map(config => (
                <div 
                  key={config.id}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {config.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Provider: {config.provider} • Project: {config.projectId}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                    Created: {formatDate(config.createdAt)} • Updated: {formatDate(config.updatedAt)}
                  </div>
                  {config.description && (
                    <div style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                      {config.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'deployments' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Create New Deployment</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Configuration</label>
                <select
                  value={newDeploymentConfigId}
                  onChange={(e) => setNewDeploymentConfigId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="">Select a configuration</option>
                  {configs.map(config => (
                    <option key={config.id} value={config.id}>
                      {config.name} ({config.provider})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Project ID</label>
                <input
                  type="number"
                  value={newDeploymentProjectId}
                  onChange={(e) => setNewDeploymentProjectId(e.target.value)}
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
            </div>
            
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Notes (Optional)</label>
              <textarea
                value={newDeploymentNotes}
                onChange={(e) => setNewDeploymentNotes(e.target.value)}
                placeholder="Enter deployment notes"
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
              onClick={handleCreateDeployment}
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
              Deploy Project
            </button>
          </div>
          
          <h4>Your Deployments</h4>
          {deployments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No deployments created yet. Create your first deployment!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {deployments.map(deployment => (
                <div 
                  key={deployment.id}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {deployment.configName} ({deployment.provider})
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        Project: {deployment.projectId} • ID: {deployment.id}
                      </div>
                    </div>
                    <div style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      backgroundColor: 
                        deployment.status === 'completed' ? '#d1fae5' : 
                        deployment.status === 'in_progress' ? '#fef3c7' : 
                        deployment.status === 'pending' ? '#dbeafe' : 
                        '#fee2e2',
                      color: 
                        deployment.status === 'completed' ? '#065f46' : 
                        deployment.status === 'in_progress' ? '#d97706' : 
                        deployment.status === 'pending' ? '#2563eb' : 
                        '#7f1d1d'
                    }}>
                      {deployment.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Created: {formatDate(deployment.createdAt)} • Updated: {formatDate(deployment.updatedAt)}
                  </div>
                  
                  {deployment.notes && (
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <strong>Notes:</strong> {deployment.notes}
                    </div>
                  )}
                  
                  {deployment.details && (
                    <div style={{ fontSize: '0.8rem', backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '4px' }}>
                      <strong>Details:</strong> {deployment.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Deployment;