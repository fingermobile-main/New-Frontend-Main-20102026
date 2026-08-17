import React from 'react';

export type EditorContent = Record<string, unknown> | string | null;

export interface EditorContextType {
  editorState: EditorContent;
  setEditorState: (state: EditorContent) => void;
  saveContent: () => void;
  loadContent: () => void;
}

export const EditorContext = React.createContext<EditorContextType | undefined>(
  undefined
);

export const useEditor = () => {
  const context = React.useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};