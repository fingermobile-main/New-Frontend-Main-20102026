import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';

import { useAppContext } from '../contexts/AppContext';
import { useEditor } from '../contexts/EditorContext';
// Use require for CommonJS compatibility with react-dnd
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DndProvider } = require("react-dnd");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { HTML5Backend } = require("react-dnd-html5-backend");

import ComponentLibrary from '../components/editor/ComponentLibrary';
import Canvas from '../components/editor/Canvas';
import PropertiesPanel from '../components/editor/PropertiesPanel';
import type { EditorComponent } from '../types';
import { generateUniqueId } from '../utils/id';
import * as api from '../services/api';

// ---, Subcomponent: Decoupled Editor Header ---
interface EditorHeaderProps {
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
    <header className="bg-white border-b p-3, sm:p-4, lg:p-5 flex flex-wrap justify-between items-center flex-shrink-0 gap-2">
      <input
        type="text"
        value={pageName}
        onChange={(e) => onPageNameChange(e.target.value)}
        className="font-semibold text-base, sm:text-lg border-transparent rounded-md, focus:ring-2, focus:ring-brand-blue, focus:border-transparent flex-1 min-w-[200px]"
      />
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onExportHtml}
          className="px-4 py-2 text-xs, sm:text-sm font-semibold bg-white border border-gray-300 rounded-full, hover:bg-gray-50 whitespace-nowrap"
        >
          Export HTML
        </button>
        <button
          onClick={onPreview}
          className="px-4 py-2 text-xs, sm:text-sm font-semibold bg-white border border-gray-300 rounded-full, hover:bg-gray-50 whitespace-nowrap"
        >
          Preview
        </button>
        <input
          type="text"
          value={aiPrompt}
          onChange={(e) => onAiPromptChange(e.target.value)}
          placeholder="Describe component to AI..."
          className="px-4 py-2 text-xs, sm:text-sm border border-gray-300 rounded-full, focus:ring-2, focus:ring-brand-blue, focus:border-transparent flex-1 min-w-[150px]"
        />
        <button
          onClick={onGenerateWithAi}
          disabled={isGeneratingAi}
          className="px-4 py-2 text-xs, sm:text-sm font-semibold bg-purple-600 text-white rounded-full, hover:bg-purple-700, disabled:bg-gray-400 whitespace-nowrap"
        >
          {isGeneratingAi ? "Generating..." : "Generate with AI"}
        </button>
        <button
          onClick={onSaveAndDeploy}
          disabled={isSaving}
          className="px-4 py-2 text-xs, sm:text-sm font-semibold bg-brand-blue text-white rounded-full, hover:bg-blue-700, disabled:bg-gray-400 whitespace-nowrap"
        >
          {isSaving ? "Saving..." : "Save & Deploy"}
        </button>
      </div>
    </header>
  );
});

EditorHeader.displayName = "EditorHeader";

const EnhancedEditorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-bold">Enhanced Editor Page</h1>
      <p>This is the enhanced editor page.</p>
    </div>
  );
};

export default EnhancedEditorPage;