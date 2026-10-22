import React, {useState, useEffect} from 'react';
interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  modified?: Date;
  created?: Date;
}

interface ExplorerProps {
  theme: 'light' | 'dark' | 'blue';
  projectId: string;
  onFileSelect?: (path: string) => void;
}

const Explorer: React.FC<ExplorerProps> = ({ theme, projectId, onFileSelect }) => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemType, setNewItemType] = useState<'file' | 'directory'>('file');
  const [showNewForm, setShowNewForm] = useState<boolean>(false);

  // Fetch project files
  useEffect(() => {
    fetchProjectFiles();
  }, [currentPath, projectId]);

  const fetchProjectFiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/explorer/project/${projectId}?path=${encodeURIComponent(currentPath)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setItems(result.data.items);
      } else {
        setError(result.message || 'Failed to fetch project files');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: FileItem) => {
    if (item.isDirectory) {
      // Navigate into directory
      const newPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      setCurrentPath(newPath);
    } else {
      // File clicked - trigger callback
      if (onFileSelect) {
        onFileSelect(item.path);
      }
    }
  };

  const handleNavigateUp = () => {
    if (currentPath) {
      const pathParts = currentPath.split('/');
      pathParts.pop(); // Remove last part
      setCurrentPath(pathParts.join('/'));
    }
  };

  const handleCreateItem = async () => {
    if (!newItemName.trim()) {
      setError('Item name is required');
      return;
    }

    try {
      const response = await fetch(`/api/explorer/project/${projectId}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newItemName,
          type: newItemType,
          parentPath: currentPath || undefined
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNewItemName('');
        setShowNewForm(false);
        fetchProjectFiles(); // Refresh the view
      } else {
        setError(result.message || 'Failed to create item');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
  };

  return (
    <div 
      className="explorer-panel" 
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
        borderBottom: '1px solid #d1d5db',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0 }}>Explorer</h3>
        <div>
          <button 
            onClick={() => setShowNewForm(!showNewForm)}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db',
              color: theme === 'dark' ? 'white' : '#1f2937',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            + New
          </button>
        </div>
      </div>

      {showNewForm && (
        <div style={{ 
          padding: '0.75rem', 
          borderBottom: '1px solid #d1d5db',
          backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : '#f3f4f6'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name"
              style={{
                flex: 1,
                padding: '0.25rem 0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                color: theme === 'dark' ? 'white' : '#1f2937'
              }}
            />
            <select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value as 'file' | 'directory')}
              style={{
                padding: '0.25rem 0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                color: theme === 'dark' ? 'white' : '#1f2937'
              }}
            >
              <option value="file">File</option>
              <option value="directory">Directory</option>
            </select>
          </div>
          <div>
            <button 
              onClick={handleCreateItem}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                marginRight: '0.5rem'
              }}
            >
              Create
            </button>
            <button 
              onClick={() => setShowNewForm(false)}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ 
        padding: '0.5rem', 
        borderBottom: '1px solid #d1d5db',
        display: 'flex',
        alignItems: 'center'
      }}>
        <button 
          onClick={handleNavigateUp}
          disabled={!currentPath}
          style={{
            padding: '0.25rem',
            backgroundColor: currentPath ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPath ? 'pointer' : 'not-allowed',
            marginRight: '0.5rem'
          }}
        >
          ↥
        </button>
        <div style={{ 
          flex: 1, 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          fontSize: '0.8rem'
        }}>
          /{currentPath || projectId}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading...
        </div>
      ) : error ? (
        <div style={{ padding: '1rem', color: '#ef4444' }}>
          Error: {error}
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              This folder is empty
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map((item, index) => (
                <li key={index}>
                  <div
                    onClick={() => handleItemClick(item)}
                    style={{
                      padding: '0.5rem',
                      margin: '0.25rem 0',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                      border: '1px solid #d1d5db',
                      color: theme === 'dark' ? 'white' : '#1f2937'
                    }}
                  >
                    <span style={{ marginRight: '0.5rem' }}>
                      {item.isDirectory ? '📁' : '📄'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                      {item.size !== undefined && (
                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                          {item.size} bytes, modified: {formatDate(item.modified)}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Explorer;