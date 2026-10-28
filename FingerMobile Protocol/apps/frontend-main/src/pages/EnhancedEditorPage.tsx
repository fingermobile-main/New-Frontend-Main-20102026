import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';

import { useAppContext } from '../contexts/AppContext';
import { useEditor } from '../contexts/EditorContext';
// Use require for CommonJS compatibility with react-dnd

import { DndProvider } from 'react-dnd';

import { HTML5Backend } from 'react-dnd-html5-backend';

import ComponentLibrary from '../components/editor/ComponentLibrary';
import Canvas from '../components/editor/Canvas';
import PropertiesPanel from '../components/editor/PropertiesPanel';
import type { EditorComponent } from '../types';
import { generateUniqueId } from '../utils/id';
import apiService from '../services/apiService';

// ---, Subcomponent: Decoupled Editor Header ---
interface EditorHeaderProps {
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  pageName: string; onPageNameChange: (name: string) => void; onExportHtml: () => void; onPreview: () => void; aiPrompt: string; onAiPromptChange: (prompt: string) => void; onGenerateWithAi: () => void; isGeneratingAi: boolean; onSaveAndDeploy: () => void; isSaving: boolean;
}

const EditorHeader: React.FC<EditorHeaderProps> = React.memo(({
  pageName,
  onPageNameChange,
  onExportHtml,
  onPreview,
  aiPrompt,
  onAiPromptChange,
  onGenerateWithAi,
  isGeneratingAi,
  onSaveAndDeploy,
  isSaving
}) => {
  return (
    <header className="bg-white border-b border-slate-300 p-3 sm:p-4 lg:p-5 flex flex-col md:flex-row justify-between items-start md:items-center flex-shrink-0 gap-3">
      <input
        type="text"
        value={pageName}
        onChange={(e) => onPageNameChange(e.target.value)}
        className="font-bold text-base sm:text-lg rounded-xl text-slate-900 border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 px-3 py-2 w-full md:w-auto md:min-w-[220px]"
      />
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <button
          onClick={onExportHtml}
          className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-800 whitespace-nowrap cursor-pointer shadow-xs"
        >
          Export HTML
        </button>
        <button
          onClick={onPreview}
          className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-800 whitespace-nowrap cursor-pointer shadow-xs"
        >
          Preview
        </button>
        <input
          type="text"
          value={aiPrompt}
          onChange={(e) => onAiPromptChange(e.target.value)}
          placeholder="Describe component to AI..."
          className="min-h-[44px] px-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl text-slate-900 font-bold bg-white focus:ring-2 focus:ring-purple-500 placeholder:text-slate-400 flex-1 min-w-[150px]"
        />
        <button
          onClick={onGenerateWithAi}
          disabled={isGeneratingAi}
          className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-slate-300 whitespace-nowrap cursor-pointer shadow-xs"
        >
          {isGeneratingAi ? 'Generating...' : 'Generate with AI'}
        </button>
        <button
          onClick={onSaveAndDeploy}
          disabled={isSaving}
          className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 whitespace-nowrap cursor-pointer shadow-xs"
        >
          {isSaving ? 'Saving...' : 'Save & Deploy'}
        </button>
      </div>
    </header>
  );
});

EditorHeader.displayName = 'EditorHeader';

const EnhancedEditorPage: React.FC = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { showToast, ficBalance: _ficBalance } = useAppContext();
  const editorContext = useEditor() as any;
  const handleSavePage = editorContext?.saveProject || (async () => {});
  const [components, setComponents] = useState<EditorComponent[]>([]);
  const [pageName, setPageName] = useState('Untitled Page');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Required functions
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const onLike = useCallback(async (_postId: string) => {
    showToast('Like action triggered', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const onAddComment = useCallback(async (_postId: string, _comment: string) => {
    showToast('Comment action triggered', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const onOpenGiftModal = useCallback(async (_postId: string) => {
    showToast('Gift modal opened', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const onOpenPaylinkModal = useCallback(async (_postId: string) => {
    showToast('Paylink modal opened', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  const onVote = useCallback(async (_postId: string, _voteType: unknown) => {
    const voteStr = typeof _voteType === 'string' ? _voteType : 'up';
    showToast(`${voteStr} vote action triggered`, 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const handleDeletePost = useCallback(async (_postId?: string) => {
    showToast('Delete post action triggered', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const handleTokenizePost = useCallback(async (_postId?: string) => {
    showToast('Tokenize post action triggered', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const handleAiAssist = useCallback(async (..._args: unknown[]) => {
    showToast('AI assist action triggered', 'info');
    return { success: true, message: 'AI assist completed' };
  }, [showToast]);

  const handleGenerateWithAi = useCallback(async () => {
    if (!aiPrompt.trim()) {
      showToast('Please enter a prompt for AI generation.', 'info');
      return;
    }

    setIsGeneratingAi(true);
    try {
      const response = await apiService.post('/editor/generate-ai', { prompt: aiPrompt });
      // Convert AI response changes to components if possible
      // For now, just show a success toast as the response doesn't directly return components
      showToast('AI generation request processed!', 'success');
      // eslint-disable-next-line no-console
      console.info('AI, Response:', response);
      setAiPrompt('');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to generate AI, components:', error);
      showToast('Failed to generate AI components.', 'error');
    } finally {
      setIsGeneratingAi(false);
    }
  }, [aiPrompt, showToast]);

  useEffect(() => {
    let isMounted = true;

    const fetchPageData = async () => {
      if (pageId) {
        setIsLoading(true);
        try {
          const page = await apiService.get(`/editor/pages/${pageId}`);
          if (isMounted) {
            if (page) {
              setComponents((page as any).components || []);
              setPageName((page as any).name || 'Untitled Page');
            } else {
              showToast('Page not found. Starting a new page.', 'warning');
              navigate('/editor');
            }
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch, page:', error);
          if (isMounted) {
            showToast('Failed to load page.', 'error');
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPageData();

    return () => {
      isMounted = false;
    };
  }, [pageId, navigate, showToast]);

  // eslint-disable-next-line no-unused-vars
  const addComponent = useCallback((type: string, position?: { x: number; y: number }) => {
    let defaultProps: Record<string, unknown> = {};
    let componentType = 'text';

    switch (type) {
    case 'Header':
      defaultProps = {
        text: 'New Header',
        title: 'Header',
        fontSize: '2xl',
        fontWeight: 'bold'
      };
      componentType = 'text';
      break;
    case 'TextBlock':
      defaultProps = {
        text: 'This is a new text block. Click to edit.',
        title: 'Text Block',
        fontSize: 'base',
        fontWeight: 'normal'
      };
      componentType = 'text';
      break;
    case 'Image':
      defaultProps = {
        src: 'https://picsum.photos/seed/editor/600/400',
        alt: 'Placeholder Image',
        width: 600,
        height: 400,
        borderRadius: 0
      };
      componentType = 'image';
      break;
    case 'Button':
      defaultProps = {
        text: 'Click Me',
        href: '#',
        title: 'Button'
      };
      componentType = 'text';
      break;
    case 'Video':
      defaultProps = {
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        width: 640,
        height: 360,
        autoplay: false,
        loop: false
      };
      componentType = 'video';
      break;
    case 'Poll':
      defaultProps = {
        question: 'What do you think?',
        options: ['Option 1', 'Option 2', 'Option 3']
      };
      componentType = 'poll';
      break;
    case 'Embed':
      defaultProps = {
        src: 'https://example.com/embed'
      };
      componentType = 'embed';
      break;
    case 'Workflow':
      defaultProps = {
        workflowName: 'New Workflow',
        steps: []
      };
      componentType = 'workflow';
      break; default:
      componentType = 'text';
      break;
    }

    const newComponent: EditorComponent = {
      id: generateUniqueId(),
      type: componentType,
      props: defaultProps
    };

    setComponents((prev) => [...prev, newComponent]);
  }, []);

  const updateComponent = useCallback((
    id: string,
    newProps: Partial<EditorComponent['props']>,
  ) => {
    setComponents((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c,
      ),
    );
  }, []);

  // eslint-disable-next-line no-unused-vars
  const updateComponentFull = useCallback((
    id: string,
    updates: Partial<EditorComponent>,
  ) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId]);

  // eslint-disable-next-line no-unused-vars
  const moveComponent = useCallback((dragIndex: number, hoverIndex: number) => {
    setComponents((prev) => {
      const newComponents = [...prev];
      const [draggedItem] = newComponents.splice(dragIndex, 1);
      newComponents.splice(hoverIndex, 0, draggedItem);
      return newComponents;
    });
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await handleSavePage(pageId || '', components);
      showToast('Page saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save page', 'error');
    }
  }, [pageId, components, handleSavePage, showToast]);

  const selectedComponent =
    components.find((c) => c.id === selectedComponentId) || null;

  const generatePageHtml = useCallback((forExport = false) => {
    const componentHtml = components
      .map((c) => {
        switch (c.type) {
        case 'Header':
          return `<h1 style="font-size: 2.25rem; font-weight: bold; margin: 1rem 0;">${(c.props as any).text}</h1>`;
        case 'TextBlock':
          return `<p style="margin: 1rem 0;">${(c.props as any).text}</p>`;
        case 'Image':
          return `<img src="${(c.props as any).src}" alt="${(c.props as any).alt}" style="max-width: 100%; height: auto; border-radius: ${(c.props as any).borderRadius || 0}px; margin: 1rem 0;"  />`;
        case 'Button':
          return `<a href="${(c.props as any).href}" style="display: inline-block; background-color: #4A90E2; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 9999px; font-weight: 600; margin: 1rem 0;">${(c.props as any).text}</a>`;
        case 'Video':
          return `<video controls src="${(c.props as any).src}" style="max-width: 100%; border-radius: 0.5rem; margin: 1rem 0;"></video>`; default:
          return '';
        }
      })
      .join('\n');

    if (!forExport) {
      return componentHtml;
    }

    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${pageName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Inter', sans-serif; margin: 0; padding: 2rem;
                        background-color: #f9fafb; color: #111827;
                    }
                </style>
            </head>
            <body>
                ${componentHtml}
            </body>
            </html>
        `;
  }, [components, pageName]);

  const handlePreview = useCallback(() => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      const htmlContent = generatePageHtml(true);
      previewWindow.document.write(htmlContent);
      previewWindow.document.close();
    }
  }, [generatePageHtml]);

  const handleExportHtml = useCallback(() => {
    const htmlContent = generatePageHtml(true);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pageName.toLowerCase().replace(/\s+/g, '-') || 'page'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('HTML file exported successfully!');
  }, [generatePageHtml, pageName, showToast]);

  const handleSaveAndDeploy = useCallback(async () => {
    if (!pageName.trim()) {
      showToast('Please enter a page name before saving.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // Using the API to save the page instead of the context function which may not exist
      await apiService.post(`/editor/pages/${pageId || 'new'}/save`, { pageName, components });
      showToast('Page saved successfully!', 'success');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save, page:', error);
      showToast('Failed to save page.', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [pageId, pageName, components, showToast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p>Loading Editor...</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col min-h-screen bg-gray-100 font-sans w-full max-w-full overflow-x-hidden pb-28 md:pb-0 text-slate-900">
        {/* Header */}
        <EditorHeader
          pageName={pageName}
          onPageNameChange={setPageName}
          onExportHtml={handleExportHtml}
          onPreview={handlePreview}
          aiPrompt={aiPrompt}
          onAiPromptChange={setAiPrompt}
          onGenerateWithAi={handleGenerateWithAi}
          isGeneratingAi={isGeneratingAi}
          onSaveAndDeploy={handleSaveAndDeploy}
          isSaving={isSaving}
        />

        {/* Main Editor Area */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="hidden md:block">
            <ComponentLibrary
              onDrop={addComponent}
            />
          </div>
          <div className="flex-1 flex overflow-y-auto p-2 sm:p-4">
            <Canvas
              components={components}
              projectId={pageId || ''}
              pageId={pageId || ''}
              onSave={handleSave}
              onPreview={handlePreview}
              onDrop={addComponent}
              onSelect={setSelectedComponentId}
              onDelete={deleteComponent}
            />
          </div>
          <div className="hidden lg:block w-80 bg-white border-l border-slate-300 p-4 overflow-y-auto">
            <PropertiesPanel
              component={selectedComponent || undefined}
              onUpdate={updateComponent}
            />
          </div>
        </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <nav
          aria-label="Enhanced Editor Mobile Navigation"
          className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
        >
          <button
            type="button"
            onClick={handlePreview}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={handleGenerateWithAi}
            disabled={isGeneratingAi}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer disabled:opacity-40"
          >
            <span>AI Gen</span>
          </button>
          <button
            type="button"
            onClick={handleExportHtml}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <span>Export</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAndDeploy}
            disabled={isSaving}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer disabled:opacity-40"
          >
            <span>Save</span>
          </button>
        </nav>
      </div>
    </DndProvider>
  );
};

export default EnhancedEditorPage;
