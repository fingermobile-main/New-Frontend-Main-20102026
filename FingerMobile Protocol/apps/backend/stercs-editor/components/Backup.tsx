import React, {useState, useEffect} from 'react';
interface BackupConfig {
  id: number;
  name: string;
  description?: string;
  projectId: number;
  schedule: string;
  retentionDays: number;
  storageLocation: string;
  createdAt: string;
  updatedAt: string;
}

interface Backup {
  id: number;
  configId: number;
  configName: string;
  projectId: number;
  status: string;
  notes: string;
  details: string;
  filePath: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

interface BackupProps {
  theme: 'light' | 'dark' | 'blue';
}

const Backup: React.FC<BackupProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'configs' | 'backups' | 'restore'>('configs');
  const [configs, setConfigs] = useState<BackupConfig[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states for backup configs
  const [newConfigName, setNewConfigName] = useState<string>('');
  const [newConfigDescription, setNewConfigDescription] = useState<string>('');
  const [newConfigProjectId, setNewConfigProjectId] = useState<string>('1');
  const [newConfigSchedule, setNewConfigSchedule] = useState<string>('manual');
  const [newConfigRetentionDays, setNewConfigRetentionDays] = useState<string>('30');
  const [newConfigStorageLocation, setNewConfigStorageLocation] = useState<string>('local');
  
  // Form states for backups
  const [newBackupConfigId, setNewBackupConfigId] = useState<string>('');
  const [newBackupProjectId, setNewBackupProjectId] = useState<string>('1');
  const [newBackupNotes, setNewBackupNotes] = useState<string>('');

  // Fetch data on initial load
  useEffect(() => {
    fetchConfigs();
    fetchBackups();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/editor/backup/configs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setConfigs(result.data);
       else {
        setError(result.message || 'Failed to fetch backup configs');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
     finally {
      setLoading(false);


  const fetchBackups = async () => {
    try {
      const response = await fetch('/api/editor/backup?limit=10', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setBackups(result.data);
       else {
        setError(result.message || 'Failed to fetch backups');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleCreateConfig = async () => {
    if (!newConfigName.trim() || !newConfigProjectId) {
      setError('Configuration name and project ID are required');
      return;

    try {
      const response = await fetch('/api/editor/backup/configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newConfigName,
          description: newConfigDescription,
          projectId: parseInt(newConfigProjectId),
          schedule: newConfigSchedule,
          retentionDays: parseInt(newConfigRetentionDays),
          storageLocation: newConfigStorageLocation
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewConfigName('');
        setNewConfigDescription('');
        setNewConfigProjectId('1');
        setNewConfigSchedule('manual');
        setNewConfigRetentionDays('30');
        setNewConfigStorageLocation('local');
        fetchConfigs(); // Refresh the configs list
       else {
        setError(result.message || 'Failed to create backup config');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleCreateBackup = async () => {
    if (!newBackupConfigId || !newBackupProjectId) {
      setError('Configuration ID and Project ID are required for backup');
      return;

    try {
      const response = await fetch('/api/editor/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          configId: parseInt(newBackupConfigId),
          projectId: parseInt(newBackupProjectId),
          notes: newBackupNotes
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewBackupConfigId('');
        setNewBackupProjectId('1');
        setNewBackupNotes('');
        fetchBackups(); // Refresh the backups list
       else {
        setError(result.message || 'Failed to create backup');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleRestoreBackup = async (backupId: number) => {
    try {
      const response = await fetch(`/api/editor/backup/${backupId}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        alert('Backup restored successfully');
       else {
        setError(result.message || 'Failed to restore backup');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'pending': return '#3b82f6';
      case 'failed': return '#ef4444';
      default: return '#6b7280';


  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';

  return (
    <div 
      className="backup-panel" 
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Backup Management</h3>
      
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
        {(['configs', 'backups', 'restore'] as const).map((tab) => (
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
            <h4>Create New Backup Configuration</h4>
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Schedule</label>
                <select
                  value={newConfigSchedule}
                  onChange={(e) => setNewConfigSchedule(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="manual">Manual</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Retention Days</label>
                <input
                  type="number"
                  value={newConfigRetentionDays}
                  onChange={(e) => setNewConfigRetentionDays(e.target.value)}
                  placeholder="Retention days"
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Storage Location</label>
                <select
                  value={newConfigStorageLocation}
                  onChange={(e) => setNewConfigStorageLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="local">Local</option>
                  <option value="s3">AWS S3</option>
                  <option value="gcs">Google Cloud Storage</option>
                  <option value="azure">Azure Blob Storage</option>
                </select>
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
          
          <h4>Your Backup Configurations</h4>
          {configs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No backup configurations created yet. Create your first configuration!
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
                    Project: {config.projectId} • Schedule: {config.schedule} • Retention: {config.retentionDays} days
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

      {!loading && activeTab === 'backups' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Create New Backup</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Configuration</label>
                <select
                  value={newBackupConfigId}
                  onChange={(e) => setNewBackupConfigId(e.target.value)}
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
                  value={newBackupProjectId}
                  onChange={(e) => setNewBackupProjectId(e.target.value)}
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
                value={newBackupNotes}
                onChange={(e) => setNewBackupNotes(e.target.value)}
                placeholder="Enter backup notes"
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
              onClick={handleCreateBackup}
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
              Create Backup
            </button>
          </div>
          
          <h4>Your Backups</h4>
          {backups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No backups created yet. Create your first backup!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {backups.map(backup => (
                <div 
                  key={backup.id}
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
                        {backup.configName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        Project: {backup.projectId} • ID: {backup.id}
                      </div>
                    </div>
                    <div style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      backgroundColor: 
                        backup.status === 'completed' ? '#d1fae5' : 
                        backup.status === 'in_progress' ? '#fef3c7' : 
                        backup.status === 'pending' ? '#dbeafe' : 
                        '#fee2e2',
                      color: 
                        backup.status === 'completed' ? '#065f46' : 
                        backup.status === 'in_progress' ? '#d97706' : 
                        backup.status === 'pending' ? '#2563eb' : 
                        '#7f1d1d'
                    }}>
                      {backup.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Created: {formatDate(backup.createdAt)} • Updated: {formatDate(backup.updatedAt)}
                  </div>
                  
                  {backup.notes && (
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <strong>Notes:</strong> {backup.notes}
                    </div>
                  )}
                  
                  {backup.details && (
                    <div style={{ fontSize: '0.8rem', backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.25rem' }}>
                      <strong>Details:</strong> {backup.details}
                    </div>
                  )}
                  
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    <strong>File:</strong> {backup.filePath} • <strong>Size:</strong> {formatFileSize(backup.fileSize)}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleRestoreBackup(backup.id)}
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
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'restore' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Restore Backup</h4>
            <p style={{ marginBottom: '1rem', color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
              Select a backup to restore your project to a previous state. This will overwrite the current project files.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {backups.filter(b => b.status === 'completed').map(backup => (
                <div 
                  key={backup.id}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#dbeafe' : '#f9fafb',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {backup.configName} - {formatDate(backup.createdAt)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      Project: {backup.projectId} • Size: {formatFileSize(backup.fileSize)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestoreBackup(backup.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: (theme === 'dark' ? '#ef4444' : theme === 'blue' ? '#ef4444' : '#ef4444'),
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
            
            {backups.filter(b => b.status === 'completed').length === 0 && (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                No completed backups available for restoration.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
export default Backup;