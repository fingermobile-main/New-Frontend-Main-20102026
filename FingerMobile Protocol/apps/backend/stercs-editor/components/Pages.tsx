import React, {useState, useEffect} from 'react';
interface Page {
  id: string;
  title: string;
  slug: string;
  content: any;
  meta_data: {
    description?: string;
    keywords: string[];
    author: string;
    ogImage: string;
    isPublished: boolean;

  created_at: string;
  updated_at: string;

interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  content: any;
  isPublic: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;

interface PagesProps {
  theme: 'light' | 'dark' | 'blue';
  projectId: string;

const Pages: React.FC<PagesProps> = ({ theme, projectId }) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pages' | 'templates'>('pages');
  const [newPageTitle, setNewPageTitle] = useState<string>('');
  const [newPageSlug, setNewPageSlug] = useState<string>('');
  const [newPageDescription, setNewPageDescription] = useState<string>('');
  const [showNewPageForm, setShowNewPageForm] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Fetch pages for the project
  useEffect(() => {
    fetchPages();
    fetchTemplates();
  }, [projectId]);

  const fetchPages = async () => {
    try {
      const response = await fetch(`/api/pages/project/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setPages(result.data);
       else {
        setError(result.message || 'Failed to fetch pages');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/pages/templates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setTemplates(result.data);
       else {
        setError(result.message || 'Failed to fetch templates');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
     finally {
      setLoading(false);


  const handleCreatePage = async () => {
    if (!newPageTitle.trim() || !newPageSlug.trim()) {
      setError('Title and slug are required');
      return;

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          projectId,
          title: newPageTitle,
          slug: newPageSlug,
          description: newPageDescription,
          content: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.content : {}
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewPageTitle('');
        setNewPageSlug('');
        setNewPageDescription('');
        setSelectedTemplate(null);
        setShowNewPageForm(false);
        fetchPages(); // Refresh the pages list
       else {
        setError(result.message || 'Failed to create page');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handlePublishToggle = async (pageId: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/pages/${pageId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({ isPublished })
      });

      const result = await response.json();

      if (result.success) {
        // Update the page in the local state
        setPages(pages.map(page => 
          page.id === pageId ? { ...page, meta_data: { ...page.meta_data, isPublished: result.data.is_published } } : page
        ));
       else {
        setError(result.message || 'Failed to update page status');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  const handleDeletePage = async (pageId: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) {
      return;

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth

      });

      const result = await response.json();

      if (result.success) {
        setPages(pages.filter(page => page.id !== pageId));
       else {
        setError(result.message || 'Failed to delete page');

     catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');


  return (
    <div 
      className="pages-panel" 
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Page Management</h3>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('pages')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'pages' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
            color: theme === 'dark' ? 'white' : '#1f2937',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'pages' ? 'bold' : 'normal'
          }}
        >
          Pages
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'templates' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
            color: theme === 'dark' ? 'white' : '#1f2937',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'templates' ? 'bold' : 'normal'
          }}
        >
          Templates
        </button>
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

      {activeTab === 'pages' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4>Project Pages</h4>
            <button
              onClick={() => setShowNewPageForm(!showNewPageForm)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#2563eb' : '#2563eb'),
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showNewPageForm ? 'Cancel' : 'New Page'}
            </button>
          </div>

          {showNewPageForm && (
            <div style={{ 
              padding: '1rem', 
              marginBottom: '1rem',
              backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : '#f3f4f6',
              borderRadius: '6px'
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Page Title</label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="Enter page title"
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Page Slug</label>
                <input
                  type="text"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="Enter page slug (URL-friendly)"
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
                  value={newPageDescription}
                  onChange={(e) => setNewPageDescription(e.target.value)}
                  placeholder="Enter page description"
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
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Use Template</label>
                <select
                  value={selectedTemplate || ''}
                  onChange={(e) => setSelectedTemplate(e.target.value || null)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="">No template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleCreatePage}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Page
              </button>
            </div>
          )}

          {loading ? (
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              Loading pages...
            </div>
          ) : pages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No pages created yet. Create your first page!
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {pages.map(page => (
                <li key={page.id} style={{ 
                  marginBottom: '0.75rem', 
                  padding: '0.75rem',
                  backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{page.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        /{page.slug} • Created: {new Date(page.created_at).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        {page.meta_data.description}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handlePublishToggle(page.id, !page.meta_data.isPublished)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: page.meta_data.isPublished ? '#ef4444' : '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        {page.meta_data.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.id)}
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
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div>
          <h4>Available Templates</h4>
          {loading ? (
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              Loading templates...
            </div>
          ) : templates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No templates available.
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {templates.map(template => (
                <li key={template.id} style={{ 
                  marginBottom: '0.75rem', 
                  padding: '0.75rem',
                  backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{template.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {template.description}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                      Category: {template.category} • {template.isPublic ? 'Public' : 'Private'}
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
export default Pages;