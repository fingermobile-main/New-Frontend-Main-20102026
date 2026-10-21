import React, {useState, useEffect} from 'react';
interface Commit {
  hash: string;
  author: string;
  email: string;
  message: string;
  date: Date;

interface Branch {
  name: string;
  isCurrent: boolean;

interface Change {
  status: string; // A=Added, M=Modified, D=Deleted
  file: string;

interface VersionControlProps {
  theme: 'light' | 'dark' | 'blue';
  projectId: string;

const VersionControl: React.FC<VersionControlProps> = ({ theme, projectId }) => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [commitMessage, setCommitMessage] = useState<string>('');
  const [newBranchName, setNewBranchName] = useState<string>('');
  const [selectedCommit, setSelectedCommit] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'history' | 'branches' | 'changes'>('history');

  // Fetch commit history
  useEffect(() => {
    fetchCommitHistory();
    fetchBranches();
  }, [projectId]);

  const fetchCommitHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/version-control/history/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });
      
      const result = await response.json();
      
      if (result.success) {
        setCommits(result.data.gitCommits || []);
       else {
        setError(result.message || 'Failed to fetch commit history');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
     finally {
      setLoading(false);


  const fetchBranches = async () => {
    try {
      const response = await fetch(`/api/version-control/branches/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });
      
      const result = await response.json();
      
      if (result.success) {
        setBranches(result.data.branches || []);

     catch (err) {
      console.error('Error fetching branches:', err);


  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      setError('Commit message is required');
      return;

    try {
      const response = await fetch(`/api/version-control/commit/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          message: commitMessage
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCommitMessage('');
        fetchCommitHistory(); // Refresh the commit history
       else {
        setError(result.message || 'Failed to commit changes');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) {
      setError('Branch name is required');
      return;

    try {
      const response = await fetch(`/api/version-control/branch/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          branchName: newBranchName
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNewBranchName('');
        fetchBranches(); // Refresh the branches
       else {
        setError(result.message || 'Failed to create branch');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleSwitchBranch = async (branchName: string) => {
    try {
      const response = await fetch(`/api/version-control/switch-branch/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          branchName
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchBranches(); // Refresh the branches
        fetchCommitHistory(); // Refresh the commit history
       else {
        setError(result.message || 'Failed to switch branch');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleCompareChanges = async () => {
    if (!selectedCommit) {
      setError('Please select a commit to compare');
      return;

    try {
      const response = await fetch(`/api/version-control/compare/${projectId}?baseCommit=${selectedCommit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });
      
      const result = await response.json();
      
      if (result.success) {
        setChanges(result.data.changes || []);
        setActiveTab('changes');
       else {
        setError(result.message || 'Failed to compare changes');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleRevertToCommit = async (commitHash: string) => {
    if (!window.confirm(`Are you sure you want to revert to commit ${commitHash.substring(0, 7)}?`)) {
      return;

    try {
      const response = await fetch(`/api/version-control/revert/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          commitHash
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchCommitHistory(); // Refresh the commit history
       else {
        setError(result.message || 'Failed to revert to commit');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleString();

  return (
    <div 
      className="version-control-panel" 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: theme === 'dark' ? '#1f2937' : theme === 'blue' ? '#dbeafe' : '#e5e7eb',
        color: theme === 'dark' ? 'white' : '#1f2937'
      }}
    >
      <div style={{ 
        padding: '0.75rem', 
        borderBottom: '1px solid #d1d5db'
      }}>
        <h3 style={{ margin: '0 0 0.75rem 0' }}>Version Control</h3>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button 
            onClick={() => setActiveTab('history')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeTab === 'history' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
              color: theme === 'dark' ? 'white' : '#1f2937',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1,
              fontWeight: activeTab === 'history' ? 'bold' : 'normal'
            }}
          >
            History
          </button>
          <button 
            onClick={() => setActiveTab('branches')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeTab === 'branches' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
              color: theme === 'dark' ? 'white' : '#1f2937',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1,
              fontWeight: activeTab === 'branches' ? 'bold' : 'normal'
            }}
          >
            Branches
          </button>
          <button 
            onClick={() => setActiveTab('changes')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeTab === 'changes' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
              color: theme === 'dark' ? 'white' : '#1f2937',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1,
              fontWeight: activeTab === 'changes' ? 'bold' : 'normal'
            }}
          >
            Changes
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Commit message"
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
              color: theme === 'dark' ? 'white' : '#1f2937'
            }}
          />
          <button
            onClick={handleCommit}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: (theme === 'dark' ? '#10b981' : theme === 'blue' ? '#10b981' : '#10b981'),
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Commit
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '1rem', 
          color: '#ef4444',
          backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : '#f3f4f6'
        }}>
          Error: {error}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
        {loading ? (
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            Loading...
          </div>
        ) : activeTab === 'history' ? (
          <div>
            <h4>Commit History</h4>
            {commits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                No commits yet. Make your first commit!
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {commits.map((commit, index) => (
                  <li key={index} style={{ 
                    marginBottom: '0.75rem', 
                    padding: '0.75rem',
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{commit.message}</div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          {commit.hash.substring(0, 7)} by {commit.author} on {formatDate(new Date(commit.date))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRevertToCommit(commit.hash)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Revert
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : activeTab === 'branches' ? (
          <div>
            <h4>Branches</h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder="New branch name"
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              />
              <button
                onClick={handleCreateBranch}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#2563eb' : '#2563eb'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create
              </button>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {branches.map((branch, index) => (
                <li key={index} style={{ 
                  marginBottom: '0.5rem', 
                  padding: '0.5rem',
                  backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontWeight: branch.isCurrent ? 'bold' : 'normal' }}>
                      {branch.isCurrent ? '✓ ' : ''}{branch.name}
                    </span>
                  </div>
                  {!branch.isCurrent && (
                    <button
                      onClick={() => handleSwitchBranch(branch.name)}
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
                      Switch
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h4>Compare Changes</h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <select
                value={selectedCommit}
                onChange={(e) => setSelectedCommit(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              >
                <option value="">Select a commit to compare</option>
                {commits.slice(0, 10).map((commit, index) => (
                  <option key={index} value={commit.hash}>
                    {commit.hash.substring(0, 7)} - {commit.message}
                  </option>
                ))}
              </select>
              <button
                onClick={handleCompareChanges}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#2563eb' : '#2563eb'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Compare
              </button>
            </div>
            
            {changes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                Select a commit and click "Compare" to see changes
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {changes.map((change, index) => (
                  <li key={index} style={{ 
                    marginBottom: '0.5rem', 
                    padding: '0.5rem',
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}>
                    <div style={{ fontWeight: 'bold', color: 
                      change.status === 'A' ? '#10b981' : 
                      change.status === 'M' ? '#f59e0b' : 
                      '#ef4444' 
                    }}>
                      {change.status === 'A' ? 'Added' : 
                       change.status === 'M' ? 'Modified' : 
                       'Deleted'}: {change.file}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
export default VersionControl;