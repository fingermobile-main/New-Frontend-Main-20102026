import React, {useState, useEffect} from 'react';
interface AnalyticsEvent {
  id: number;
  memberId: number;
  projectId: number;
  pageId: number | null;
  eventType: string;
  eventData: any;
  createdAt: string;

interface AnalyticsDashboard {
  id: number;
  name: string;
  description?: string;
  widgets: any[];
  filters: any;
  createdAt: string;
  updatedAt: string;

interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  topPages: Array<{ pageId: number; viewCount: number }>;
  eventsByType: Array<{ eventType: string; count: number }>;
  eventsByDate: Array<{ date: string; count: number }>;

interface AnalyticsProps {
  theme: 'light' | 'dark' | 'blue';

const Analytics: React.FC<AnalyticsProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'dashboards'>('overview');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [dashboards, setDashboards] = useState<AnalyticsDashboard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('1'); // Default to project 1
  
  // Form states for dashboard creation
  const [newDashboardName, setNewDashboardName] = useState<string>('');
  const [newDashboardDescription, setNewDashboardDescription] = useState<string>('');

  // Fetch analytics data on initial load and when project changes
  useEffect(() => {
    fetchAnalyticsSummary();
    fetchAnalyticsEvents();
    fetchDashboards();
  }, [selectedProjectId]);

  const fetchAnalyticsSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/projects/${selectedProjectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setSummary(result.data);
       else {
        setError(result.message || 'Failed to fetch analytics summary');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
     finally {
      setLoading(false);


  const fetchAnalyticsEvents = async () => {
    try {
      const response = await fetch(`/api/analytics/projects/${selectedProjectId}/events?limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setEvents(result.data);
       else {
        setError(result.message || 'Failed to fetch analytics events');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const fetchDashboards = async () => {
    try {
      const response = await fetch('/api/analytics/dashboards', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setDashboards(result.data);
       else {
        setError(result.message || 'Failed to fetch dashboards');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleCreateDashboard = async () => {
    if (!newDashboardName.trim()) {
      setError('Dashboard name is required');
      return;

    try {
      const response = await fetch('/api/analytics/dashboards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newDashboardName,
          description: newDashboardDescription,
          widgets: [],
          filters: {}
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewDashboardName('');
        setNewDashboardDescription('');
        fetchDashboards(); // Refresh the dashboards list
       else {
        setError(result.message || 'Failed to create dashboard');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();

  return (
    <div 
      className="analytics-panel" 
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Analytics & Reporting</h3>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Project:</label>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
            color: theme === 'dark' ? 'white' : '#1f2937'
          }}
        >
          <option value="1">STERCS Demo Project</option>
          <option value="2">Business Website</option>
          <option value="3">Portfolio Site</option>
        </select>
      </div>
      
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
        {(['overview', 'events', 'dashboards'] as const).map((tab) => (
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
          Loading analytics...
        </div>
      )}

      {!loading && activeTab === 'overview' && summary && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: theme === 'dark' ? 'white' : '#1f2937' }}>Total Page Views</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {summary.totalPageViews}
              </div>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: theme === 'dark' ? 'white' : '#1f2937' }}>Unique Visitors</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                {summary.uniqueVisitors}
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: theme === 'dark' ? 'white' : '#1f2937' }}>Top Pages</h4>
            <div style={{ 
              backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '0.75rem'
            }}>
              {summary.topPages.length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {summary.topPages.map((page, index) => (
                    <li key={index} style={{ padding: '0.5rem 0', borderBottom: index < summary.topPages.length- 1 ? '1px solid #e5e7eb' : 'none' }}>
                      <span style={{ fontWeight: 'bold' }}>Page {page.pageId}</span> - {page.viewCount} views
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                  No page data available
                </div>
              )}
            </div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: theme === 'dark' ? 'white' : '#1f2937' }}>Events by Type</h4>
            <div style={{ 
              backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '0.75rem'
            }}>
              {summary.eventsByType.length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {summary.eventsByType.map((event, index) => (
                    <li key={index} style={{ padding: '0.5rem 0', borderBottom: index < summary.eventsByType.length- 1 ? '1px solid #e5e7eb' : 'none' }}>
                      <span style={{ fontWeight: 'bold' }}>{event.eventType}</span> - {event.count} occurrences
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                  No event data available
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: theme === 'dark' ? 'white' : '#1f2937' }}>Page Views by Date (Last 30 Days)</h4>
            <div style={{ 
              backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '0.75rem'
            }}>
              {summary.eventsByDate.length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {summary.eventsByDate.map((day, index) => (
                    <li key={index} style={{ padding: '0.5rem 0', borderBottom: index < summary.eventsByDate.length- 1 ? '1px solid #e5e7eb' : 'none' }}>
                      <span style={{ fontWeight: 'bold', display: 'inline-block', width: '100px' }}>{day.date}</span> 
                      <span>{day.count} views</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                  No date data available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!loading && activeTab === 'events' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: theme === 'dark' ? 'white' : '#1f2937' }}>Recent Analytics Events</h4>
          <div style={{ 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            padding: '0.75rem'
          }}>
            {events.length > 0 ? (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {events.map((event, index) => (
                  <li key={event.id} style={{ padding: '0.75rem', borderBottom: index < events.length- 1 ? '1px solid #e5e7eb' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{event.eventType}</span>
                        {event.pageId && <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>Page {event.pageId}</span>}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {formatDateTime(event.createdAt)}
                      </div>
                    </div>
                    {event.eventData && (
                      <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: '#6b7280' }}>
                        {JSON.stringify(event.eventData)}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                No recent events available
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && activeTab === 'dashboards' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Create New Dashboard</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Dashboard Name</label>
              <input
                type="text"
                value={newDashboardName}
                onChange={(e) => setNewDashboardName(e.target.value)}
                placeholder="Enter dashboard name"
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
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Description (Optional)</label>
              <textarea
                value={newDashboardDescription}
                onChange={(e) => setNewDashboardDescription(e.target.value)}
                placeholder="Enter dashboard description"
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
              onClick={handleCreateDashboard}
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
              Create Dashboard
            </button>
          </div>
          
          <h4>Your Dashboards</h4>
          {dashboards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No dashboards created yet. Create your first dashboard!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {dashboards.map(dashboard => (
                <div 
                  key={dashboard.id}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {dashboard.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Created: {formatDate(dashboard.createdAt)} • Updated: {formatDate(dashboard.updatedAt)}
                  </div>
                  {dashboard.description && (
                    <div style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                      {dashboard.description}
                    </div>
                  )}
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' : '#3b82f6'),
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      View
                    </button>
                    <button
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: (theme === 'dark' ? '#6b7280' : theme === 'blue' : '#6b7280'),
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
export default Analytics;