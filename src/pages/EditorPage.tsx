import { useNavigate, useParams} from 'react-router-dom';
import React, { useEffect, useState, useContext, useCallback } from 'react';

import { useAppContext } from '../contexts/AppContext';

// Use require for CommonJS compatibility with react-dnd

import { DndProvider } from 'react-dnd';

import { HTML5Backend } from 'react-dnd-html5-backend';

import Canvas from '../components/editor/Canvas';
import PropertiesPanel from '../components/editor/PropertiesPanel';
import type { EditorComponent } from '../types';
import { generateUniqueId } from '../utils/id';
import { EditorContext } from '../contexts/EditorContext';
import apiService from '../services/apiService';
import {
  PencilIcon,
  SparklesIcon,
  CloudArrowUpIcon,
  CogIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  EyeIcon,
  CodeBracketIcon
} from '@heroicons/react/24/solid';

// ---, Subcomponent: Editor Toolbar ---
interface EditorToolbarProps {
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  pageName: string; onPageNameChange: (name: string) => void; ficBalance: number; aiPrompt: string; onAiPromptChange: (prompt: string) => void; onGenerateWithAi: () => void; onPreview: () => void; onExportHtml: () => void; onSaveAndDeploy: () => void; isGeneratingAi: boolean; isSaving: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = React.memo(({
  pageName,
  onPageNameChange,
  ficBalance,
  aiPrompt,
  onAiPromptChange,
  onGenerateWithAi,
  onPreview,
  onExportHtml,
  onSaveAndDeploy,
  isGeneratingAi,
  isSaving
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center">
        <div className="bg-white/20 p-2 rounded-lg">
          <PencilIcon className="h-6 w-6 text-white" />
        </div>
        <input
          type="text"
          value={pageName}
          onChange={(e) => onPageNameChange(e.target.value)}
          className="ml-3 font-semibold text-lg text-white bg-transparent border-b border-white/30, focus:outline-none, focus:border-white"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-white/20 px-3 py-1.5 rounded-lg flex items-center">
          <div className="bg-yellow-100 p-1 rounded">
            <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="ml-2 text-white font-medium">{ficBalance.toFixed(2)} FIC</span>
        </div>

        <input
          type="text"
          value={aiPrompt}
          onChange={(e) => onAiPromptChange(e.target.value)}
          placeholder="Describe component to AI..."
          className="px-4 py-2 text-sm border border-white/30 rounded-full bg-white/20 placeholder-white/70 text-white, focus:outline-none, focus:ring-2, focus:ring-white/30"
        />
        <button
          onClick={onGenerateWithAi}
          disabled={isGeneratingAi}
          className="px-4 py-2 text-sm font-semibold bg-white text-blue-600 rounded-full, hover:bg-gray-100, disabled:bg-gray-300 flex items-center"
        >
          <SparklesIcon className="h-4 w-4 mr-1" />
          {isGeneratingAi ? 'Generating...' : 'AI Gen'}
        </button>

        <button
          onClick={onPreview}
          className="px-4 py-2 text-sm font-semibold bg-white/20 text-white rounded-full, hover:bg-white/30 flex items-center"
        >
          <EyeIcon className="h-4 w-4 mr-1" />
          Preview
        </button>

        <button
          onClick={onExportHtml}
          className="px-4 py-2 text-sm font-semibold bg-white/20 text-white rounded-full, hover:bg-white/30 flex items-center"
        >
          <CodeBracketIcon className="h-4 w-4 mr-1" />
          Export
        </button>

        <button
          onClick={onSaveAndDeploy}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-semibold bg-white text-blue-600 rounded-full, hover:bg-gray-100, disabled:bg-gray-300 flex items-center"
        >
          <CloudArrowUpIcon className="h-4 w-4 mr-1" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </header>
  );
});

EditorToolbar.displayName = 'EditorToolbar';

// ---, Subcomponent: Component Library Sidebar ---
interface ComponentLibrarySidebarProps {
  // eslint-disable-next-line no-unused-vars
  onAddComponent: (type: string) => void;
}

const ComponentLibrarySidebar: React.FC<ComponentLibrarySidebarProps> = React.memo(({ onAddComponent }) => {
  const components = [
    { name: 'Header', icon: DocumentTextIcon },
    { name: 'TextBlock', icon: DocumentTextIcon },
    { name: 'Image', icon: PhotoIcon },
    { name: 'Video', icon: VideoCameraIcon },
    { name: 'Button', icon: null }
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-300 p-4 overflow-y-auto">
      <h2 className="font-bold text-gray-700 mb-4 flex items-center">
        <CogIcon className="h-5 w-5 mr-2 text-blue-500" />
        Components
      </h2>
      <div className="space-y-2">
        {components.map((comp) => (
          <button
            key={comp.name}
            onClick={() => onAddComponent(comp.name)}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700, hover:bg-gray-100 rounded-lg"
          >
            {comp.icon && <comp.icon className="h-5 w-5 mr-2 text-blue-500" />}
            {comp.name}
          </button>
        ))}
      </div>
    </div>
  );
});

ComponentLibrarySidebar.displayName = 'ComponentLibrarySidebar';

// ---, Subcomponent: Properties Panel Sidebar ---
interface PropertiesPanelSidebarProps {
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  selectedComponent: EditorComponent | null; onUpdate: (id: string, updated: Partial<EditorComponent['props']>) => void;
}

const PropertiesPanelSidebar: React.FC<PropertiesPanelSidebarProps> = React.memo(({ selectedComponent, onUpdate }) => {
  if (!selectedComponent) {
    return (
      <div className="text-center py-10 text-gray-500">
        <PencilIcon className="h-12 w-12 mx-auto text-gray-300" />
        <p>Select a component to edit its properties</p>
      </div>
    );
  }

  return (
    <PropertiesPanel
      component={selectedComponent}
      onUpdate={onUpdate}
    />
  );
});

PropertiesPanelSidebar.displayName = 'PropertiesPanelSidebar';

// --- Main Container Page Component ---
const EditorPage: React.FC = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { showToast, ficBalance: _ficBalance } = useAppContext();
  const editorContext = useContext(EditorContext) as any;
  // eslint-disable-next-line no-unused-vars
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
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const onVote = useCallback(async (_postId: string, _voteType: unknown) => {
    showToast('Vote action triggered', 'info');
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
      showToast('Please enter a prompt for AI generation.');
      return;
    }

    setIsGeneratingAi(true);
    try {
      const generatedComponents = await apiService.post('/editor/generate-ai', { prompt: aiPrompt });
      setComponents((prev) => [...prev, ...(generatedComponents as EditorComponent[])]);
      setAiPrompt('');
      showToast('AI generated components added to canvas!');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to generate AI, components:', error);
      showToast('Failed to generate AI components.');
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
          setComponents([]);
          setPageName('Untitled Page');
          setIsLoading(false);
        }
      }
    };

    fetchPageData();

    return () => {
      isMounted = false;
    };
  }, [pageId, navigate, showToast]);

  const addComponent = useCallback((type: string) => {
    let defaultProps: any = {};
    let componentType: EditorComponent['type'] = 'text';

    switch (type) {
    case 'Header':
      defaultProps = { text: 'New Header' };
      componentType = 'text';
      break;
    case 'TextBlock':
      defaultProps = { text: 'This is a new text block. Click to edit.' };
      componentType = 'text';
      break;
    case 'Image':
      defaultProps = {
        src: 'https://picsum.photos/seed/editor/600/400',
        alt: 'Placeholder Image'
      };
      componentType = 'image';
      break;
    case 'Button':
      defaultProps = { text: 'Click Me', href: '#' };
      componentType = 'text';
      break;
    case 'Video':
      defaultProps = {
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      };
      componentType = 'video';
      break;
    case 'Workflow':
      defaultProps = { workflowName: 'New Workflow', steps: [] };
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

  const deleteComponent = useCallback((id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId]);

  const moveComponent = useCallback((dragIndex: number, hoverIndex: number) => {
    setComponents((prev) => {
      const newComponents = [...prev];
      const [draggedItem] = newComponents.splice(dragIndex, 1);
      newComponents.splice(hoverIndex, 0, draggedItem);
      return newComponents;
    });
  }, []);

  const selectedComponent =
    components.find((c) => c.id === selectedComponentId) || null;

  const generatePageHtml = useCallback((forExport = false) => {
    const componentHtml = components
      .map((c) => {
        // 确保 props 存在
        const props = c.props || {};

        switch (c.type) {
        case 'text':
          return `<div style="margin: 1rem 0;">${props.text || ''}</div>`;
        case 'image':
          return `<img src="${props.src || ''}" alt="${props.alt || ''}" style="max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0;" />`;
        case 'video':
          return `<video controls src="${props.src || ''}" style="max-width: 100%; border-radius: 0.5rem; margin: 1rem 0;"></video>`; default:
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
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 2rem; background-color: #f9fafb; color: #111827; }
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
      showToast('Please enter a page name before saving.');
      return;
    }

    setIsSaving(true);
    try {
      // Using the API to save the page instead of the context function which may not exist
      await apiService.post(`/editor/pages/${pageId || 'new'}/save`, { pageName, components });
      showToast('Page saved successfully!');
      if (!pageId) {
        // In a real scenario, we'd navigate to the new page's route
        // navigate(`/editor/${newPageId}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save, page:', error);
      showToast('Failed to save page.');
    } finally {
      setIsSaving(false);
    }
  }, [pageId, pageName, components, showToast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gray-100 font-sans">
        <EditorToolbar
          pageName={pageName}
          onPageNameChange={setPageName}
          ficBalance={_ficBalance}
          aiPrompt={aiPrompt}
          onAiPromptChange={setAiPrompt}
          onGenerateWithAi={handleGenerateWithAi}
          onPreview={handlePreview}
          onExportHtml={handleExportHtml}
          onSaveAndDeploy={handleSaveAndDeploy}
          isGeneratingAi={isGeneratingAi}
          isSaving={isSaving}
        />
        <div className="flex flex-1 overflow-hidden">
          <ComponentLibrarySidebar onAddComponent={addComponent} />

          <div className="flex-1 flex overflow-y-auto bg-gray-100">
            <Canvas
              components={components}
              onAdd={addComponent}
              onDelete={deleteComponent}
              onMove={moveComponent}
              onSelect={setSelectedComponentId}
              selectedComponentId={selectedComponentId}
            />
          </div>

          <div className="w-80 bg-white border-l border-slate-300 p-4 overflow-y-auto">
            <PropertiesPanelSidebar
              selectedComponent={selectedComponent}
              onUpdate={updateComponent}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default EditorPage;
