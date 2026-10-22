import React, {useState, useEffect} from 'react';
interface SecurityPolicy {
  id: number;
  name: string;
  description?: string;
  settings: any;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FirewallRule {
  id: number;
  name: string;
  description?: string;
  sourceIp: string;
  destinationIp: string | null;
  protocol: string;
  port: number | null;
  action: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SecurityEvent {
  id: number;
  eventType: string;
  eventData: any;
  severity: string;
  createdAt: string;
}

interface SecurityProps {
  theme: 'light' | 'dark' | 'blue';
}

const Security: React.FC<SecurityProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'policies' | 'firewall' | 'events'>('policies');
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [newPolicyName, setNewPolicyName] = useState<string>('');
  const [newPolicyDescription, setNewPolicyDescription] = useState<string>('');
  const [newPolicyEnabled, setNewPolicyEnabled] = useState<boolean>(true);
  const [newRuleName, setNewRuleName] = useState<string>('');
  const [newRuleDescription, setNewRuleDescription] = useState<string>('');
  const [newRuleSourceIp, setNewRuleSourceIp] = useState<string>('');
  const [newRuleDestinationIp, setNewRuleDestinationIp] = useState<string>('');
  const [newRuleProtocol, setNewRuleProtocol] = useState<string>('any');
  const [newRulePort, setNewRulePort] = useState<string>('');
  const [newRuleAction, setNewRuleAction] = useState<string>('allow');

  // Fetch data on initial load
  useEffect(() => {
    fetchPolicies();
    fetchFirewallRules();
    fetchSecurityEvents();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/security/policies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setPolicies(result.data);
      } else {
        setError(result.message || 'Failed to fetch policies');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchFirewallRules = async () => {
    try {
      const response = await fetch('/api/security/firewall-rules', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setFirewallRules(result.data);
      } else {
        setError(result.message || 'Failed to fetch firewall rules');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchSecurityEvents = async () => {
    try {
      const response = await fetch('/api/security/events?limit=10', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setSecurityEvents(result.data);
      } else {
        setError(result.message || 'Failed to fetch security events');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreatePolicy = async () => {
    if (!newPolicyName.trim()) {
      setError('Policy name is required');
      return;
    }

    try {
      const response = await fetch('/api/security/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newPolicyName,
          description: newPolicyDescription,
          enabled: newPolicyEnabled
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewPolicyName('');
        setNewPolicyDescription('');
        setNewPolicyEnabled(true);
        fetchPolicies(); // Refresh the policies list
      } else {
        setError(result.message || 'Failed to create policy');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateFirewallRule = async () => {
    if (!newRuleName.trim() || !newRuleSourceIp.trim() || !newRuleAction.trim()) {
      setError('Rule name, source IP, and action are required');
      return;
    }

    try {
      const response = await fetch('/api/security/firewall-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newRuleName,
          description: newRuleDescription,
          sourceIp: newRuleSourceIp,
          destinationIp: newRuleDestinationIp || null,
          protocol: newRuleProtocol,
          port: newRulePort ? parseInt(newRulePort) : null,
          action: newRuleAction,
          enabled: true
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewRuleName('');
        setNewRuleDescription('');
        setNewRuleSourceIp('');
        setNewRuleDestinationIp('');
        setNewRuleProtocol('any');
        setNewRulePort('');
        setNewRuleAction('allow');
        fetchFirewallRules(); // Refresh the firewall rules list
      } else {
        setError(result.message || 'Failed to create firewall rule');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const togglePolicy = async (policyId: number, currentEnabled: boolean) => {
    const policy = policies.find(p => p.id === policyId);
    if (!policy) return;

    try {
      const response = await fetch(`/api/security/policies/${policyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          ...policy,
          enabled: !currentEnabled
        })
      });

      const result = await response.json();

      if (result.success) {
        setPolicies(policies.map(p => 
          p.id === policyId ? { ...p, enabled: !currentEnabled } : p
        ));
      } else {
        setError(result.message || 'Failed to update policy');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const toggleFirewallRule = async (ruleId: number, currentEnabled: boolean) => {
    const rule = firewallRules.find(r => r.id === ruleId);
    if (!rule) return;

    try {
      const response = await fetch(`/api/security/firewall-rules/${ruleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          ...rule,
          enabled: !currentEnabled
        })
      });

      const result = await response.json();

      if (result.success) {
        setFirewallRules(firewallRules.map(r => 
          r.id === ruleId ? { ...r, enabled: !currentEnabled } : r
        ));
      } else {
        setError(result.message || 'Failed to update firewall rule');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };


  return (
    <div 
      className="security-panel" 
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Security Management</h3>
      
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
        {(['policies', 'firewall', 'events'] as const).map((tab) => (
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

      {!loading && activeTab === 'policies' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Create New Security Policy</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Policy Name</label>
              <input
                type="text"
                value={newPolicyName}
                onChange={(e) => setNewPolicyName(e.target.value)}
                placeholder="Enter policy name"
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
                value={newPolicyDescription}
                onChange={(e) => setNewPolicyDescription(e.target.value)}
                placeholder="Enter policy description"
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
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
              <input
                type="checkbox"
                id="policyEnabled"
                checked={newPolicyEnabled}
                onChange={(e) => setNewPolicyEnabled(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor="policyEnabled" style={{ margin: 0 }}>
                Enabled
              </label>
            </div>
            
            <button
              onClick={handleCreatePolicy}
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
              Create Policy
            </button>
          </div>
          
          <h4>Your Security Policies</h4>
          {policies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No security policies created yet. Create your first policy!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {policies.map(policy => (
                <div 
                  key={policy.id}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {policy.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      Created: {formatDate(policy.createdAt)} • Updated: {formatDate(policy.updatedAt)}
                    </div>
                    {policy.description && (
                      <div style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                        {policy.description}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      backgroundColor: policy.enabled ? '#d1fae5' : '#fee2e2',
                      color: policy.enabled ? '#065f46' : '#7f1d1d'
                    }}>
                      {policy.enabled ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => togglePolicy(policy.id, policy.enabled)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: (theme === 'dark' ? '#6b7280' : theme === 'blue' ? '#6b7280' : '#6b7280'),
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      {policy.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'firewall' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Create New Firewall Rule</h4>
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Source IP</label>
                <input
                  type="text"
                  value={newRuleSourceIp}
                  onChange={(e) => setNewRuleSourceIp(e.target.value)}
                  placeholder="e.g., 192.168.1.0/24"
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Destination IP (Optional)</label>
                <input
                  type="text"
                  value={newRuleDestinationIp}
                  onChange={(e) => setNewRuleDestinationIp(e.target.value)}
                  placeholder="e.g., 10.0.0.0/8"
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
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Protocol</label>
                <select
                  value={newRuleProtocol}
                  onChange={(e) => setNewRuleProtocol(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="any">Any</option>
                  <option value="tcp">TCP</option>
                  <option value="udp">UDP</option>
                  <option value="icmp">ICMP</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Port (Optional)</label>
                <input
                  type="text"
                  value={newRulePort}
                  onChange={(e) => setNewRulePort(e.target.value)}
                  placeholder="e.g., 80, 443, 8080"
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
            
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Action</label>
                <select
                  value={newRuleAction}
                  onChange={(e) => setNewRuleAction(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="allow">Allow</option>
                  <option value="deny">Deny</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleCreateFirewallRule}
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
              Create Firewall Rule
            </button>
          </div>
          
          <h4>Your Firewall Rules</h4>
          {firewallRules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No firewall rules created yet. Create your first rule!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {firewallRules.map(rule => (
                <div 
                  key={rule.id}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {rule.name} <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>({rule.action.toUpperCase()})</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {rule.sourceIp} → {rule.destinationIp || 'Any IP'} • {rule.protocol.toUpperCase()} 
                      {rule.port ? `:${rule.port}` : ''}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Created: {formatDate(rule.createdAt)} • Updated: {formatDate(rule.updatedAt)}
                    </div>
                    {rule.description && (
                      <div style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                        {rule.description}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      backgroundColor: rule.enabled ? '#d1fae5' : '#fee2e2',
                      color: rule.enabled ? '#065f46' : '#7f1d1d'
                    }}>
                      {rule.enabled ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => toggleFirewallRule(rule.id, rule.enabled)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: (theme === 'dark' ? '#6b7280' : theme === 'blue' ? '#6b7280' : '#6b7280'),
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      {rule.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'events' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <h4>Recent Security Events</h4>
          {securityEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No security events recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {securityEvents.map(event => (
                <div 
                  key={event.id}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 'bold', color: getSeverityColor(event.severity) }}>
                      {event.eventType}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {formatDate(event.createdAt)}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Severity: <span style={{ fontWeight: 'bold', color: getSeverityColor(event.severity) }}>{event.severity}</span>
                  </div>
                  {event.eventData && (
                    <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '4px', overflowX: 'auto' }}>
                      {JSON.stringify(event.eventData, null, 2)}
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

export default Security;