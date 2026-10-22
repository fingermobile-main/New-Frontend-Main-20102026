import React, {useState, useEffect} from 'react';
interface GenerationHistoryItem {
  id: string;
  type: string;
  prompt: string;
  result: any;
  usageData: any;
  createdAt: string;
}

interface AIGenerationProps {
  theme: 'light' | 'dark' | 'blue';
}

const AIGeneration: React.FC<AIGenerationProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'code' | 'sitemap' | 'history'>('text');
  const [prompt, setPrompt] = useState<string>('');
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [codeInput, setCodeInput] = useState<string>('');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [codeSuggestions, setCodeSuggestions] = useState<any[]>([]);
  const [sitemap, setSitemap] = useState<any>(null);
  const [projectId, setProjectId] = useState<string>('');
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch generation history
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai-generation/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setHistory(result.data);
      } else {
        setError(result.message || 'Failed to fetch history');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateText = async () => {
    if (!prompt.trim()) {
      setError('Prompt is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/ai-generation/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          prompt,
          options: { paragraphs: 2 }
        })
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedText(result.data.content);
      } else {
        setError(result.message || 'Failed to generate text');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setError('Image prompt is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/ai-generation/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          options: { dimensions: '1024x1024' }
        })
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedImage(result.data.imageUrl);
      } else {
        setError(result.message || 'Failed to generate image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGetCodeSuggestions = async () => {
    if (!codeInput.trim()) {
      setError('Code is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/ai-generation/code-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          code: codeInput,
          context: 'javascript'
        })
      });

      const result = await response.json();

      if (result.success) {
        setCodeSuggestions(result.data.suggestions);
      } else {
        setError(result.message || 'Failed to get code suggestions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSitemap = async () => {
    if (!projectId.trim()) {
      setError('Project ID is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/ai-generation/sitemap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({ projectId })
      });

      const result = await response.json();

      if (result.success) {
        setSitemap(result.data.sitemap);
      } else {
        setError(result.message || 'Failed to generate sitemap');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="ai-generation-panel"
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
      <h3 style={{ margin: '0 0 1rem 0' }}>AI Generation Tools</h3>

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
        {(['text', 'image', 'code', 'sitemap', 'history'] as const).map((tab) => (
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

      {loading && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Processing...
        </div>
      )}

      {!loading && activeTab === 'text' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Enter your text prompt:</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what kind of text content you want to generate..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                color: theme === 'dark' ? 'white' : '#1f2937',
                minHeight: '100px'
              }}
            />
          </div>

          <button
            onClick={handleGenerateText}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#2563eb' : '#2563eb'),
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            Generate Text
          </button>

          {generatedText && (
            <div style={{
              padding: '1rem',
              backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              marginTop: '1rem'
            }}>
              <h4>Generated Text:</h4>
              <p>{generatedText}</p>
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'image' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Enter your image prompt:</label>
            <textarea
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                color: theme === 'dark' ? 'white' : '#1f2937',
                minHeight: '100px'
              }}
            />
          </div>

          <button
            onClick={handleGenerateImage}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#2563eb' : '#2563eb'),
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            Generate Image
          </button>

          {generatedImage && (
            <div style={{
              padding: '1rem',
              backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              marginTop: '1rem',
              textAlign: 'center'
            }}>
              <h4>Generated Image:</h4>
              <img
                src={generatedImage}
                alt="Generated content"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px'
                }}
              />
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'code' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Enter your code for suggestions:</label>
            <textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Paste your code here to get AI suggestions..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                color: theme === 'dark' ? 'white' : '#1f2937',
                minHeight: '150px',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <button
            onClick={handleGetCodeSuggestions}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#2563eb' : '#2563eb'),
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            Get Code Suggestions
          </button>

          {codeSuggestions.length > 0 && (
            <div style={{
              padding: '1rem',
              backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              marginTop: '1rem'
            }}>
              <h4>Code Suggestions:</h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {codeSuggestions.map((suggestion, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    <span style={{
                      fontWeight: 'bold',
                      color: suggestion.priority === 'high' ? '#ef4444' :
                             suggestion.priority === 'medium' ? '#f59e0b' : '#10b981'
                    }}>
                      {suggestion.type.toUpperCase()}:
                    </span> {suggestion.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'sitemap' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Enter Project ID:</label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Project ID to generate sitemap for"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                color: theme === 'dark' ? 'white' : '#1f2937'
              }}
            />
          </div>

          <button
            onClick={handleGenerateSitemap}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#2563eb' : '#2563eb'),
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            Generate Sitemap
          </button>

          {sitemap && (
            <div style={{
              padding: '1rem',
              backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              marginTop: '1rem'
            }}>
              <h4>Sitemap for {sitemap.project}:</h4>
              <ul>
                {sitemap.pages.map((page: any, index: number) => (
                  <li key={index} style={{ marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: page.isPublished ? 'normal' : 'italic', color: page.isPublished ? 'inherit' : '#9ca3af' }}>
                      {page.title} ({page.slug}) - {page.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'history' && (
        <div>
          <h4>Generation History</h4>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No generation history yet
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {history.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} - {new Date(item.createdAt).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem', fontStyle: 'italic' }}>
                    Prompt: {item.prompt.substring(0, 100)}{item.prompt.length > 100 ? '...' : ''}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    Type: {item.type}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIGeneration;
