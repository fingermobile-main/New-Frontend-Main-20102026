import React, { useState, useRef, useEffect } from 'react';
import Terminal from './Terminal';
import Explorer from './Explorer';
import Search from './Search';
import VersionControl from './VersionControl';
import ThemeSelector from './ThemeSelector';
import Pages from './Pages';
import PlatformThemeSelector from './PlatformThemeSelector';
import AIGeneration from './AIGeneration';
import BusinessManagement from './BusinessManagement';
import MemberManagement from './MemberManagement';
import Analytics from './Analytics';
import Ecommerce from './Ecommerce';
import Security from './Security';
import Documentation from './Documentation';
import Deployment from './Deployment';
import Performance from './Performance';
import Backup from './Backup';
import Logs from './Logs';
import Notifications from './Notifications';
import Testing from './Testing';
import FileManager from './FileManager';
import Collaboration from './Collaboration';
import ApiManager from './ApiManager';
import Monitoring from './Monitoring';
import ProjectManagement from './ProjectManagement';
import Reporting from './Reporting';
import IntegrationManagement from './IntegrationManagement';
import MemberProfile from './MemberProfile';

interface ComponentType {
  id: string;
  name: string;
  type: string;
  props: Record<string, any>;
  position: { x: number; y: number };
}

interface CanvasElement {
  id: string;
  componentType: string;
  props: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const VisualEditor: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'blue'>('light');
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [activePanel, setActivePanel] = useState<'explorer' | 'search' | 'version-control' | 'theme' | 'pages' | 'platform-theme' | 'ai-generation' | 'business-management' | 'member-management' | 'analytics' | 'ecommerce' | 'security' | 'documentation' | 'deployment' | 'performance' | 'backup' | 'logs' | 'notifications' | 'testing' | 'files' | 'collaboration' | 'apis' | 'monitoring' | 'project-management' | 'reporting' | 'integrations' | 'member-profile' | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Available components for the drag-and-drop interface
  const availableComponents: ComponentType[] = [
    {
      id: 'button',
      name: 'Button',
      type: 'button',
      props: { text: 'Click Me', variant: 'primary' },
      position: { x: 0, y: 0 }
    },
    {
      id: 'text',
      name: 'Text',
      type: 'text',
      props: { content: 'Sample Text', fontSize: '16px' },
      position: { x: 0, y: 0 }
    },
    {
      id: 'image',
      name: 'Image',
      type: 'image',
      props: { src: '', alt: 'Image' },
      position: { x: 0, y: 0 }
    },
    {
      id: 'form',
      name: 'Form',
      type: 'form',
      props: { fields: [] },
      position: { x: 0, y: 0 }
    },
    {
      id: 'header',
      name: 'Header',
      type: 'header',
      props: { level: 1, text: 'Header' },
      position: { x: 0, y: 0 }
    },
    {
      id: 'container',
      name: 'Container',
      type: 'container',
      props: { padding: '10px', margin: '10px' },
      position: { x: 0, y: 0 }
    }
  ];

  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData('componentId', componentId);
    setDraggedComponent(componentId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentId = e.dataTransfer.getData('componentId');
    const component = availableComponents.find(c => c.id === componentId);

    if (component && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newElement: CanvasElement = {
        id: `element-${Date.now()}`,
        componentType: component.type,
        props: { ...component.props },
        position: { x, y },
        size: { width: 200, height: 50 }
      };

      setCanvasElements(prev => [...prev, newElement]);
      setDraggedComponent(null);
    }
  };

  const handleElementClick = (id: string) => {
    setSelectedComponent(id);
  };

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedComponent) {
      setCanvasElements(prev => 
        prev.map(el => 
          el.id === selectedComponent 
            ? { ...el, props: { ...el.props, [property]: value } } 
            : el
        )
      );
    }
  };

  const handleDeleteElement = () => {
    if (selectedComponent) {
      setCanvasElements(prev => prev.filter(el => el.id !== selectedComponent));
      setSelectedComponent(null);
    }
  };

  const toggleTheme = (themeId?: string) => {
    if (themeId) {
      setTheme(themeId as 'light' | 'dark' | 'blue');
    } else {
      setTheme(prev => {
        if (prev === 'light') return 'dark';
        if (prev === 'dark') return 'blue';
        return 'light';
      });
    }
  };

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedComponent === element.id;
    const style: React.CSSProperties = {
      position: 'absolute',
      left: element.position.x,
      top: element.position.y,
      width: element.size.width,
      height: element.size.height,
      border: isSelected ? '2px dashed #4f46e5' : '1px solid transparent',
      padding: '5px',
      cursor: 'move',
      backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#dbeafe' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
      outline: isSelected ? '1px solid #4f46e5' : 'none'
    };

    switch (element.componentType) {
      case 'button':
        return (
          <button
            key={element.id}
            style={style}
            onClick={() => handleElementClick(element.id)}
          >
            {element.props.text || 'Button'}
          </button>
        );
      case 'text':
        return (
          <div
            key={element.id}
            style={style}
            onClick={() => handleElementClick(element.id)}
          >
            {element.props.content || 'Text'}
          </div>
        );
      case 'image':
        return (
          <img
            key={element.id}
            src={element.props.src || 'https://via.placeholder.com/150'}
            alt={element.props.alt || 'Placeholder'}
            style={style}
            onClick={() => handleElementClick(element.id)}
          />
        );
      case 'header':
        const HeaderTag = `h${element.props.level || 1}` as keyof JSX.IntrinsicElements;
        return (
          <HeaderTag
            key={element.id}
            style={style}
            onClick={() => handleElementClick(element.id)}
          >
            {element.props.text || 'Header'}
          </HeaderTag>
        );
      case 'container':
        return (
          <div
            key={element.id}
            style={style}
            onClick={() => handleElementClick(element.id)}
          >
            Container
          </div>
        );
      default:
        return (
          <div
            key={element.id}
            style={style}
            onClick={() => handleElementClick(element.id)}
          >
            {element.componentType}
          </div>
        );
    }
  };

  return (
    <div className={`stercs-editor ${theme}`} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      backgroundColor: theme === 'dark' ? '#1f2937' : theme === 'blue' ? '#eff6ff' : '#f9fafb'
    }}>
      <header className="editor-header" style={{ 
        padding: '1rem', 
        backgroundColor: theme === 'dark' ? '#111827' : theme === 'blue' ? '#dbeafe' : '#e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ color: theme === 'dark' ? 'white' : '#1f2937', margin: 0 }}>STERCS Visual Editor</h1>
          <div style={{ marginLeft: '2rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setActivePanel(activePanel === 'explorer' ? null : 'explorer')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'explorer' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Explorer
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'search' ? null : 'search')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'search' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Search
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'version-control' ? null : 'version-control')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'version-control' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Version Control
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'theme' ? null : 'theme')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'theme' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Themes
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'platform-theme' ? null : 'platform-theme')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'platform-theme' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Platform Theme
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'ai-generation' ? null : 'ai-generation')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'ai-generation' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              AI Tools
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'business-management' ? null : 'business-management')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'business-management' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Business Tools
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'member-management' ? null : 'member-management')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'member-management' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Member Management
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'analytics' ? null : 'analytics')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'analytics' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Analytics
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'ecommerce' ? null : 'ecommerce')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'ecommerce' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              E-commerce
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'security' ? null : 'security')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'security' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Security
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'documentation' ? null : 'documentation')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'documentation' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Documentation
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'deployment' ? null : 'deployment')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'deployment' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Deployment
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'performance' ? null : 'performance')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'performance' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Performance
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'backup' ? null : 'backup')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'backup' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Backup
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'logs' ? null : 'logs')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'logs' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logs
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'notifications' ? null : 'notifications')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'notifications' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Notifications
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'testing' ? null : 'testing')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'testing' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Testing
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'files' ? null : 'files')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'files' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              File Manager
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'collaboration' ? null : 'collaboration')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'collaboration' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Collaboration
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'apis' ? null : 'apis')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'apis' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              API Management
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'monitoring' ? null : 'monitoring')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'monitoring' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Monitoring
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'project-management' ? null : 'project-management')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'project-management' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Project Management
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'reporting' ? null : 'reporting')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'reporting' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reporting
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'integrations' ? null : 'integrations')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'integrations' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Integrations
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'member-profile' ? null : 'member-profile')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'member-profile' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Profile
            </button>
            <button 
              onClick={() => setActivePanel(activePanel === 'pages' ? null : 'pages')}
              className="toolbar-btn"
              style={{
                padding: '0.5rem',
                backgroundColor: activePanel === 'pages' ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
                color: theme === 'dark' ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Pages
            </button>
          </div>
        </div>
        <div className="header-controls">
          <button 
            onClick={() => toggleTheme()}
            className="theme-toggle-btn"
            style={{
              padding: '0.5rem',
              marginRight: '1rem',
              backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db',
              color: theme === 'dark' ? 'white' : '#1f2937',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Toggle Theme
          </button>
          <button 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="preview-btn"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isPreviewMode ? '#10b981' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
          <button 
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            className="terminal-btn"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isTerminalOpen ? '#10b981' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '0.5rem'
            }}
          >
            Terminal
          </button>
        </div>
      </header>

      <div className="editor-main" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel - Explorer, Search, Version Control, Themes, Platform Theme, AI Generation, Business Management, Member Management, Analytics, E-commerce, Security, Documentation, Deployment, Performance, Backup, Logs, Notifications, Testing, File Manager, Collaboration, API Management, Monitoring, Project Management, Reporting, Integrations, Member Profile, or Pages */}
        {activePanel && (
          <div className="left-panel" style={{ 
            width: '300px', 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: theme === 'dark' ? '#1f2937' : theme === 'blue' ? '#dbeafe' : '#e5e7eb',
            borderRight: '1px solid #d1d5db',
            zIndex: 10
          }}>
            {activePanel === 'explorer' && (
              <Explorer 
                theme={theme} 
                projectId="1" // In a real app, this would be the actual project ID
              />
            )}
            {activePanel === 'search' && (
              <Search theme={theme} />
            )}
            {activePanel === 'version-control' && (
              <VersionControl 
                theme={theme} 
                projectId="1" // In a real app, this would be the actual project ID
              />
            )}
            {activePanel === 'theme' && (
              <ThemeSelector 
                currentTheme={theme} 
                onThemeChange={toggleTheme} 
                theme={theme} 
              />
            )}
            {activePanel === 'platform-theme' && (
              <PlatformThemeSelector 
                theme={theme} 
              />
            )}
            {activePanel === 'ai-generation' && (
              <AIGeneration 
                theme={theme} 
              />
            )}
            {activePanel === 'business-management' && (
              <BusinessManagement 
                theme={theme} 
              />
            )}
            {activePanel === 'member-management' && (
              <MemberManagement 
                theme={theme} 
              />
            )}
            {activePanel === 'analytics' && (
              <Analytics 
                theme={theme} 
              />
            )}
            {activePanel === 'ecommerce' && (
              <Ecommerce 
                theme={theme} 
              />
            )}
            {activePanel === 'security' && (
              <Security 
                theme={theme} 
              />
            )}
            {activePanel === 'documentation' && (
              <Documentation 
                theme={theme} 
              />
            )}
            {activePanel === 'deployment' && (
              <Deployment 
                theme={theme} 
              />
            )}
            {activePanel === 'performance' && (
              <Performance 
                theme={theme} 
              />
            )}
            {activePanel === 'backup' && (
              <Backup 
                theme={theme} 
              />
            )}
            {activePanel === 'logs' && (
              <Logs 
                theme={theme} 
              />
            )}
            {activePanel === 'notifications' && (
              <Notifications 
                theme={theme} 
              />
            )}
            {activePanel === 'testing' && (
              <Testing 
                theme={theme} 
              />
            )}
            {activePanel === 'files' && (
              <FileManager 
                theme={theme} 
              />
            )}
            {activePanel === 'collaboration' && (
              <Collaboration 
                theme={theme} 
              />
            )}
            {activePanel === 'apis' && (
              <ApiManager 
                theme={theme} 
              />
            )}
            {activePanel === 'monitoring' && (
              <Monitoring 
                theme={theme} 
              />
            )}
            {activePanel === 'project-management' && (
              <ProjectManagement 
                theme={theme} 
              />
            )}
            {activePanel === 'reporting' && (
              <Reporting 
                theme={theme} 
              />
            )}
            {activePanel === 'integrations' && (
              <IntegrationManagement 
                theme={theme} 
              />
            )}
            {activePanel === 'member-profile' && (
              <MemberProfile 
                theme={theme} 
              />
            )}
            {activePanel === 'pages' && (
              <Pages 
                theme={theme} 
                projectId="1" // In a real app, this would be the actual project ID
              />
            )}
          </div>
        )}

        {/* Components Panel */}
        <div className="components-panel" style={{ 
          width: activePanel ? '200px' : '250px', 
          padding: '1rem', 
          backgroundColor: theme === 'dark' ? '#1f2937' : theme === 'blue' ? '#dbeafe' : '#e5e7eb',
          borderRight: '1px solid #d1d5db'
        }}>
          <h2 style={{ color: theme === 'dark' ? 'white' : '#1f2937', marginBottom: '1rem' }}>Components</h2>
          <div className="components-list">
            {availableComponents.map(component => (
              <div
                key={component.id}
                draggable
                onDragStart={(e) => handleDragStart(e, component.id)}
                className="component-item"
                style={{
                  padding: '0.75rem',
                  margin: '0.5rem 0',
                  backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'grab',
                  color: theme === 'dark' ? 'white' : '#1f2937',
                  userSelect: 'none'
                }}
              >
                {component.name}
              </div>
            ))}
          </div>

          <div className="templates-section" style={{ marginTop: '2rem' }}>
            <h3 style={{ color: theme === 'dark' ? 'white' : '#1f2937', marginBottom: '1rem' }}>Templates</h3>
            <div className="template-list">
              <div className="template-item" style={{
                padding: '0.75rem',
                margin: '0.5rem 0',
                backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                color: theme === 'dark' ? 'white' : '#1f2937'
              }}>
                Landing Page
              </div>
              <div className="template-item" style={{
                padding: '0.75rem',
                margin: '0.5rem 0',
                backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                color: theme === 'dark' ? 'white' : '#1f2937'
              }}>
                Blog Layout
              </div>
              <div className="template-item" style={{
                padding: '0.75rem',
                margin: '0.5rem 0',
                backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                color: theme === 'dark' ? 'white' : '#1f2937'
              }}>
                Portfolio
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          className="canvas-container" 
          style={{ 
            flex: 1, 
            padding: '1rem', 
            overflow: 'auto',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white'
          }}
        >
          <div
            ref={canvasRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="canvas"
            style={{
              position: 'relative',
              width: '100%',
              height: '80vh',
              border: '1px dashed #d1d5db',
              backgroundColor: theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#dbeafe' : '#f3f4f6',
              overflow: 'hidden'
            }}
          >
            {canvasElements.map(element => renderElement(element))}
            
            {canvasElements.length === 0 && !isPreviewMode && (
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                }}
              >
                <p>Drag components here to start building your page</p>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedComponent && (
          <div className="properties-panel" style={{ 
            width: '300px', 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#1f2937' : theme === 'blue' ? '#dbeafe' : '#e5e7eb',
            borderLeft: '1px solid #d1d5db'
          }}>
            <h2 style={{ color: theme === 'dark' ? 'white' : '#1f2937', marginBottom: '1rem' }}>Properties</h2>
            
            <div className="property-controls" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: theme === 'dark' ? 'white' : '#1f2937' }}>
                Text Content
              </label>
              <input
                type="text"
                value={canvasElements.find(el => el.id === selectedComponent)?.props.content || 
                       canvasElements.find(el => el.id === selectedComponent)?.props.text || ''}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#374151' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              />
            </div>
            
            <div className="property-controls" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: theme === 'dark' ? 'white' : '#1f2937' }}>
                Background Color
              </label>
              <input
                type="color"
                value={canvasElements.find(el => el.id === selectedComponent)?.props.bgColor || '#ffffff'}
                onChange={(e) => handlePropertyChange('bgColor', e.target.value)}
                style={{ width: '100%', height: '40px', border: 'none', borderRadius: '4px' }}
              />
            </div>
            
            <div className="property-controls" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: theme === 'dark' ? 'white' : '#1f2937' }}>
                Width
              </label>
              <input
                type="range"
                min="50"
                max="500"
                value={canvasElements.find(el => el.id === selectedComponent)?.size.width || 200}
                onChange={(e) => {
                  const width = parseInt(e.target.value);
                  setCanvasElements(prev => 
                    prev.map(el => 
                      el.id === selectedComponent 
                        ? { ...el, size: { ...el.size, width } } 
                        : el
                    )
                  );
                }}
                style={{ width: '100%' }}
              />
              <span style={{ color: theme === 'dark' ? 'white' : '#1f2937' }}>
                {canvasElements.find(el => el.id === selectedComponent)?.size.width || 200}px
              </span>
            </div>
            
            <div className="property-controls" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: theme === 'dark' ? 'white' : '#1f2937' }}>
                Height
              </label>
              <input
                type="range"
                min="50"
                max="500"
                value={canvasElements.find(el => el.id === selectedComponent)?.size.height || 50}
                onChange={(e) => {
                  const height = parseInt(e.target.value);
                  setCanvasElements(prev => 
                    prev.map(el => 
                      el.id === selectedComponent 
                        ? { ...el, size: { ...el.size, height } } 
                        : el
                    )
                  );
                }}
                style={{ width: '100%' }}
              />
              <span style={{ color: theme === 'dark' ? 'white' : '#1f2937' }}>
                {canvasElements.find(el => el.id === selectedComponent)?.size.height || 50}px
              </span>
            </div>
            
            <button
              onClick={handleDeleteElement}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Delete Element
            </button>
          </div>
        )}
      </div>

      <footer className="editor-footer" style={{ 
        padding: '0.5rem', 
        backgroundColor: theme === 'dark' ? '#111827' : theme === 'blue' ? '#dbeafe' : '#e5e7eb',
        textAlign: 'center',
        color: theme === 'dark' ? 'white' : '#1f2937',
        fontSize: '0.875rem'
      }}>
        STERCS Visual Editor - No Code Website Builder
      </footer>
      
      {/* Terminal Component */}
      {isTerminalOpen && <Terminal />}
    </div>
  );
};

export default VisualEditor;