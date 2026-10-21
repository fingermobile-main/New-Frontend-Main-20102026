/*
 * FingerMobile Protocol™ - Enterprise Rich Text Editor (RTE)
 * Word processor component for visual formatting, media embeds,
 * sanitized markup output (HTML/Markdown/JSON), and XSS prevention.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  Video,
  Music,
  Table,
  Code,
  Quote,
  Undo,
  Redo,
  Eye,
  FileCode,
  Maximize2,
  Minimize2,
  Minus,
  Smile
} from 'lucide-react';
import FingerMobileEmojiPicker from '../common/FingerMobileEmojiPicker';
import { FingerMobileEmojiItem } from '../../services/emojiPackService';
import { replaceEmojisInHtml } from '../../utils/fingerMobileEmojiRenderer';

export interface EditorOutput {
  html: string;
  markdown: string;
  text: string;
  json: {
    content: string;
    wordCount: number;
    charCount: number;
    timestamp: string;
  };
}

export interface RichTextEditorProps {
  initialValue?: string;
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (output: EditorOutput) => void;
  placeholder?: string;
  minHeight?: string;
  // eslint-disable-next-line no-unused-vars
  onOpenMediaModal?: (type: 'photo' | 'video' | 'audio') => void;
  embeddedMediaUrls?: { url: string; type: 'photo' | 'video' | 'audio'; caption?: string }[];
}

/**
 * XSS Sanitization function to clean untrusted markup
 */
export const sanitizeHtmlContent = (html: string): string => {
  if (!html) return '';

  return html
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe/object/embed/applet tags unless safe
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '')
    // Strip on* event handlers like onclick, onerror, onload, etc.
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son\w+\s*=\s*[^>\s]+/gi, '')
    // Strip javascript:, vbscript:, and data:text/html URIs
    .replace(/(href|src)\s*=\s*(['"])\s*(javascript|vbscript|data:text\/html):.*?\2/gi, '$1=""')
    .replace(/(href|src)\s*=\s*(javascript|vbscript|data:text\/html):[^\s>]+/gi, '$1=""');
};

/**
 * Converts simple HTML to clean Markdown
 */
export const htmlToMarkdown = (html: string): string => {
  if (!html) return '';
  let md = html;
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  md = md.replace(/<u[^>]*>(.*?)<\/u>/gi, '__$1__');
  md = md.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~');
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n');
  md = md.replace(/<pre><code[^>]*>(.*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n');
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  md = md.replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1\n');
  md = md.replace(/<ol[^>]*>(.*?)<\/ol>/gi, '$1\n');
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  md = md.replace(/<img\s+(?:[^>]*?\s+)?src="([^"]*)"(?:\s+alt="([^"]*)")?[^>]*>/gi, '![$2]($1)');
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<hr\s*\/?>/gi, '\n---\n\n');
  // Strip any remaining html tags
  md = md.replace(/<[^>]+>/g, '');
  return md.trim();
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialValue = '',
  value,
  onChange,
  placeholder = 'Start writing your story or post with rich styling, media, and formatting...',
  minHeight = '280px',
  onOpenMediaModal,
  embeddedMediaUrls = []
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const effectiveValue = value !== undefined ? value : initialValue;
  const lastInternalHtmlRef = useRef<string>(effectiveValue || '');
  const [htmlContent, setHtmlContent] = useState<string>(effectiveValue || '');
  const [markdownBuffer, setMarkdownBuffer] = useState<string>('');
  const [htmlSourceBuffer, setHtmlSourceBuffer] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'visual' | 'markdown' | 'html' | 'preview'>('visual');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [textColor, setTextColor] = useState('#1e293b');
  const [highlightColor, setHighlightColor] = useState('#fef08a');
  const [showTableModal, setShowTableModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Initialize paragraph formatting on mount
  useEffect(() => {
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    } catch (_e) {
      // safe fallback
    }
  }, []);

  const updateCounts = useCallback(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    setCharCount(text.length);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, []);

  // Sync external value changes (e.g. form reset, emoji picker, programmatic updates)
  useEffect(() => {
    if (editorRef.current) {
      const sanitized = sanitizeHtmlContent(effectiveValue || '');
      if (effectiveValue !== lastInternalHtmlRef.current) {
        editorRef.current.innerHTML = sanitized;
        lastInternalHtmlRef.current = effectiveValue || '';
        setHtmlContent(sanitized);
        updateCounts();
      }
    }
  }, [effectiveValue, updateCounts]);

  // Insert embedded media when updated from external media modal
  useEffect(() => {
    if (embeddedMediaUrls.length > 0 && editorRef.current) {
      const lastMedia = embeddedMediaUrls[embeddedMediaUrls.length - 1];
      let mediaHtml = '';
      if (lastMedia.type === 'photo') {
        mediaHtml = `<figure class="my-4 text-center"><img src="${lastMedia.url}" alt="${lastMedia.caption || 'Uploaded photo'}" class="max-h-96 mx-auto rounded-xl shadow-md border border-slate-200 object-cover" /><figcaption class="text-xs text-slate-500 mt-1.5 italic">${lastMedia.caption || ''}</figcaption></figure><p><br></p>`;
      } else if (lastMedia.type === 'video') {
        mediaHtml = `<figure class="my-4 text-center"><video src="${lastMedia.url}" controls class="max-h-96 w-full max-w-2xl mx-auto rounded-xl shadow-md border border-slate-200"></video><figcaption class="text-xs text-slate-500 mt-1.5 italic">${lastMedia.caption || 'Video attachment'}</figcaption></figure><p><br></p>`;
      } else if (lastMedia.type === 'audio') {
        mediaHtml = `<div class="my-4 p-4 rounded-xl bg-slate-100 border border-slate-300 max-w-md mx-auto flex flex-col gap-2"><p class="text-xs font-bold text-slate-700">🎵 ${lastMedia.caption || 'Audio Track'}</p><audio src="${lastMedia.url}" controls class="w-full"></audio></div><p><br></p>`;
      }

      if (mediaHtml) {
        editorRef.current.focus();
        document.execCommand('insertHTML', false, mediaHtml);
        triggerChange();
      }
    }
  }, [embeddedMediaUrls]);

  const triggerChange = useCallback(() => {
    if (!editorRef.current) return;
    updateCounts();
    const rawHtml = editorRef.current.innerHTML;
    const cleanHtml = sanitizeHtmlContent(rawHtml);
    lastInternalHtmlRef.current = cleanHtml;
    setHtmlContent(cleanHtml);
    const text = editorRef.current.innerText || '';
    const markdown = htmlToMarkdown(cleanHtml);

    if (onChange) {
      onChange({
        html: cleanHtml,
        markdown,
        text,
        json: {
          content: cleanHtml,
          wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
          charCount: text.length,
          timestamp: new Date().toISOString()
        }
      });
    }
  }, [onChange, updateCounts]);

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    triggerChange();
  };

  const insertEmoji = (emoji: FingerMobileEmojiItem) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const emojiHtml = `<span class="inline-flex items-center align-middle mx-0.5 p-0.5 rounded-md bg-[#defaf2]/60 border border-emerald-300/60 shadow-2xs" data-emoji-slug="${emoji.slug}" title="${emoji.name}"><img src="${emoji.imageUrl}" alt="${emoji.altText || emoji.name}" class="inline-block w-6 h-6 object-contain align-middle mx-0.5 rounded-lg" loading="lazy" /></span>&nbsp;`;
    document.execCommand('insertHTML', false, emojiHtml);
    triggerChange();
    setShowEmojiPicker(false);
  };

  const handleTabSwitch = (nextTab: 'visual' | 'markdown' | 'html' | 'preview') => {
    if (activeTab === nextTab) return;

    // Leaving Markdown tab: convert buffer to HTML
    if (activeTab === 'markdown') {
      const convertedHtml = markdownBuffer
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*)\*/gim, '<i>$1</i>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
        .replace(/\n\n/gim, '<p></p>');
      const clean = sanitizeHtmlContent(convertedHtml);
      if (editorRef.current) {
        editorRef.current.innerHTML = clean;
      }
      setHtmlContent(clean);
      lastInternalHtmlRef.current = clean;
      triggerChange();
    }

    // Leaving HTML tab: sync source buffer
    if (activeTab === 'html') {
      const clean = sanitizeHtmlContent(htmlSourceBuffer);
      if (editorRef.current) {
        editorRef.current.innerHTML = clean;
      }
      setHtmlContent(clean);
      lastInternalHtmlRef.current = clean;
      triggerChange();
    }

    // Entering Markdown tab: seed buffer
    if (nextTab === 'markdown') {
      const current = editorRef.current ? sanitizeHtmlContent(editorRef.current.innerHTML) : htmlContent;
      setMarkdownBuffer(htmlToMarkdown(current));
    }

    // Entering HTML tab: seed buffer
    if (nextTab === 'html') {
      const current = editorRef.current ? sanitizeHtmlContent(editorRef.current.innerHTML) : htmlContent;
      setHtmlSourceBuffer(current);
    }

    setActiveTab(nextTab);
  };

  const insertLink = () => {
    const url = prompt('Enter hyperlink URL (https://...):');
    if (url) {
      const sanitized = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      executeCommand('createLink', sanitized);
    }
  };

  const insertImageByUrl = () => {
    if (onOpenMediaModal) {
      onOpenMediaModal('photo');
      return;
    }
    const url = prompt('Enter Image URL:');
    if (url) {
      const imgHtml = `<figure class="my-3 text-center"><img src="${url}" alt="Embedded image" class="max-h-80 mx-auto rounded-lg shadow-sm" /></figure><p><br></p>`;
      executeCommand('insertHTML', imgHtml);
    }
  };

  const insertVideoByUrl = () => {
    if (onOpenMediaModal) {
      onOpenMediaModal('video');
      return;
    }
    const url = prompt('Enter Video URL (MP4 or WebM):');
    if (url) {
      const videoHtml = `<figure class="my-3 text-center"><video src="${url}" controls class="max-h-80 mx-auto rounded-lg shadow-sm"></video></figure><p><br></p>`;
      executeCommand('insertHTML', videoHtml);
    }
  };

  const insertAudioByUrl = () => {
    if (onOpenMediaModal) {
      onOpenMediaModal('audio');
      return;
    }
    const url = prompt('Enter Audio URL (MP3, WAV):');
    if (url) {
      const audioHtml = `<div class="my-3 p-3 bg-slate-50 border rounded-lg max-w-sm"><audio src="${url}" controls class="w-full"></audio></div><p><br></p>`;
      executeCommand('insertHTML', audioHtml);
    }
  };

  const insertTable = () => {
    let tableHtml = '<table class="w-full my-4 border-collapse border border-slate-300 text-sm"><thead><tr>';
    for (let c = 1; c <= tableCols; c++) {
      tableHtml += `<th class="border border-slate-300 bg-slate-100 p-2 font-semibold">Header ${c}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';
    for (let r = 1; r <= tableRows; r++) {
      tableHtml += '<tr>';
      for (let c = 1; c <= tableCols; c++) {
        tableHtml += `<td class="border border-slate-300 p-2">Cell ${r}-${c}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';
    executeCommand('insertHTML', tableHtml);
    setShowTableModal(false);
  };

  const isContentEmpty = !htmlContent || htmlContent === '<p><br></p>' || htmlContent === '<br>' || htmlContent.trim() === '';

  return (
    <div className={`flex flex-col border border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'w-full'
    }`}>
      {/* Top Header & Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 gap-2">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => handleTabSwitch('visual')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'visual'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <span>Visual RTE</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('markdown')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'markdown'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Markdown</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('html')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'html'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Clean HTML</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('preview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Word Counter & Fullscreen Toggle */}
        <div className="flex items-center space-x-3 text-xs text-slate-700 dark:text-slate-300 font-semibold">
          <span className="hidden sm:inline font-medium">
            {wordCount} words • {charCount} chars
          </span>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Visual Toolbar (Visible in 'visual' tab) */}
      {activeTab === 'visual' && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">
          {/* History */}
          <button
            type="button"
            onClick={() => executeCommand('undo')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h1>')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold text-xs"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h2>')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold text-xs"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h3>')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold text-xs"
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Inline Styles */}
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg italic"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg underline"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('strikeThrough')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg line-through"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Color & Highlight */}
          <div className="relative flex items-center gap-1">
            <label className="cursor-pointer flex items-center p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Text Color">
              <span className="w-3.5 h-3.5 rounded-full border border-slate-400" style={{ backgroundColor: textColor }} />
              <input
                type="color"
                value={textColor}
                onChange={(e) => {
                  setTextColor(e.target.value);
                  executeCommand('foreColor', e.target.value);
                }}
                className="opacity-0 absolute w-0 h-0 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </label>
            <label className="cursor-pointer flex items-center p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" title="Highlight Color">
              <span className="w-3.5 h-3.5 rounded border border-slate-400" style={{ backgroundColor: highlightColor }} />
              <input
                type="color"
                value={highlightColor}
                onChange={(e) => {
                  setHighlightColor(e.target.value);
                  executeCommand('hiliteColor', e.target.value);
                }}
                className="opacity-0 absolute w-0 h-0 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </label>
          </div>

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Alignments */}
          <button
            type="button"
            onClick={() => executeCommand('justifyLeft')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyCenter')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyRight')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyFull')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<blockquote>')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertHorizontalRule')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Divider Line"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Media & Objects */}
          <button
            type="button"
            onClick={insertLink}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-indigo-600 dark:text-indigo-400 font-medium"
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertImageByUrl}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-emerald-600 dark:text-emerald-400 font-medium"
            title="Upload/Insert Photo"
          >
            <Image className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertVideoByUrl}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-rose-600 dark:text-rose-400 font-medium"
            title="Upload/Insert Video"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertAudioByUrl}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-amber-600 dark:text-amber-400 font-medium"
            title="Upload/Insert Audio"
          >
            <Music className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowTableModal(true)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-blue-600 dark:text-blue-400 font-medium"
            title="Insert Table"
          >
            <Table className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* 5D Brand Emojis Popover Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 border border-emerald-300 dark:border-emerald-700/60 shadow-2xs transition"
              title="Insert FingerMobile Official 5D Mint Emojis & Emoticons"
            >
              <Smile className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] hidden sm:inline font-bold">5D Emojis</span>
            </button>
            <FingerMobileEmojiPicker
              isOpen={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
              onSelectEmoji={insertEmoji}
              position="bottom"
              align="left"
            />
          </div>
        </div>
      )}

      {/* Editor Body */}
      <div className="flex-1 p-4 overflow-y-auto" style={{ minHeight }}>
        {/* Tab 1: Visual Editor */}
        <div className="relative" style={{ minHeight: '220px', display: activeTab === 'visual' ? 'block' : 'none' }}>
          {isContentEmpty && (
            <div className="absolute top-0 left-0 text-slate-400 dark:text-slate-500 pointer-events-none select-none text-[15px] leading-relaxed">
              {placeholder}
            </div>
          )}
          <div
            ref={editorRef}
            contentEditable={activeTab === 'visual'}
            suppressContentEditableWarning={true}
            onInput={triggerChange}
            onBlur={triggerChange}
            style={{ minHeight: '220px' }}
            className="outline-none text-slate-900 dark:text-slate-100 leading-relaxed font-sans prose prose-slate max-w-none focus:ring-0"
          />
        </div>

        {/* Tab 2: Markdown View */}
        {activeTab === 'markdown' && (
          <textarea
            value={markdownBuffer}
            onChange={(e) => setMarkdownBuffer(e.target.value)}
            placeholder="# Write formatted markdown here..."
            className="w-full h-full font-mono text-xs p-3 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 border rounded-xl outline-none font-bold border-slate-300 focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400"
            rows={12}
          />
        )}

        {/* Tab 3: HTML Source View */}
        {activeTab === 'html' && (
          <textarea
            value={htmlSourceBuffer}
            onChange={(e) => setHtmlSourceBuffer(e.target.value)}
            placeholder="<p>Write raw HTML markup here...</p>"
            className="w-full h-full font-mono text-xs p-3 bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl outline-none"
            rows={12}
          />
        )}

        {/* Tab 4: Live Rendered Preview */}
        {activeTab === 'preview' && (
          <div
            dangerouslySetInnerHTML={{ __html: replaceEmojisInHtml(htmlContent) || '<p class="text-slate-400 italic">No formatted content to preview.</p>' }}
            className="prose prose-slate dark:prose-invert max-w-none p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 text-[15px] leading-relaxed"
          />
        )}
      </div>

      {/* Insert Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Insert Structured Table</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Rows</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Columns</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tableCols}
                  onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertTable}
                className="px-4 py-2 text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-sm"
              >
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
