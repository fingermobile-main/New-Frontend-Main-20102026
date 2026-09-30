import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

interface ContentItem {
  id: string;
  title: string;
  type: 'post' | 'image' | 'video' | 'audio';
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
  scheduledFor?: string;
  views?: number;
  likes?: number;
  comments?: number;
}

const UGCContentStudio = () => {
  const { showToast} = useAppContext(); // Fixed hook name
  const [contents, setContents] = React.useState<ContentItem[]>([
    {
      id: '1',
      title: 'My Weekend Adventure',
      type: 'post',
      status: 'published',
      createdAt: '2023-06-15T10:30:00Z',
      views: 1250,
      likes: 85,
      comments: 12
    },
    {
      id: '2',
      title: 'Sunset Photography',
      type: 'image',
      status: 'draft',
      createdAt: '2023-06-16T14:20:00Z'
    },
    {
      id: '3',
      title: 'Music Session',
      type: 'audio',
      status: 'scheduled',
      createdAt: '2023-06-17T09:15:00Z',
      scheduledFor: '2023-06-20T18:00:00Z',
      views: 890,
      likes: 42,
      comments: 5
    }
  ]);

  const [activeTab, setActiveTab] = React.useState<
    'all' | 'drafts' | 'scheduled' | 'published'
  >('all');

  const filteredContents = contents.filter((content) => {
    if (activeTab === 'all') return true;
    return content.status === activeTab;
  });

  const handleCreateNew = () => {
    // Logic to create new content
    console.info('Creating new content...');
  };

  const handleEdit = (id: string) => {
    // Logic to edit content
    console.info(`Editing content ${id}`);
  };

  const handleDelete = (id: string) => {
    // Logic to delete content
    setContents(contents.filter((content) => content.id !== id));
  };

  const handleSchedule = (id: string) => {
    // Logic to schedule content
    console.info(`Scheduling content ${id}`);
  };

  const handlePublish = (id: string) => {
    // Logic to publish content
    setContents(
      contents.map((content) =>
        content.id === id ? { ...content, status: 'published' } : content,
      ),
    );
  };

  return (
    <div className="ugc-content-studio">
      <div className="studio-header">
        <h2>UGC Content Studio</h2>
        <p>Create, edit, and manage your member-generated content</p>
      </div>

      <div className="studio-actions">
        <button className="btn-primary" onClick={handleCreateNew}>
          + Create New Content
        </button>
      </div>

      <div className="content-tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Content
        </button>
        <button
          className={`tab ${activeTab === 'drafts' ? 'active' : ''}`}
          onClick={() => setActiveTab('drafts')}
        >
          Drafts
        </button>
        <button
          className={`tab ${activeTab === 'scheduled' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduled')}
        >
          Scheduled
        </button>
        <button
          className={`tab ${activeTab === 'published' ? 'active' : ''}`}
          onClick={() => setActiveTab('published')}
        >
          Published
        </button>
      </div>

      <div className="content-grid">
        {filteredContents.length === 0 ? (
          <div className="empty-state">
            <p>No content found. Create your first piece of content!</p>
          </div>
        ) : (
          filteredContents.map((content) => (
            <div key={content.id} className="content-card">
              <div className="content-header">
                <h3>{content.title}</h3>
                <span className={`status-badge ${content.status}`}>
                  {content.status.charAt(0).toUpperCase() +
                    content.status.slice(1)}
                </span>
              </div>
              <div className="content-meta">
                <p>
                  Type:{' '}
                  {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                </p>
                <p>
                  Created: {new Date(content.createdAt).toLocaleDateString()}
                </p>
                {content.scheduledFor && (
                  <p>
                    Scheduled:{' '}
                    {new Date(content.scheduledFor).toLocaleDateString()}
                  </p>
                )}
                {content.views !== undefined && <p>Views: {content.views}</p>}
                {content.likes !== undefined && <p>Likes: {content.likes}</p>}
                {content.comments !== undefined && (
                  <p>Comments: {content.comments}</p>
                )}
              </div>
              <div className="content-actions">
                <button
                  className="btn-secondary"
                  onClick={() => handleEdit(content.id)}
                >
                  Edit
                </button>
                {content.status === 'draft' && (
                  <>
                    <button
                      className="btn-secondary"
                      onClick={() => handleSchedule(content.id)}
                    >
                      Schedule
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => handlePublish(content.id)}
                    >
                      Publish
                    </button>
                  </>
                )}
                {content.status === 'scheduled' && (
                  <button
                    className="btn-primary"
                    onClick={() => handlePublish(content.id)}
                  >
                    Publish Now
                  </button>
                )}
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(content.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UGCContentStudio;
