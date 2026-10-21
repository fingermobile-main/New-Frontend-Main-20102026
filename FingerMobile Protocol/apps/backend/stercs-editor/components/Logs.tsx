import React, { useState, useEffect } from 'react';

interface LogEntry {
  id: number;
  memberId: number;
  membermembername: string;
  projectId: number;
  action: string;
  details: string;
  level: string;
  category: string;
  createdAt: string;
}

interface LogStats {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  debugCount: number;
  criticalCount: number;
  securityCount: number;
}

interface LogProps {
  theme: 'light' | 'dark' | 'blue';
}

const Logs: React.FC<LogProps> = ({ theme }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'logs' | 'stats'>('logs');
  const [filters, setFilters] = useState({
    projectId: '',
    level: '',
    category: '',
    action: '',
    startDate: '',
    endDate: ''
  });

  // Fetch data on initial load
  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.level) params.append('level', filters.level);
      if (filters.category) params.append('category', filters.category);
      if (filters.action) params.append('action', filters.action);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('limit', '50');

      const response = await fetch(`/api/editor/logs?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setLogs(result.data);
      } else {
        setError(result.message || 'Failed to fetch logs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/editor/logs/stats?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.message || 'Failed to fetch log stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
    fetchStats();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      case 'debug': return '#8b5cf6';
      case 'critical': return '#dc2626';
      case 'security': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'editor': return '📝';
      case 'deployment': return '🚀';
      case 'security': return '🔒';
      case 'system': return '⚙️';
      case 'member': return '👤';
      default: return '📋';
    }
  };

  return (
    <div 
      className="logs-panel" 
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Logging & Audit Trail</h3>
      
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
        {(['logs', 'stats'] as const).map((tab) => (
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

      {/* Filters */}
      <div style={{ 
        padding: '1rem', 
        backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        marginBottom: '1rem'
      }}>
        <form onSubmit={handleFilterSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Project ID</label>
            <input
              type="number"
              name="projectId"
              value={filters.projectId}
              onChange={handleFilterChange}
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
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Level</label>
            <select
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                color: theme === 'dark' ? 'white' : '#1f2937'
              }}
            >
              <option value="">All Levels</option>
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
              <option value="security">Security</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                color: theme === 'dark' ? 'white' : '#1f2937'
              }}
            >
              <option value="">All Categories</option>
              <option value="editor">Editor</option>
              <option value="deployment">Deployment</option>
              <option value="security">Security</option>
              <option value="system">System</option>
              <option value=member">Member</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
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
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
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
          
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#3b82f6' : '#3b82f6'),
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading logs...
        </div>
      )}

      {!loading && activeTab === 'logs' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 300px)' }}>
          <h4>Recent Logs</h4>
          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No logs found matching your filters.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {logs.map(log => (
                <div 
                  key={log.id}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{getCategoryIcon(log.category)}</span>
                      <div style={{ fontWeight: 'bold' }}>
                        {log.action}
                      </div>
                      <div style={{ 
                        padding: '0.125rem 0.5rem', 
                        borderRadius: '4px', 
                        backgroundColor: 
                          log.level === 'error' ? '#fee2e2' : 
                          log.level === 'warning' ? '#fef3c7' : 
                          log.level === 'info' ? '#dbeafe' : 
                          log.level === 'debug' ? '#ede9fe' :
                          log.level === 'critical' ? '#fee2e2' :
                          log.level === 'security' ? '#dcfce7' : 
                          '#e5e7eb',
                        color: 
                          log.level === 'error' ? '#7f1d1d' : 
                          log.level === 'warning' ? '#d97706' : 
                          log.level === 'info' ? '#2563eb' : 
                          log.level === 'debug' ? '#7e22ce' :
                          log.level === 'critical' ? '#7f1d1d' :
                          log.level === 'security' ? '#065f46' : 
                          '#6b7280',
                    MemberfontSize: '0.75rem'
                      }}>
                        {log.level.toUpperCase()}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {formatDate(log.createdAt)}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Member: {log.membermembername} • Project: {log.projectId}
                  </div>
                  
                  {log.details && (
                    <div style={{ fontSize: '0.8rem', backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '4px' }}>
                      <strong>Details:</strong> {log.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'stats' && stats && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 300px)' }}>
          <h4>Log Statistics</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{stats.totalLogs}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Total Logs</div>
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>{stats.errorCount}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Errors</div>
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>{stats.warningCount}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Warnings</div>
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{stats.securityCount}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Security</div>
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: '#ede9fe', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7e22ce' }}>{stats.criticalCount}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Critical</div>
            </div>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px'
          }}>
            <h5 style={{ marginBottom: '1rem' }}>Log Distribution by Level</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { level: 'Info', count: stats.infoCount, color: '#3b82f6' },
                { level: 'Debug', count: stats.debugCount, color: '#8b5cf6' },
                { level: 'Warning', count: stats.warningCount, color: '#f59e0b' },
                { level: 'Error', count: stats.errorCount, color: '#ef4444' },
                { level: 'Critical', count: stats.criticalCount, color: '#dc2626' },
                { level: 'Security', count: stats.securityCount, color: '#10b981' }
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '80px', fontSize: '0.8rem', color: '#6b7280' }}>{item.level}:</div>
                  <div style={{ flex: 1 }}>
                    <div 
                      style={{ 
                        height: '20px', 
                        backgroundColor: item.color, 
                        width: `${(item.count / (stats.totalLogs || 1)) * 100}%`,
                        maxWidth: '100%'
                      }} 
                    />
                  </div>
                  <div style={{ width: '40px', textAlign: 'right', fontSize: '0.8rem' }}>{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs;