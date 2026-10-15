import { Link} from 'react-router-dom';
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

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const insertFormatting = (format: string) => {
    // Simple formatting simulation - in production, use a proper rich text library
    let formatted = content;

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

  const toolbarButtons = [
    { icon: '𝐁', action: () => insertFormatting('bold'), active: isBold, title: 'Bold' },
    { icon: '𝐼', action: () => insertFormatting('italic'), active: isItalic, title: 'Italic' },
    { icon: 'U̲', action: () => insertFormatting('underline'), active: isUnderline, title: 'Underline' },
    { icon: '📋', action: () => {/* paste */}, title: 'Paste' },
    { icon: '🔗', action: () => {/* link */}, title: 'Insert Link' },
    { icon: '🖼️', action: () => {/* image */}, title: 'Insert Image' },
    { icon: '📝', action: () => {/* code */}, title: 'Code Block' },
    { icon: '•', action: () => {/* bullet */}, title: 'Bullet List' },
    { icon: '1.', action: () => {/* numbered */}, title: 'Numbered List' }
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center gap-2 flex-wrap">
        {/* Formatting Buttons */}
        {toolbarButtons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.action}
            title={btn.title}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors ${
              btn.active ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold' : 'text-gray-700'
            }`}
          >
            {btn.icon}
          </button>
        ))}

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Font Size Selector */}
        <select
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>

        {/* Font Family Selector */}
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          {['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'].map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Color Picker */}
        <input
          type="color"
          className="w-8 h-8 rounded cursor-pointer"
          title="Text Color"
        />

        <div className="flex-1" />

        {/* Undo/Redo */}
        <button className="px-3 py-1.5 rounded hover:bg-gray-200 transition-colors" title="Undo">
          ↩️
        </button>
        <button className="px-3 py-1.5 rounded hover:bg-gray-200 transition-colors" title="Redo">
          ↪️
        </button>
      </div>

      {/* Editor Area */}
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder={placeholder}
        style={{
          minHeight,
          fontFamily,
          fontSize: `${fontSize}px`,
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          textDecoration: isUnderline ? 'underline' : 'none'
        }}
        className="w-full px-4 py-3 focus:outline-none resize-y"
      />

      {/* Footer Info */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
        <span>{content.length} characters</span>
        <span>{content.split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </div>
  );
};

export default RichTextEditor;
