import React, {useState, useEffect} from 'react';

interface PerformanceConfig {
  id: number;
  name: string;
  description?: string;
  projectId: number;
  settings: any;
  createdAt: string;
  updatedAt: string;
}

interface PerformanceMetric {
  id: number;
  configId: number;
  metricType: string;
  value: number;
  unit: string;
  timestamp: string;
  metadata: any;
}

interface PerformanceProps {
  theme: 'light' | 'dark' | 'blue';
}

const Performance: React.FC<PerformanceProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'configs' | 'metrics' | 'dashboard'>('configs');
  const [configs, setConfigs] = useState<PerformanceConfig[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for performance configs
  const [newConfigName, setNewConfigName] = useState<string>('');
  const [newConfigDescription, setNewConfigDescription] = useState<string>('');
  const [newConfigProjectId, setNewConfigProjectId] = useState<string>('1');

  // Form states for metrics
  const [newMetricConfigId, setNewMetricConfigId] = useState<string>('');
  const [newMetricProjectId, setNewMetricProjectId] = useState<string>('1');
  const [newMetricType, setNewMetricType] = useState<string>('load_time');
  const [newMetricValue, setNewMetricValue] = useState<string>('0');
  const [newMetricUnit, setNewMetricUnit] = useState<string>('ms');

  // Fetch data on initial load
  useEffect(() => {
    fetchConfigs();
    fetchMetrics();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/editor/performance/configs', {
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
        setError(result.message || 'Failed to fetch performance configs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/editor/performance/metrics?limit=10', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setMetrics(result.data);
      } else {
        setError(result.message || 'Failed to fetch performance metrics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateConfig = async () => {
    if (!newConfigName.trim() || !newConfigProjectId) {
      setError('Configuration name and project ID are required');
      return;
    }

    try {
      const response = await fetch('/api/editor/performance/configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newConfigName,
          description: newConfigDescription,
          projectId: parseInt(newConfigProjectId)
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewConfigName('');
        setNewConfigDescription('');
        setNewConfigProjectId('1');
        fetchConfigs(); // Refresh the configs list
      } else {
        setError(result.message || 'Failed to create performance config');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateMetric = async () => {
    if (!newMetricConfigId || !newMetricProjectId || !newMetricValue) {
      setError('Configuration ID, Project ID, and Value are required for performance metric');
      return;
    }

    try {
      const response = await fetch('/api/editor/performance/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          configId: parseInt(newMetricConfigId),
          projectId: parseInt(newMetricProjectId),
          metricType: newMetricType,
          value: parseFloat(newMetricValue),
          unit: newMetricUnit
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewMetricConfigId('');
        setNewMetricProjectId('1');
        setNewMetricValue('0');
        setNewMetricUnit('ms');
        fetchMetrics(); // Refresh the metrics list
      } else {
        setError(result.message || 'Failed to create performance metric');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getMetricColor = (type: string) => {
    switch (type) {
      case 'load_time': return '#3b82f6';
      case 'page_size': return '#10b981';
      case 'requests_count': return '#8b5cf6';
      case 'memory_usage': return '#f59e0b';
      default: return '#6b7280';
    }
  };


  return (
    <div
      className="performance-panel"
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Performance Monitoring</h3>

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
        {(['configs', 'metrics', 'dashboard'] as const).map((tab) => (
          <button aria-label={tab}
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
            <h4>Create New Performance Configuration</h4>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
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

          <h4>Your Performance Configurations</h4>
          {configs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No performance configurations created yet. Create your first configuration!
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
                    Project: {config.projectId}
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

      {!loading && activeTab === 'metrics' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Record New Performance Metric</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Configuration</label>
                <select
                  value={newMetricConfigId}
                  onChange={(e) => setNewMetricConfigId(e.target.value)}
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
                      {config.name} (Project {config.projectId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Project ID</label>
                <input
                  type="number"
                  value={newMetricProjectId}
                  onChange={(e) => setNewMetricProjectId(e.target.value)}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Metric Type</label>
                <select
                  value={newMetricType}
                  onChange={(e) => setNewMetricType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="load_time">Load Time</option>
                  <option value="page_size">Page Size</option>
                  <option value="requests_count">Requests Count</option>
                  <option value="memory_usage">Memory Usage</option>
                  <option value="cpu_usage">CPU Usage</option>
                  <option value="fps">Frame Rate</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Value</label>
                <input
                  type="number"
                  value={newMetricValue}
                  onChange={(e) => setNewMetricValue(e.target.value)}
                  placeholder="Value"
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Unit</label>
                <select
                  value={newMetricUnit}
                  onChange={(e) => setNewMetricUnit(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="ms">ms</option>
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                  <option value="%">%</option>
                  <option value="fps">fps</option>
                  <option value="count">count</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreateMetric}
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
              Record Metric
            </button>
          </div>

          <h4>Recent Performance Metrics</h4>
          {metrics.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No performance metrics recorded yet. Create your first metric!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {metrics.map(metric => (
                <div
                  key={metric.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: getMetricColor(metric.metricType) }}>
                        {metric.metricType.replace('_', ' ').toUpperCase()}: {metric.value} {metric.unit}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        Config: {metric.configId} • Project: {metric.metadata.projectId || 'N/A'}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                      {formatDate(metric.timestamp)}
                    </div>
                  </div>

                  {metric.metadata && Object.keys(metric.metadata).length > 0 && (
                    <div style={{ fontSize: '0.8rem', backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '4px' }}>
                      <strong>Metadata:</strong> {JSON.stringify(metric.metadata)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'dashboard' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <h4>Performance Dashboard</h4>
          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>0.89s</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Avg. Load Time</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>1.2MB</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Avg. Page Size</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#ede9fe', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>24</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Avg. Requests</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>42%</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Avg. Memory</div>
              </div>
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px'
          }}>
            <h5 style={{ marginBottom: '1rem' }}>Performance Trend</h5>
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '1rem 0' }}>
              {[0.8, 0.9, 0.7, 0.85, 0.75, 0.89, 0.82].map((value, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '20px',
                      height: `${value * 200}px`,
                      backgroundColor: '#3b82f6',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Day {index+1}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>
              Load Time Trend (Last 7 Days)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;
