import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
export interface EditorProject {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image' | 'document';
  lastModified: string;
  autoSaveEnabled: boolean;
}

interface EditorState {
  currentProject: EditorProject | null;
  isDirty: boolean;
  autoSaveEnabled: boolean;
  unsavedChanges: boolean;
}

interface EditorContextType {
  state: EditorState;
  publishedPages: EditorProject[];
  openProject: (project: EditorProject) => void;
  closeProject: () => void;
  markDirty: () => void;
  markClean: () => void;
  toggleAutoSave: () => void;
  saveProject: () => Promise<void>;
  handleDeletePage: (pageId: string) => Promise<void>;
}

const initialState: EditorState = {
  currentProject: null,
  isDirty: false,
  autoSaveEnabled: true,
  unsavedChanges: false
};

export const EditorContext = createContext<EditorContextType | undefined>(undefined);

interface EditorProviderProps {
  children: ReactNode;
}

export function EditorProvider({ children }: EditorProviderProps) {
  const [state, setState] = useState<EditorState>(initialState);
  const [publishedPages, setPublishedPages] = useState<EditorProject[]>([]);

  const openProject = useCallback((project: EditorProject) => {
    setState({
      currentProject: project,
      isDirty: false,
      autoSaveEnabled: project.autoSaveEnabled,
      unsavedChanges: false
    });
  }, []);

  const closeProject = useCallback(() => {
    setState(initialState);
  }, []);

  const markDirty = useCallback(() => {
    setState((prev) => ({ ...prev, isDirty: true, unsavedChanges: true }));
  }, []);

  const markClean = useCallback(() => {
    setState((prev) => ({ ...prev, isDirty: false, unsavedChanges: false }));
  }, []);

  const toggleAutoSave = useCallback(() => {
    setState((prev) => ({ ...prev, autoSaveEnabled: !prev.autoSaveEnabled }));
  }, []);

  const saveProject = useCallback(async () => {
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 500));
    setState((prev) => ({ ...prev, isDirty: false, unsavedChanges: false }));
  }, []);

  const handleDeletePage = useCallback(async (pageId: string) => {
    // Simulate delete operation
    await new Promise((resolve) => setTimeout(resolve, 300));
    setPublishedPages(prev => prev.filter(page => page.id !== pageId));
  }, []);

  const value: EditorContextType = {
    state,
    publishedPages,
    openProject,
    closeProject,
    markDirty,
    markClean,
    toggleAutoSave,
    saveProject,
    handleDeletePage
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor(): EditorContextType {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}

export default EditorProvider;
