import React, {useState, useEffect} from 'react';
interface TestConfig {
  id: number;
  name: string;
  description?: string;
  projectId: number;
  testType: string;
  testFramework: string;
  testFiles: string[];
  environment: string;
  schedule: string | null;
  createdAt: string;
  updatedAt: string;

interface TestRun {
  id: number;
  configId: number;
  configName: string;
  testType: string;
  testFramework: string;
  projectId: number;
  status: string;
  notes: string;
  results: any;
  createdAt: string;
  updatedAt: string;

interface TestingProps {
  theme: 'light' | 'dark' | 'blue';

const Testing: React.FC<TestingProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'configs' | 'runs' | 'results'>('configs');
  const [configs, setConfigs] = useState<TestConfig[]>([]);
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states for test configs
  const [newConfigName, setNewConfigName] = useState<string>('');
  const [newConfigDescription, setNewConfigDescription] = useState<string>('');
  const [newConfigProjectId, setNewConfigProjectId] = useState<string>('1');
  const [newConfigTestType, setNewConfigTestType] = useState<string>('unit');
  const [newConfigTestFramework, setNewConfigTestFramework] = useState<string>('jest');
  const [newConfigEnvironment, setNewConfigEnvironment] = useState<string>('development');
  const [newConfigSchedule, setNewConfigSchedule] = useState<string>('');
  const [newConfigTestFiles, setNewConfigTestFiles] = useState<string>('');
  
  // Form states for test runs
  const [newTestRunConfigId, setNewTestRunConfigId] = useState<string>('');
  const [newTestRunProjectId, setNewTestRunProjectId] = useState<string>('1');
  const [newTestRunNotes, setNewTestRunNotes] = useState<string>('');

  // Fetch data on initial load
  useEffect(() => {
    fetchConfigs();
    fetchTestRuns();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/editor/testing/configs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setConfigs(result.data);
       else {
        setError(result.message || 'Failed to fetch test configs');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
     finally {
      setLoading(false);


  const fetchTestRuns = async () => {
    try {
      const response = await fetch('/api/editor/testing/runs?limit=10', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setTestRuns(result.data);
       else {
        setError(result.message || 'Failed to fetch test runs');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleCreateConfig = async () => {
    if (!newConfigName.trim() || !newConfigProjectId || !newConfigTestType || !newConfigTestFramework) {
      setError('Configuration name, project ID, test type, and test framework are required');
      return;

    try {
      const response = await fetch('/api/editor/testing/configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newConfigName,
          description: newConfigDescription,
          projectId: parseInt(newConfigProjectId),
          testType: newConfigTestType,
          testFramework: newConfigTestFramework,
          testFiles: newConfigTestFiles.split(',').map(f => f.trim()).filter(f => f),
          environment: newConfigEnvironment,
          schedule: newConfigSchedule || null
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewConfigName('');
        setNewConfigDescription('');
        setNewConfigProjectId('1');
        setNewConfigTestType('unit');
        setNewConfigTestFramework('jest');
        setNewConfigEnvironment('development');
        setNewConfigSchedule('');
        setNewConfigTestFiles('');
        fetchConfigs(); // Refresh the configs list
       else {
        setError(result.message || 'Failed to create test config');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleCreateTestRun = async () => {
    if (!newTestRunConfigId || !newTestRunProjectId) {
      setError('Configuration ID and Project ID are required for test run');
      return;

    try {
      const response = await fetch('/api/editor/testing/runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          configId: parseInt(newTestRunConfigId),
          projectId: parseInt(newTestRunProjectId),
          notes: newTestRunNotes
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewTestRunConfigId('');
        setNewTestRunProjectId('1');
        setNewTestRunNotes('');
        fetchTestRuns(); // Refresh the test runs list
       else {
        setError(result.message || 'Failed to create test run');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'running': return '#f59e0b';
      case 'pending': return '#3b82f6';
      case 'failed': return '#ef4444';
      case 'cancelled': return '#6b7280';
      default: return '#6b7280';


  const getTestTypeIcon = (testType: string) => {
    switch (testType) {
      case 'unit': return '.UnitTesting';
      case 'integration': return 'Integration';
      case 'e2e': return 'E2E';
      case 'performance': return 'Performance';
      case 'security': return 'Security';
      default: return testType;


  return (
    <div 
      className="testing-panel" 
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Testing Framework</h3>
      
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
        {(['configs', 'runs', 'results'] as const).map((tab) => (
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
            <h4>Create New Test Configuration</h4>
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
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Test Type</label>
                <select
                  value={newConfigTestType}
                  onChange={(e) => setNewConfigTestType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="unit">Unit Tests</option>
                  <option value="integration">Integration Tests</option>
                  <option value="e2e">End-to-End Tests</option>
                  <option value="performance">Performance Tests</option>
                  <option value="security">Security Tests</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Test Framework</label>
                <select
                  value={newConfigTestFramework}
                  onChange={(e) => setNewConfigTestFramework(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="jest">Jest</option>
                  <option value="mocha">Mocha</option>
                  <option value="cypress">Cypress</option>
                  <option value="selenium">Selenium</option>
                  <option value="playwright">Playwright</option>
                  <option value="junit">JUnit</option>
                  <option value="pytest">PyTest</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Environment</label>
                <select
                  value={newConfigEnvironment}
                  onChange={(e) => setNewConfigEnvironment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Test Files (comma separated)</label>
              <input
                type="text"
                value={newConfigTestFiles}
                onChange={(e) => setNewConfigTestFiles(e.target.value)}
                placeholder="test1.js, test2.js, test3.js"
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
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Schedule (cron expression, optional)</label>
              <input
                type="text"
                value={newConfigSchedule}
                onChange={(e) => setNewConfigSchedule(e.target.value)}
                placeholder="0 0 * * * (daily at midnight)"
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
          
          <h4>Your Test Configurations</h4>
          {configs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No test configurations created yet. Create your first configuration!
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
                    Project: {config.projectId} • Type: {getTestTypeIcon(config.testType)} • Framework: {config.testFramework}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                    Created: {formatDate(config.createdAt)} • Updated: {formatDate(config.updatedAt)}
                  </div>
                  {config.description && (
                    <div style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                      {config.description}
                    </div>
                  )}
                  {config.environment && (
                    <div style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 'bold' }}>Environment:</span> {config.environment}
                    </div>
                  )}
                  {config.schedule && (
                    <div style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 'bold' }}>Schedule:</span> {config.schedule}
                    </div>
                  )}
                  {config.testFiles && config.testFiles.length > 0 && (
                    <div style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 'bold' }}>Test Files:</span> {config.testFiles.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'runs' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Run New Test</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Configuration</label>
                <select
                  value={newTestRunConfigId}
                  onChange={(e) => setNewTestRunConfigId(e.target.value)}
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
                      {config.name} ({getTestTypeIcon(config.testType)})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Project ID</label>
                <input
                  type="number"
                  value={newTestRunProjectId}
                  onChange={(e) => setNewTestRunProjectId(e.target.value)}
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
                value={newTestRunNotes}
                onChange={(e) => setNewTestRunNotes(e.target.value)}
                placeholder="Enter test run notes"
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
              onClick={handleCreateTestRun}
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
              Run Tests
            </button>
          </div>
          
          <h4>Recent Test Runs</h4>
          {testRuns.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No test runs executed yet. Run your first test!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {testRuns.map(testRun => (
                <div 
                  key={testRun.id}
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
                        {testRun.configName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        Type: {getTestTypeIcon(testRun.testType)} • Project: {testRun.projectId}
                      </div>
                    </div>
                    <div style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      backgroundColor: 
                        testRun.status === 'completed' ? '#d1fae5' : 
                        testRun.status === 'running' ? '#fef3c7' : 
                        testRun.status === 'pending' ? '#dbeafe' : 
                        testRun.status === 'cancelled' ? '#e5e7eb' : 
                        '#fee2e2',
                      color: 
                        testRun.status === 'completed' ? '#065f46' : 
                        testRun.status === 'running' ? '#d97706' : 
                        testRun.status === 'pending' ? '#2563eb' : 
                        testRun.status === 'cancelled' ? '#6b7280' : 
                        '#7f1d1d'
                    }}>
                      {testRun.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Created: {formatDate(testRun.createdAt)} • Updated: {formatDate(testRun.updatedAt)}
                  </div>
                  
                  {testRun.notes && (
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <strong>Notes:</strong> {testRun.notes}
                    </div>
                  )}
                  
                  {testRun.results && (
                    <div style={{ fontSize: '0.8rem', backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.25rem' }}>
                      <div><strong>Results:</strong></div>
                      <div>Total: {testRun.results.totalTests}, Passed: {testRun.results.passedTests}, Failed: {testRun.results.failedTests}</div>
                      <div>Execution Time: {testRun.results.executionTime}ms</div>
                      <div>{testRun.results.details}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'results' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Test Results Overview</h4>
            <p style={{ marginBottom: '1rem', color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
              View detailed test results and metrics for your test runs.
            </p>
            
            {testRuns.filter(tr => tr.status === 'completed' && tr.results).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                No completed test runs with results available.
              </div>
            ) : (
              <div>
                <h5>Recent Test Results</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  {testRuns
                    .filter(tr => tr.status === 'completed' && tr.results)
                    .map(testRun => (
                      <div 
                        key={testRun.id}
                        style={{ 
                          padding: '0.75rem', 
                          backgroundColor: theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#dbeafe' : '#f9fafb',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px'
                        }}
                      >
                        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                          {testRun.configName} - {formatDate(testRun.createdAt)}
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#dbeafe', borderRadius: '4px' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2563eb' }}>
                              {testRun.results.totalTests}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total Tests</div>
                          </div>
                          
                          <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#dcfce7', borderRadius: '4px' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#065f46' }}>
                              {testRun.results.passedTests}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Passed</div>
                          </div>
                          
                          <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#7f1d1d' }}>
                              {testRun.results.failedTests}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Failed</div>
                          </div>
                          
                          <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#fef3c7', borderRadius: '4px' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#d97706' }}>
                              {testRun.results.executionTime}ms
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Execution Time</div>
                          </div>
                        </div>
                        
                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                          <div><strong>Framework:</strong> {testRun.testFramework}</div>
                          <div><strong>Environment:</strong> {testRun.configId && configs.find(c => c.id === testRun.configId)?.environment}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
export default Testing;