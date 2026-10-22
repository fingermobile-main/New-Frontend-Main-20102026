import React, {useState, useEffect} from 'react';

interface MonitoringRule {
  id: number;
  name: string;
  description?: string;
  projectId: number;
  metricType: string;
  condition: string;
  threshold: number;
  evaluationWindow: number;
  alertRecipients: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MonitoringMetric {
  id: number;
  projectId: number;
  metricType: string;
  value: number;
  source: string;
  createdAt: string;
}

interface MonitoringAlert {
  id: number;
  ruleId: number;
  projectId: number;
  metricType: string;
  metricValue: number;
  threshold: number;
  condition: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface MonitoringProps {
  theme: 'light' | 'dark' | 'blue';
}

const Monitoring: React.FC<MonitoringProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'metrics' | 'alerts'>('rules');
  const [rules, setRules] = useState<MonitoringRule[]>([]);
  const [metrics, setMetrics] = useState<MonitoringMetric[]>([]);
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for creating rules
  const [newRuleName, setNewRuleName] = useState<string>('');
  const [newRuleDescription, setNewRuleDescription] = useState<string>('');
  const [newRuleProjectId, setNewRuleProjectId] = useState<string>('1');
  const [newRuleMetricType, setNewRuleMetricType] = useState<string>('response_time');
  const [newRuleCondition, setNewRuleCondition] = useState<string>('>');
  const [newRuleThreshold, setNewRuleThreshold] = useState<string>('100');
  const [newRuleEvaluationWindow, setNewRuleEvaluationWindow] = useState<string>('300');
  const [newRuleEnabled, setNewRuleEnabled] = useState<boolean>(true);

  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'rules') {
        const response = await fetch('/api/editor/monitoring/rules', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
          }
        });

        const result = await response.json();

        if (result.success) {
          setRules(result.data);
        } else {
          setError(result.message || 'Failed to fetch monitoring rules');
        }
      } else if (activeTab === 'metrics') {
        const response = await fetch('/api/editor/monitoring/metrics', {
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
          setError(result.message || 'Failed to fetch metrics');
        }
      } else if (activeTab === 'alerts') {
        const response = await fetch('/api/editor/monitoring/alerts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
          }
        });

        const result = await response.json();

        if (result.success) {
          setAlerts(result.data);
        } else {
          setError(result.message || 'Failed to fetch alerts');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async () => {
    if (!newRuleName || !newRuleProjectId || !newRuleMetricType || !newRuleCondition || newRuleThreshold === '') {
      setError('Name, Project ID, Metric Type, Condition, and Threshold are required for creating a monitoring rule');
      return;
    }

    try {
      const response = await fetch('/api/editor/monitoring/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newRuleName,
          description: newRuleDescription,
          projectId: parseInt(newRuleProjectId),
          metricType: newRuleMetricType,
          condition: newRuleCondition,
          threshold: parseFloat(newRuleThreshold),
          evaluationWindow: parseInt(newRuleEvaluationWindow),
          enabled: newRuleEnabled
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewRuleName('');
        setNewRuleDescription('');
        setNewRuleProjectId('1');
        setNewRuleMetricType('response_time');
        setNewRuleCondition('>');
        setNewRuleThreshold('100');
        setNewRuleEvaluationWindow('300');
        setNewRuleEnabled(true);
        setRules([...rules, result.data]);
        alert('Monitoring rule created successfully!');
      } else {
        setError(result.message || 'Failed to create monitoring rule');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getMetricTypeColor = (type: string) => {
    switch (type) {
      case 'response_time': return '#3b82f6';
      case 'error_rate': return '#ef4444';
      case 'cpu_usage': return '#f59e0b';
      case 'memory_usage': return '#8b5cf6';
      case 'disk_usage': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getAlertStatusColor = (status: string) => {
    switch (status) {
      case 'triggered': return '#ef4444';
      case 'acknowledged': return '#f59e0b';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };



  return (
    <div
      className="monitoring-panel"
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Monitoring & Alerts</h3>

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
        {(['rules', 'metrics', 'alerts'] as const).map((tab) => (
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

      {loading && activeTab !== 'alerts' && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading...
        </div>
      )}

      {!loading && activeTab === 'rules' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Create New Monitoring Rule</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Rule Name</label>
              <input
                type="text"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="Enter rule name"
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
                value={newRuleDescription}
                onChange={(e) => setNewRuleDescription(e.target.value)}
                placeholder="Enter rule description"
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
                  value={newRuleProjectId}
                  onChange={(e) => setNewRuleProjectId(e.target.value)}
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Metric Type</label>
                <select
                  value={newRuleMetricType}
                  onChange={(e) => setNewRuleMetricType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="response_time">Response Time (ms)</option>
                  <option value="error_rate">Error Rate (%)</option>
                  <option value="cpu_usage">CPU Usage (%)</option>
                  <option value="memory_usage">Memory Usage (%)</option>
                  <option value="disk_usage">Disk Usage (%)</option>
                  <option value="active_members">Active members</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Condition</label>
                <select
                  value={newRuleCondition}
                  onChange={(e) => setNewRuleCondition(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value=">">Greater than (&gt;)</option>
                  <option value="<">{'Less than (<)'}</option>
                  <option value=">=">Greater or equal (&gt;=)</option>
                  <option value="<=">{'Less or equal (<=)'}</option>
                  <option value="==">Equal (==)</option>
                  <option value="!=">Not equal (!=)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Threshold</label>
                <input
                  type="number"
                  value={newRuleThreshold}
                  onChange={(e) => setNewRuleThreshold(e.target.value)}
                  placeholder="Threshold value"
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Evaluation Window (s)</label>
                <input
                  type="number"
                  value={newRuleEvaluationWindow}
                  onChange={(e) => setNewRuleEvaluationWindow(e.target.value)}
                  placeholder="Time window in seconds"
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

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
              <input
                type="checkbox"
                id="enabled"
                checked={newRuleEnabled}
                onChange={(e) => setNewRuleEnabled(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor="enabled">Enabled</label>
            </div>

            <button
              onClick={handleCreateRule}
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
              Create Rule
            </button>
          </div>

          <h4>Monitoring Rules</h4>
          {rules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No monitoring rules created yet. Create your first rule!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {rules.map(rule => (
                <div
                  key={rule.id}
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
                        {rule.name}
                      </div>
                    </div>
                    <div style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: rule.enabled ? '#d1fae5' : '#fee2e2',
                      color: rule.enabled ? '#065f46' : '#7f1d1d'
                    }}>
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Project: {rule.projectId} • Type: {rule.metricType}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Condition: {rule.condition} {rule.threshold} • Window: {rule.evaluationWindow}s
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Created: {formatDate(rule.createdAt)} • Updated: {formatDate(rule.updatedAt)}
                  </div>
                  {rule.description && (
                    <div style={{ fontSize: '0.8rem' }}>
                      {rule.description}
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
          <h4>Recent Metrics</h4>
          {metrics.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No metrics recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {metrics.slice(0, 20).map(metric => (
                <div
                  key={metric.id}
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
                            metric.metricType === 'response_time' ? '#dbeafe' :
                            metric.metricType === 'error_rate' ? '#fee2e2' :
                            metric.metricType === 'cpu_usage' ? '#fef3c7' :
                            metric.metricType === 'memory_usage' ? '#e0e7ff' :
                            metric.metricType === 'disk_usage' ? '#d1fae5' :
                            '#e5e7eb',
                          color:
                            metric.metricType === 'response_time' ? '#1e40af' :
                            metric.metricType === 'error_rate' ? '#7f1d1d' :
                            metric.metricType === 'cpu_usage' ? '#d97706' :
                            metric.metricType === 'memory_usage' ? '#4f46e5' :
                            metric.metricType === 'disk_usage' ? '#065f46' :
                            '#6b7280',
                          fontWeight: 'bold',
                          marginRight: '0.5rem'
                        }}>
                          {metric.metricType}
                        </span>
                        {metric.value}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      Source: {metric.source}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Project: {metric.projectId} • Recorded: {formatDate(metric.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'alerts' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <h4>Recent Alerts</h4>
          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No alerts triggered yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {alerts.slice(0, 20).map(alert => (
                <div
                  key={alert.id}
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
                            alert.metricType === 'response_time' ? '#dbeafe' :
                            alert.metricType === 'error_rate' ? '#fee2e2' :
                            alert.metricType === 'cpu_usage' ? '#fef3c7' :
                            alert.metricType === 'memory_usage' ? '#e0e7ff' :
                            alert.metricType === 'disk_usage' ? '#d1fae5' :
                            '#e5e7eb',
                          color:
                            alert.metricType === 'response_time' ? '#1e40af' :
                            alert.metricType === 'error_rate' ? '#7f1d1d' :
                            alert.metricType === 'cpu_usage' ? '#d97706' :
                            alert.metricType === 'memory_usage' ? '#4f46e5' :
                            alert.metricType === 'disk_usage' ? '#065f46' :
                            '#6b7280',
                          fontWeight: 'bold',
                          marginRight: '0.5rem'
                        }}>
                          {alert.metricType}
                        </span>
                        Alert #{alert.id}
                      </div>
                    </div>
                    <div style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor:
                        alert.status === 'triggered' ? '#fee2e2' :
                        alert.status === 'acknowledged' ? '#fef3c7' :
                        alert.status === 'resolved' ? '#d1fae5' :
                        '#e5e7eb',
                      color:
                        alert.status === 'triggered' ? '#7f1d1d' :
                        alert.status === 'acknowledged' ? '#d97706' :
                        alert.status === 'resolved' ? '#065f46' :
                        '#6b7280'
                    }}>
                      {alert.status}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Project: {alert.projectId} • Rule: {alert.ruleId}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Value: {alert.metricValue} {alert.condition} {alert.threshold}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Triggered: {formatDate(alert.createdAt)} • Updated: {formatDate(alert.updatedAt)}
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

export default Monitoring;
