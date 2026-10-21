import React, { useState, useEffect, memberef } from 'react';

interface FileItem {
  id: number;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  path: string;
  folderId: number | null;
  createdAt: string;
  updatedAt: string;
}

interface FolderItem {
  id: number;
  name: string;
  projectId: number;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}

interface FileStats {
  totalFiles: number;
  totalSize: number;
  imageCount: number;
  videoCount: number;
  audioCount: number;
  pdfCount: number;
}

interface FileManagerProps {
  theme: 'light' | 'dark' | 'blue';
}

const FileManager: React.FC<FileManagerProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'files' | 'folders' | 'stats'>(
    'files',
  );
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [stats, setStats] = useState<FileStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFolder, memberCurrentFolder] = useState<number | null>(null);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('');

  const fileInputRef = memberef<HTMLInputElement>(null);

  // Fetch data on initial load
  useEffect(() => {
    fetchFiles();
    fetchFolders();
    fetchStats();
  }, [currentFolder]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('projectId', '1'); // In a real app, this would be the actual project ID
      if (currentFolder !== null) {
        params.append('folderId', currentFolder.toString());
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (fileTypeFilter) {
        params.append('type', fileTypeFilter);
      }

      const response = await fetch(`/api/editor/files?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || 'fake-token'}`, // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setFiles(result.data);
      } else {
        setError(result.message || 'Failed to fetch files');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const params = new URLSearchParams();
      params.append('projectId', '1'); // In a real app, this would be the actual project ID
      if (currentFolder !== null) {
        params.append('parentId', currentFolder.toString());
      } else {
        params.append('parentId', 'null');
      }

      const response = await fetch(
        `/api/editor/files/folders?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || 'fake-token'}`, // In real app, use proper auth
          }
        },
      );

      const result = await response.json();

      if (result.success) {
        setFolders(result.data);
      } else {
        setError(result.message || 'Failed to fetch folders');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/editor/files/stats/1', {
        // In a real app, this would be the actual project ID
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || 'fake-token'}`, // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.message || 'Failed to fetch file stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', '1'); // In a real app, this would be the actual project ID
    if (currentFolder !== null) {
      formData.append('folderId', currentFolder.toString());
    }

    try {
      const response = await fetch('/api/editor/files/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || 'fake-token'}`, // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        fetchFiles(); // Refresh the file list
        fetchStats(); // Refresh stats
      } else {
        setError(result.message || 'Failed to upload file');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setError('Folder name is required');
      return;
    }

    try {
      const response = await fetch('/api/editor/files/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || 'fake-token'}`, // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newFolderName,
          projectId: 1, // In a real app, this would be the actual project ID
          parentId: currentFolder
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewFolderName('');
        fetchFolders(); // Refresh the folder list
      } else {
        setError(result.message || 'Failed to create folder');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    try {
      const response = await fetch(`/api/editor/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || 'fake-token'}`, // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        fetchStats(); // Refresh stats
      } else {
        setError(result.message || 'Failed to delete file');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleFolderClick = (folderId: number) => {
    setCurrentFolder(folderId);
  };

  const handleGoBack = () => {
    if (currentFolder !== null) {
      // In a real implementation, we would navigate to the parent folder
      // For now, we'll just go back to the root
      setCurrentFolder(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string): string => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎬';
    if (type.startsWith('audio/')) return '🎵';
    if (type === 'application/pdf') return '📄';
    if (type.includes('zip') || type.includes('compressed')) return '📦';
    if (
      type.includes('text') ||
      type.includes('javascript') ||
      type.includes('json')
    )
      return '📝';
    return '📄';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div
      className="file-manager-panel"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor:
          theme === 'dark'
            ? '#1f2937'
            : theme === 'blue'
              ? '#dbeafe'
              : '#e5e7eb',
        color: theme === 'dark' ? 'white' : '#1f2937',
        padding: '1rem'
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0' }}>File Manager</h3>

      {error && (
        <div
          style={{
            padding: '0.75rem',
            color: '#ef4444',
            backgroundColor:
              theme === 'dark'
                ? '#374151'
                : theme === 'blue'
                  ? '#eff6ff'
                  : '#f3f4f6',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}
        >
          Error: {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['files', 'folders', 'stats'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor:
                activeTab === tab
                  ? theme === 'dark'
                    ? '#374151'
                    : theme === 'blue'
                      ? '#3b82f6'
                      : '#d1d5db'
                  : theme === 'dark'
                    ? '#4b5563'
                    : theme === 'blue'
                      ? '#93c5fd'
                      : '#e5e7eb',
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

      {loading && activeTab !== 'stats' && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>Loading...</div>
      )}

      {!loading && activeTab === 'files' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div
            style={{
              padding: '1rem',
              backgroundColor:
                theme === 'dark'
                  ? '#374151'
                  : theme === 'blue'
                    ? '#eff6ff'
                    : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}
          >
            <div
              style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor:
                    theme === 'dark'
                      ? '#10b981'
                      : theme === 'blue'
                        ? '#10b981'
                        : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Upload File
              </button>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              />

              <select
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              >
                <option value="">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="application/pdf">PDFs</option>
              </select>
            </div>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <button
                onClick={handleGoBack}
                disabled={currentFolder === null}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor:
                    theme === 'dark'
                      ? '#3b82f6'
                      : theme === 'blue'
                        ? '#3b82f6'
                        : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentFolder === null ? 'not-allowed' : 'pointer',
                  opacity: currentFolder === null ? 0.5 : 1
                }}
              >
                ← Back
              </button>
              <div style={{ flex: 1 }}>
                {currentFolder !== null
                  ? `Current Folder: ${folders.find((f) => f.id === currentFolder)?.name || 'Unknown'}`
                  : 'Root Folder'}
              </div>
            </div>
          </div>

          <h4>Files</h4>
          {files.length === 0 ? (
            <div
              style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}
            >
              No files found. Upload your first file!
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              {files.map((file) => (
                <div
                  key={file.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor:
                      theme === 'dark'
                        ? '#374151'
                        : theme === 'blue'
                          ? '#eff6ff'
                          : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
                    {getFileIcon(file.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {file.originalName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor:
                        theme === 'dark'
                          ? '#ef4444'
                          : theme === 'blue'
                            ? '#ef4444'
                            : '#ef4444',
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
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'folders' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div
            style={{
              padding: '1rem',
              backgroundColor:
                theme === 'dark'
                  ? '#374151'
                  : theme === 'blue'
                    ? '#eff6ff'
                    : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="New folder name"
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
                onClick={handleCreateFolder}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor:
                    theme === 'dark'
                      ? '#3b82f6'
                      : theme === 'blue'
                        ? '#3b82f6'
                        : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Folder
              </button>
            </div>
          </div>

          <h4>Folders</h4>
          {folders.length === 0 ? (
            <div
              style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}
            >
              No folders found. Create your first folder!
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor:
                      theme === 'dark'
                        ? '#374151'
                        : theme === 'blue'
                          ? '#eff6ff'
                          : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleFolderClick(folder.id)}
                >
                  <div style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
                    📁
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{folder.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      Created: {formatDate(folder.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'stats' && stats && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div
            style={{
              padding: '1rem',
              backgroundColor:
                theme === 'dark'
                  ? '#374151'
                  : theme === 'blue'
                    ? '#eff6ff'
                    : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}
          >
            <h4>File Statistics</h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginTop: '1rem'
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  padding: '1rem',
                  backgroundColor: '#dbeafe',
                  borderRadius: '4px'
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#3b82f6'
                  }}
                >
                  {stats.totalFiles}
                </div>
                <div style={{ color: '#6b7280' }}>Total Files</div>
              </div>

              <div
                style={{
                  textAlign: 'center',
                  padding: '1rem',
                  backgroundColor: '#d1fae5',
                  borderRadius: '4px'
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#10b981'
                  }}
                >
                  {formatFileSize(stats.totalSize)}
                </div>
                <div style={{ color: '#6b7280' }}>Total Size</div>
              </div>

              <div
                style={{
                  textAlign: 'center',
                  padding: '1rem',
                  backgroundColor: '#fef3c7',
                  borderRadius: '4px'
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#f59e0b'
                  }}
                >
                  {stats.imageCount}
                </div>
                <div style={{ color: '#6b7280' }}>Images</div>
              </div>

              <div
                style={{
                  textAlign: 'center',
                  padding: '1rem',
                  backgroundColor: '#ddd6fe',
                  borderRadius: '4px'
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#8b5cf6'
                  }}
                >
                  {stats.videoCount}
                </div>
                <div style={{ color: '#6b7280' }}>Videos</div>
              </div>

              <div
                style={{
                  textAlign: 'center',
                  padding: '1rem',
                  backgroundColor: '#fbcfe8',
                  borderRadius: '4px'
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#ec4899'
                  }}
                >
                  {stats.audioCount}
                </div>
                <div style={{ color: '#6b7280' }}>Audio</div>
              </div>

              <div
                style={{
                  textAlign: 'center',
                  padding: '1rem',
                  backgroundColor: '#e0e7ff',
                  borderRadius: '4px'
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#6366f1'
                  }}
                >
                  {stats.pdfCount}
                </div>
                <div style={{ color: '#6b7280' }}>PDFs</div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor:
                theme === 'dark'
                  ? '#374151'
                  : theme === 'blue'
                    ? '#eff6ff'
                    : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          >
            <h5>Storage Usage</h5>
            <div style={{ marginTop: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}
              >
                <span>Used Space</span>
                <span>{formatFileSize(stats.totalSize)}</span>
              </div>
              <div
                style={{
                  height: '20px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, (stats.totalSize / (100 * 1024 * 1024)) * 100)}%`, // Assuming 100MB limit for demo
                    backgroundColor:
                      stats.totalSize > 50 * 1024 * 1024
                        ? '#ef4444'
                        : '#10b981',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
              <div
                style={{
                  textAlign: 'right',
                  fontSize: '0.8rem',
                  color: '#6b7280',
                  marginTop: '0.25rem'
                }}
              >
                100 MB limit (estimated)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
