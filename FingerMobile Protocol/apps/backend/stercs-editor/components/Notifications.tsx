import React, {useState, useEffect} from 'react';

interface Notification {
  id: number;
  senderId: number;
  sendermembername: string | null;
  recipientId: number;
  projectId: number | null;
  title: string;
  message: string;
  type: string;
  priority: string;
  isRead: boolean;
  readAt: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

interface NotificationProps {
  theme: 'light' | 'dark' | 'blue';
}

const Notifications: React.FC<NotificationProps> = ({ theme }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose' | 'stats'>('inbox');
  const [filters, setFilters] = useState({
    type: '',
    priority: '',
    isRead: '',
    projectId: ''
  });

  // Compose form state
  const [composeData, setComposeData] = useState({
    recipientId: '',
    projectId: '',
    title: '',
    message: '',
    type: 'info',
    priority: 'normal'
  });

  // Fetch data on initial load
  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.type) params.append('type', filters.type);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.isRead) params.append('readStatus', filters.isRead);
      if (filters.projectId) params.append('projectId', filters.projectId);

      const response = await fetch(`/api/editor/notifications?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setNotifications(result.data);
      } else {
        setError(result.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/editor/notifications/stats', {
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
        setError(result.message || 'Failed to fetch notification stats');
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
    fetchNotifications();
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/editor/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        // Update the notification in the list
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          )
        );
        fetchStats(); // Refresh stats
      } else {
        setError(result.message || 'Failed to mark notification as read');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/editor/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        // Update all notifications as read
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
        );
        fetchStats(); // Refresh stats
      } else {
        setError(result.message || 'Failed to mark all notifications as read');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/editor/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        // Remove the notification from the list
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        fetchStats(); // Refresh stats
      } else {
        setError(result.message || 'Failed to delete notification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleComposeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setComposeData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/editor/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          recipientId: parseInt(composeData.recipientId),
          projectId: composeData.projectId ? parseInt(composeData.projectId) : null,
          title: composeData.title,
          message: composeData.message,
          type: composeData.type,
          priority: composeData.priority
        })
      });

      const result = await response.json();

      if (result.success) {
        // Reset form
        setComposeData({
          recipientId: '',
          projectId: '',
          title: '',
          message: '',
          type: 'info',
          priority: 'normal'
        });
        alert('Notification sent successfully!');
      } else {
        setError(result.message || 'Failed to send notification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      case 'success': return '#10b981';
      case 'alert': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <span style={{
          padding: '0.125rem 0.25rem',
          borderRadius: '4px',
          backgroundColor: '#fee2e2',
          color: '#7f1d1d',
          fontSize: '0.7rem'
        }}>CRITICAL</span>;
      case 'high':
        return <span style={{
          padding: '0.125rem 0.25rem',
          borderRadius: '4px',
          backgroundColor: '#fef3c7',
          color: '#d97706',
          fontSize: '0.7rem'
        }}>HIGH</span>;
      case 'normal':
        return <span style={{
          padding: '0.125rem 0.25rem',
          borderRadius: '4px',
          backgroundColor: '#dbeafe',
          color: '#2563eb',
          fontSize: '0.7rem'
        }}>NORMAL</span>;
      case 'low':
        return <span style={{
          padding: '0.125rem 0.25rem',
          borderRadius: '4px',
          backgroundColor: '#dcfce7',
          color: '#065f46',
          fontSize: '0.7rem'
        }}>LOW</span>;
      default:
        return <span style={{
          padding: '0.125rem 0.25rem',
          borderRadius: '4px',
          backgroundColor: '#e5e7eb',
          color: '#6b7280',
          fontSize: '0.7rem'
        }}>{priority.toUpperCase()}</span>;
    }
  };



  return (
    <div
      className="notifications-panel"
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Notifications</h3>

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
        {(['inbox', 'compose', 'stats'] as const).map((tab) => (
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

      {loading && activeTab !== 'compose' && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading notifications...
        </div>
      )}

      {!loading && activeTab === 'inbox' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          {/* Filters */}
          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <form onSubmit={handleFilterSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Type</label>
                <select
                  name="type"
                  value={filters.type}
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
                  <option value="">All Types</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="alert">Alert</option>
                  <option value="success">Success</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Priority</label>
                <select
                  name="priority"
                  value={filters.priority}
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
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Read Status</label>
                <select
                  name="isRead"
                  value={filters.isRead}
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
                  <option value="">All Statuses</option>
                  <option value="true">Read</option>
                  <option value="false">Unread</option>
                </select>
              </div>

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

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: (theme === 'dark' ? '#10b981' : theme === 'blue' ? '#10b981' : '#10b981'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Mark All as Read
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4>Inbox</h4>
            {stats && (
              <div style={{ fontSize: '0.9rem' }}>
                <span style={{ color: '#6b7280' }}>Unread: </span>
                <span style={{ fontWeight: 'bold', color: theme === 'dark' ? 'white' : '#1f2937' }}>
                  {stats.unread_count || 0}
                </span>
              </div>
            )}
          </div>

          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No notifications found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: notification.isRead
                      ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white')
                      : (theme === 'dark' ? '#2d3748' : theme === 'blue' ? '#bfdbfe' : '#dbeafe'),
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    position: 'relative'
                  }}
                >
                  {!notification.isRead && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6'
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 'bold', color: getTypeColor(notification.type) }}>
                        {notification.title}
                      </div>
                      {getPriorityBadge(notification.priority)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                    {notification.message}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    {notification.sendermembername ? `From: ${notification.sendermembername}` : 'From: System'}
                    {notification.projectId && ` • Project: ${notification.projectId}`}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
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
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: (theme === 'dark' ? '#ef4444' : theme === 'blue' ? '#ef4444' : '#ef4444'),
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'compose' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <h4>Send New Notification</h4>
          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px'
          }}>
            <form onSubmit={handleSendNotification} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Recipient ID</label>
                <input
                  type="number"
                  name="recipientId"
                  value={composeData.recipientId}
                  onChange={handleComposeChange}
                  placeholder="Recipient ID"
                  required
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Project ID (Optional)</label>
                <input
                  type="number"
                  name="projectId"
                  value={composeData.projectId}
                  onChange={handleComposeChange}
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Title</label>
                <input
                  type="text"
                  name="title"
                  value={composeData.title}
                  onChange={handleComposeChange}
                  placeholder="Notification title"
                  required
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Message</label>
                <textarea
                  name="message"
                  value={composeData.message}
                  onChange={handleComposeChange}
                  placeholder="Notification message"
                  required
                  rows={4}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Type</label>
                  <select
                    name="type"
                    value={composeData.type}
                    onChange={handleComposeChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                      color: theme === 'dark' ? 'white' : '#1f2937'
                    }}
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="alert">Alert</option>
                    <option value="success">Success</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Priority</label>
                  <select
                    name="priority"
                    value={composeData.priority}
                    onChange={handleComposeChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                      color: theme === 'dark' ? 'white' : '#1f2937'
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  padding: '0.75rem',
                  backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#3b82f6' : '#3b82f6'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Send Notification
              </button>
            </form>
          </div>
        </div>
      )}

      {!loading && activeTab === 'stats' && stats && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <h4>Notification Statistics</h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{stats.total_notifications}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Total</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.unread_count}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Unread</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.info_count}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Info</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.error_count}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Errors</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#ede9fe', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>{stats.alert_count}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Alerts</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#fffbeb', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.warning_count}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Warnings</div>
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px'
          }}>
            <h5 style={{ marginBottom: '1rem' }}>Notification Distribution</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { type: 'Info', count: stats.info_count, color: '#3b82f6' },
                { type: 'Warning', count: stats.warning_count, color: '#f59e0b' },
                { type: 'Error', count: stats.error_count, color: '#ef4444' },
                { type: 'Alert', count: stats.alert_count, color: '#8b5cf6' }
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '80px', fontSize: '0.8rem', color: '#6b7280' }}>{item.type}:</div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        height: '20px',
                        backgroundColor: item.color,
                        width: `${(item.count / (stats.total_notifications || 1)) * 100}%`,
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

export default Notifications;
