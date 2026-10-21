import React, {useState, useEffect} from 'react';
interface Integration {
  id: number;
  name: string;
  description?: string;
  type: string;
  configuration: any;
  enabled: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;

interface IntegrationStats {
  totalCalls: number;
  successRate: number;
  avgResponseTime: number;
  lastCall: string;
  callsToday: number;

interface IntegrationManagementProps {
  theme: 'light' | 'dark' | 'blue';

const IntegrationManagement: React.FC<IntegrationManagementProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'integrations' | 'settings'>('integrations');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [integrationStats, setIntegrationStats] = useState<IntegrationStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states for creating integrations
  const [newIntegrationName, setNewIntegrationName] = useState<string>('');
  const [newIntegrationDescription, setNewIntegrationDescription] = useState<string>('');
  const [newIntegrationType, setNewIntegrationType] = useState<string>('api');
  const [newIntegrationConfig, setNewIntegrationConfig] = useState<string>('');
  const [newIntegrationTags, setNewIntegrationTags] = useState<string>('');
  const [newIntegrationEnabled, setNewIntegrationEnabled] = useState<boolean>(true);

  // Fetch data on initial load
  useEffect(() => {
    fetchIntegrations();
  }, []);

  useEffect(() => {
    if (selectedIntegration) {
      fetchIntegrationStats(selectedIntegration.id);

  }, [selectedIntegration]);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/editor/integrations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setIntegrations(result.data);
       else {
        setError(result.message || 'Failed to fetch integrations');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
     finally {
      setLoading(false);


  const fetchIntegrationStats = async (integrationId: number) => {
    try {
      const response = await fetch(`/api/editor/integrations/${integrationId}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setIntegrationStats(result.data);
       else {
        setError(result.message || 'Failed to fetch integration stats');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleCreateIntegration = async () => {
    if (!newIntegrationName || !newIntegrationType) {
      setError('Integration name and type are required');
      return;

    try {
      // Try to parse the configuration JSON
      let configObj = {};
      if (newIntegrationConfig.trim()) {
        try {
          configObj = JSON.parse(newIntegrationConfig);
         catch (e) {
          setError('Invalid JSON configuration');
          return;


      const response = await fetch('/api/editor/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newIntegrationName,
          description: newIntegrationDescription,
          type: newIntegrationType,
          configuration: configObj,
          enabled: newIntegrationEnabled,
          tags: newIntegrationTags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewIntegrationName('');
        setNewIntegrationDescription('');
        setNewIntegrationType('api');
        setNewIntegrationConfig('');
        setNewIntegrationTags('');
        setNewIntegrationEnabled(true);
        setIntegrations([...integrations, result.data]);
        alert('Integration created successfully!');
       else {
        setError(result.message || 'Failed to create integration');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleTestIntegration = async (integrationId: number) => {
    try {
      const response = await fetch(`/api/editor/integrations/${integrationId}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        alert(`Integration test successful: ${result.data.message}`);
       else {
        setError(result.message || 'Integration test failed');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'api': return '#3b82f6';
      case 'webhook': return '#8b5cf6';
      case 'oauth': return '#ef4444';
      case 'database': return '#10b981';
      case 'email': return '#f59e0b';
      default: return '#6b7280';


  return (
    <div 
      className="integration-management-panel" 
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Integration Management</h3>
      
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
          onClick={() => setActiveTab('integrations')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'integrations' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
            color: theme === 'dark' ? 'white' : '#1f2937',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'integrations' ? 'bold' : 'normal'
          }}
        >
          Integrations
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'settings' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
            color: theme === 'dark' ? 'white' : '#1f2937',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'settings' ? 'bold' : 'normal'
          }}
        >
          Settings
        </button>
      </div>

      {loading && activeTab === 'integrations' && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading...
        </div>
      )}

      {!loading && activeTab === 'integrations' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Create New Integration</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Integration Name</label>
              <input
                type="text"
                value={newIntegrationName}
                onChange={(e) => setNewIntegrationName(e.target.value)}
                placeholder="Enter integration name"
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
                value={newIntegrationDescription}
                onChange={(e) => setNewIntegrationDescription(e.target.value)}
                placeholder="Enter integration description"
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Integration Type</label>
                <select
                  value={newIntegrationType}
                  onChange={(e) => setNewIntegrationType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="api">API</option>
                  <option value="webhook">Webhook</option>
                  <option value="oauth">OAuth</option>
                  <option value="database">Database</option>
                  <option value="email">Email</option>
                  <option value="payment">Payment</option>
                  <option value="storage">Storage</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Tags (comma separated)</label>
                <input
                  type="text"
                  value={newIntegrationTags}
                  onChange={(e) => setNewIntegrationTags(e.target.value)}
                  placeholder="e.g., external, critical, monitoring"
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
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Configuration (JSON)</label>
              <textarea
                value={newIntegrationConfig}
                onChange={(e) => setNewIntegrationConfig(e.target.value)}
                placeholder='{"apiKey": "your-key", "url": "https://api.example.com"}'
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937',
                  minHeight: '100px',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
              <input
                type="checkbox"
                id="enabled"
                checked={newIntegrationEnabled}
                onChange={(e) => setNewIntegrationEnabled(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor="enabled">Enabled</label>
            </div>
            
            <button
              onClick={handleCreateIntegration}
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
              Create Integration
            </button>
          </div>
          
          <h4>Your Integrations</h4>
          {integrations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No integrations created yet. Create your first integration!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {integrations.map(integration => (
                <div 
                  key={integration.id}
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
                        {integration.name}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleTestIntegration(integration.id)}
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
                        Test
                      </button>
                      <button
                        onClick={() => setSelectedIntegration(integration)}
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
                        View
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <div>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        backgroundColor: 
                          integration.type === 'api' ? '#dbeafe' : 
                          integration.type === 'webhook' ? '#e0e7ff' : 
                          integration.type === 'oauth' ? '#fee2e2' : 
                          integration.type === 'database' ? '#d1fae5' : 
                          integration.type === 'email' ? '#fef3c7' : 
                          integration.type === 'payment' ? '#ddd6fe' : 
                          integration.type === 'storage' ? '#fde68a' : 
                          '#e5e7eb',
                        color: 
                          integration.type === 'api' ? '#1e40af' : 
                          integration.type === 'webhook' ? '#4f46e5' : 
                          integration.type === 'oauth' ? '#7f1d1d' : 
                          integration.type === 'database' ? '#065f46' : 
                          integration.type === 'email' ? '#d97706' : 
                          integration.type === 'payment' ? '#7e22ce' : 
                          integration.type === 'storage' ? '#92400e' : 
                          '#6b7280',
                        fontWeight: 'bold',
                        marginRight: '0.5rem'
                      }}>
                        {integration.type}
                      </span>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        backgroundColor: integration.enabled ? '#d1fae5' : '#fee2e2',
                        color: integration.enabled ? '#065f46' : '#7f1d1d'
                      }}>
                        {integration.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Created: {formatDate(integration.createdAt)} • Updated: {formatDate(integration.updatedAt)}
                  </div>
                  {integration.description && (
                    <div style={{ fontSize: '0.8rem' }}>
                      {integration.description}
                    </div>
                  )}
                  {integration.tags && integration.tags.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      {integration.tags.map((tag, index) => (
                        <span 
                          key={index}
                          style={{ 
                            display: 'inline-block', 
                            padding: '0.25rem 0.5rem', 
                            marginRight: '0.25rem', 
                            marginBottom: '0.25rem',
                            backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem' 
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'settings' && selectedIntegration && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4>Integration Details: {selectedIntegration.name}</h4>
              <button
                onClick={() => handleTestIntegration(selectedIntegration.id)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#3b82f6' : '#3b82f6'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Test Connection
              </button>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h5>Configuration</h5>
              <pre style={{ 
                padding: '1rem', 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb', 
                borderRadius: '4px', 
                overflowX: 'auto',
                fontSize: '0.8rem',
                color: theme === 'dark' ? '#d1d5db' : '#374151'
              }}>
                {JSON.stringify(selectedIntegration.configuration, null, 2)}
              </pre>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#eff6ff' : '#f9fafb',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getTypeColor(selectedIntegration.type) }}>
                  {integrationStats?.totalCalls || 0}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  Total Calls
                </div>
              </div>
              
              <div style={{ 
                padding: '1rem', 
                backgroundColor: theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#eff6ff' : '#f9fafb',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: integrationStats?.successRate && integrationStats.successRate > 95 ? '#10b981' : '#ef4444' }}>
                  {integrationStats?.successRate || 0}%
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  Success Rate
                </div>
              </div>
              
              <div style={{ 
                padding: '1rem', 
                backgroundColor: theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#eff6ff' : '#f9fafb',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getTypeColor(selectedIntegration.type) }}>
                  {integrationStats?.avgResponseTime || 0}ms
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  Avg Response Time
                </div>
              </div>
              
              <div style={{ 
                padding: '1rem', 
                backgroundColor: theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#eff6ff' : '#f9fafb',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getTypeColor(selectedIntegration.type) }}>
                  {integrationStats?.callsToday || 0}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  Calls Today
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <h5>Recent Activity</h5>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb', 
                borderRadius: '4px', 
                fontSize: '0.9rem',
                color: theme === 'dark' ? '#d1d5db' : '#374151'
              }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>Last Call:</span> {integrationStats?.lastCall ? formatDate(integrationStats.lastCall) : 'No data'}
                </div>
                <div>
                  <span style={{ fontWeight: 'bold' }}>Status:</span> {integrationStats?.successRate && integrationStats.successRate > 95 ? 'Healthy' : 'Needs Attention'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && activeTab === 'settings' && !selectedIntegration && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
          <h4>Select an integration to view its details</h4>
          <p style={{ marginTop: '1rem' }}>Choose an integration from the "Integrations" tab to view its settings and statistics here.</p>
        </div>
      )}
    </div>
  );
export default IntegrationManagement;