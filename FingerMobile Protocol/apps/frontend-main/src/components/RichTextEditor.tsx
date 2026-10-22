import React, { useState } from 'react';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Start writing...',
  minHeight = 200
}) => {
  const [content, setContent] = useState(value);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const updateContentWithHistory = (newVal: string) => {
    setContent(newVal);
    onChange?.(newVal);
    setHistory(prev => [...prev.slice(0, historyIdx + 1), newVal]);
    setHistoryIdx(prev => prev + 1);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateContentWithHistory(e.target.value);
  };

  const insertFormatting = (format: string) => {
    switch (format) {
    case 'bold':
      setIsBold(!isBold);
      break;
    case 'italic':
      setIsItalic(!isItalic);
      break;
    case 'underline':
      setIsUnderline(!isUnderline);
      break;
    }
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          updateContentWithHistory(content + text);
        }
      }
    } catch {
      // Clipboard access not granted
    }
  };

  const handleInsertLink = () => {
    const url = window.prompt('Enter link URL:');
    if (url) {
      updateContentWithHistory(`${content} [${url}](${url})`);
    }
  };

  const handleInsertImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      updateContentWithHistory(`${content}\n![image](${url})\n`);
    }
  };

  const handleCodeBlock = () => {
    updateContentWithHistory(`${content}\n\`\`\`\n// code\n\`\`\`\n`);
  };

  const handleBulletList = () => {
    updateContentWithHistory(`${content}\n• `);
  };

  const handleNumberedList = () => {
    updateContentWithHistory(`${content}\n1. `);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      setHistoryIdx(prevIdx);
      setContent(history[prevIdx]);
      onChange?.(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      setContent(history[nextIdx]);
      onChange?.(history[nextIdx]);
    }
  };

  const toolbarButtons = [
    { icon: '𝐁', action: () => insertFormatting('bold'), active: isBold, title: 'Bold', label: 'Toggle bold' },
    { icon: '𝐼', action: () => insertFormatting('italic'), active: isItalic, title: 'Italic', label: 'Toggle italic' },
    { icon: 'U̲', action: () => insertFormatting('underline'), active: isUnderline, title: 'Underline', label: 'Toggle underline' },
    { icon: '📋', action: handlePaste, title: 'Paste', label: 'Paste text from clipboard' },
    { icon: '🔗', action: handleInsertLink, title: 'Insert Link', label: 'Insert link' },
    { icon: '🖼️', action: handleInsertImage, title: 'Insert Image', label: 'Insert image' },
    { icon: '📝', action: handleCodeBlock, title: 'Code Block', label: 'Insert code block' },
    { icon: '•', action: handleBulletList, title: 'Bullet List', label: 'Insert bullet list item' },
    { icon: '1.', action: handleNumberedList, title: 'Numbered List', label: 'Insert numbered list item' }
  ];

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-300 p-2 flex items-center gap-2 flex-wrap">
        {/* Formatting Buttons */}
        {toolbarButtons.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={btn.action}
            title={btn.title}
            aria-label={btn.label}
            className={`px-3 py-1.5 rounded hover:bg-slate-200 transition-colors ${
              btn.active ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold' : 'text-slate-700'
            }`}
          >
            {btn.icon}
          </button>
        ))}

        <div className="w-px h-6 bg-slate-300 mx-2" />

        {/* Font Size Selector */}
        <select
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          aria-label="Font size"
          className="px-2 py-1 border border-slate-300 rounded text-sm text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500"
        >
          {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>

        {/* Font Family Selector */}
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          aria-label="Font family"
          className="px-2 py-1 border border-slate-300 rounded text-sm text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500"
        >
          {['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'].map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>

        <div className="w-px h-6 bg-slate-300 mx-2" />

        {/* Color Picker */}
        <input
          type="color"
          className="w-8 h-8 rounded cursor-pointer text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
          title="Text Color"
          aria-label="Text Color"
        />

        <div className="flex-1" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={handleUndo}
          disabled={historyIdx === 0}
          className="px-3 py-1.5 rounded hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 font-bold"
          title="Undo"
          aria-label="Undo last change"
        >
          ↩️
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={historyIdx >= history.length - 1}
          className="px-3 py-1.5 rounded hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 font-bold"
          title="Redo"
          aria-label="Redo last change"
        >
          ↪️
        </button>
      </div>

      {/* Editor Area */}
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder={placeholder}
        aria-label="Rich text editor content"
        style={{
          minHeight,
          fontFamily,
          fontSize: `${fontSize}px`,
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          textDecoration: isUnderline ? 'underline' : 'none'
        }}
        className="w-full px-4 py-3 focus:outline-none resize-y text-slate-900 bg-white"
      />

      {/* Footer Info */}
      <div className="bg-slate-50 border-t border-slate-300 px-4 py-2 flex items-center justify-between text-xs text-slate-700 font-semibold">
        <span>{content.length} characters</span>
        <span>{content.split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </div>
  );
};

export default RichTextEditor;
