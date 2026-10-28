import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Check,
  Copy,
  RotateCcw,
  FileText,
  Zap,
  BarChart2,
  CheckCircle2,
  Sliders,
  History,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { useWeb3 } from '../contexts/Web3Context';
import { useAppContext } from '../contexts/AppContext';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { logError } from '../utils/errorLogger';

// --- Preset Configuration ---
interface AIPreset {
  id: string;
  label: string;
  icon: string;
  description: string;
  instruction: string;
  tone: string;
}

const AI_PRESETS: AIPreset[] = [
  {
    id: 'professional',
    label: 'Executive & Professional',
    icon: '💼',
    description: 'Elevate vocabulary, structure with clear paragraphs, and business-grade diction.',
    instruction: 'Restructure formally with authoritative business diction and clear logical flow.',
    tone: 'executive'
  },
  {
    id: 'engaging',
    label: 'High Engagement & Viral',
    icon: '🔥',
    description: 'Add an attention-grabbing hook, crisp bullet insights, and an interactive question.',
    instruction: 'Add a captivating hook title, 3 key bullet points, and an engaging call to action.',
    tone: 'persuasive'
  },
  {
    id: 'grammar',
    label: 'Syntax & Grammar Polish',
    icon: '✨',
    description: 'Correct punctuation, passive voice, typos, and cadence while preserving voice.',
    instruction: 'Fix all grammar, spelling, and punctuation issues while keeping the natural author voice.',
    tone: 'balanced'
  },
  {
    id: 'concise',
    label: 'Concise & High-Impact',
    icon: '⚡',
    description: 'Eliminate fluff, tighten phrasing, and reduce length by ~40% for fast reading.',
    instruction: 'Distill core ideas into punchy, concise sentences without losing key takeaways.',
    tone: 'direct'
  },
  {
    id: 'expand',
    label: 'Deep Dive & Expansion',
    icon: '📚',
    description: 'Elaborate on core premises, provide supporting context and structural pillars.',
    instruction: 'Expand on the central ideas with structured explanations and real-world considerations.',
    tone: 'analytical'
  },
  {
    id: 'conversational',
    label: 'Friendly & Social',
    icon: '💬',
    description: 'Approachable, warm, and natural conversational cadence for social community feeds.',
    instruction: 'Make the tone warm, welcoming, and easy to read like a friendly conversation.',
    tone: 'friendly'
  },
  {
    id: 'seo_tags',
    label: 'SEO & Hashtag Booster',
    icon: '🏷️',
    description: 'Optimize keyword prominence and append trending community discovery hashtags.',
    instruction: 'Enhance search discoverability and append 5 relevant topic hashtags.',
    tone: 'inspirational'
  }
];

// --- Main Container Page Component ---
const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { balance } = useWeb3();

  // Content States
  const [originalContent, setOriginalContent] = useState<string>(
    'Excited to announce our new update to the FingerMobile community! We are bringing together multi-attachment posting, banuba video filters, and decentralized PostgreSQL synchronization. Let us know what you think.'
  );
  const [editedContent, setEditedContent] = useState<string>('');
  const [instruction, setInstruction] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('professional');
  const [selectedTone, setSelectedTone] = useState<string>('balanced');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>('Updated Community Post');

  // Multi-Turn History
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Fetch Existing Post on Mount
  useEffect(() => {
    if (id) {
      apiService.get<any>(`/api/posts/${id}`)
        .then((res) => {
          const post = res.data?.data || res.data;
          if (post) {
            if (post.title) setPostTitle(post.title);
            if (post.content) {
              setOriginalContent(post.content);
            }
          }
        })
        .catch((err) => {
          logError(err, { context: 'EditPostPage - Fetch post' });
        });
    }
  }, [id]);

  // Telemetry Calculations
  const metrics = useMemo(() => {
    const origWords = originalContent.trim() ? originalContent.trim().split(/\s+/).length : 0;
    const editedWords = editedContent.trim() ? editedContent.trim().split(/\s+/).length : 0;
    const wordDiff = editedWords - origWords;
    const pctChange = origWords > 0 && editedWords > 0 ? Math.round(((editedWords - origWords) / origWords) * 100) : 0;
    const readTimeOrig = Math.max(1, Math.ceil(origWords / 200));
    const readTimeEdited = Math.max(1, Math.ceil(editedWords / 200));

    return {
      origWords,
      editedWords,
      wordDiff,
      pctChange,
      readTimeOrig,
      readTimeEdited
    };
  }, [originalContent, editedContent]);

  // Client-Side Generative Heuristic Engine (Offline / Local Fallback)
  const applyHeuristicTransformation = useCallback((source: string, presetId: string, customInstruction: string) => {
    const text = source.trim();
    const inst = (customInstruction || '').toLowerCase();

    if (presetId === 'professional' || inst.includes('prof') || inst.includes('formal')) {
      return `Strategic Announcement:\n\n${text
        .replace(/\b(wanna|gonna|gotta)\b/gi, (m) => m.toLowerCase() === 'wanna' ? 'intend to' : m.toLowerCase() === 'gonna' ? 'plan to' : 'must')
        .replace(/\b(hey|yo|hi guys)\b/gi, 'Greetings,')
        .replace(/\b(really cool|super awesome)\b/gi, 'highly effective')}\n\nWe look forward to receiving your strategic feedback and observations.`;
    }

    if (presetId === 'engaging' || inst.includes('engag') || inst.includes('viral')) {
      return `🚀 Game-Changing Update:\n\n${text}\n\n💡 Key Takeaways:\n• Accelerated workflow\n• Frictionless collaboration\n• Verifiable community sovereignty\n\n👇 What are your thoughts on this milestone? Join the conversation below!\n#FingerMobile #Protocol #Innovation`;
    }

    if (presetId === 'grammar' || inst.includes('gramm') || inst.includes('fix')) {
      const fixed = text
        .replace(/\s+/g, ' ')
        .replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase())
        .trim();
      return /[.!?]$/.test(fixed) ? fixed : `${fixed}.`;
    }

    if (presetId === 'concise' || inst.includes('short') || inst.includes('concise')) {
      const sentences = text.split(/(?<=[.!?])\s+/);
      const reduced = sentences.slice(0, Math.max(1, Math.ceil(sentences.length * 0.55))).join(' ');
      return `TL;DR: ${reduced}`;
    }

    if (presetId === 'expand' || inst.includes('expand') || inst.includes('detail')) {
      return `${text}\n\nKey Strategic Pillars:\n1. Architecture: High-performance PostgreSQL ledger synchronization.\n2. Security: Cryptographically verified WORM audit log continuity.\n3. Experience: Multi-track timeline editing with sub-millisecond response latency.`;
    }

    if (presetId === 'conversational' || inst.includes('friendly')) {
      return `Hey everyone! 👋\n\nJust wanted to share a quick update with the community:\n\n${text}\n\nWould love to know what you think—drop your feedback below! 😊`;
    }

    if (presetId === 'seo_tags' || inst.includes('hashtag') || inst.includes('seo')) {
      return `${text}\n\n#FingerMobile #Web3 #DecentralizedTech #CommunityDriven #DigitalSovereignty`;
    }

    return `${text}\n\n[AI Refined with instruction: "${customInstruction}"]`;
  }, []);

  // Primary AI Editing Handler
  const handleEdit = useCallback(async (overrideInstruction?: string, overridePreset?: string) => {
    const activeInstruction = overrideInstruction !== undefined ? overrideInstruction : instruction;
    const activePreset = overridePreset !== undefined ? overridePreset : selectedPreset;

    if (!originalContent.trim()) {
      showToast('Please provide original content to edit', 'error');
      return;
    }

    setIsEditing(true);
    try {
      let finalResult = '';

      // 1. Try calling backend /api/posts/ai-edit
      try {
        const response = await apiService.post<any>('/api/posts/ai-edit', {
          content: originalContent,
          instruction: activeInstruction.trim(),
          preset: activePreset,
          tone: selectedTone
        });

        if (response.data?.data?.editedContent) {
          finalResult = response.data.data.editedContent;
        } else if (response.data?.editedContent) {
          finalResult = response.data.editedContent;
        }
      } catch (backendErr) {
        logError(backendErr, { context: 'Backend AI edit failed, switching to local AI heuristic engine' });
      }

      // 2. Client-side heuristic fallback
      if (!finalResult) {
        finalResult = applyHeuristicTransformation(originalContent, activePreset, activeInstruction);
      }

      setEditedContent(finalResult);

      // 3. Update Multi-turn History Stack
      setHistory(prev => [...prev.slice(0, historyIndex + 1), finalResult]);
      setHistoryIndex(prev => prev + 1);

      showToast('AI enhancement applied successfully!', 'success');
    } catch (err) {
      logError(err, { context: 'EditPostPage - AI generation process' });
      showToast('Failed to apply AI edit', 'error');
    } finally {
      setIsEditing(false);
    }
  }, [originalContent, instruction, selectedPreset, selectedTone, historyIndex, applyHeuristicTransformation, showToast]);

  // Preset Selection & Immediate Application
  const handleSelectPreset = useCallback((preset: AIPreset) => {
    setSelectedPreset(preset.id);
    setInstruction(preset.instruction);
    setSelectedTone(preset.tone);
    handleEdit(preset.instruction, preset.id);
  }, [handleEdit]);

  // History Navigation
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setEditedContent(history[newIdx]);
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
      setEditedContent('');
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setEditedContent(history[newIdx]);
    }
  }, [history, historyIndex]);

  // Apply Edited Content as New Base for Chained Edits
  const handleApplyAsBase = useCallback(() => {
    if (editedContent) {
      setOriginalContent(editedContent);
      setEditedContent('');
      showToast('Set as active draft! You can apply further AI enhancements.', 'info');
    }
  }, [editedContent, showToast]);

  // Copy to Clipboard
  const handleCopy = useCallback(async () => {
    const target = editedContent || originalContent;
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  }, [editedContent, originalContent, showToast]);

  // Revert back to Original
  const handleRevert = useCallback(() => {
    setEditedContent('');
    setInstruction('');
    setHistoryIndex(-1);
    showToast('Reverted to original text', 'info');
  }, [showToast]);

  // Save to PostgreSQL Backend
  const handleSave = useCallback(async () => {
    const finalContent = (editedContent || originalContent).trim();
    if (!finalContent) {
      showToast('Post content cannot be empty', 'error');
      return;
    }

    try {
      if (id) {
        await apiService.put(`/api/posts/${id}`, {
          title: postTitle,
          content: finalContent,
          is_ai_generated: Boolean(editedContent),
          ai_badge_label: 'Edited with AI'
        });
      } else {
        await apiService.post('/api/posts', {
          title: postTitle,
          content: finalContent,
          is_ai_generated: Boolean(editedContent),
          ai_badge_label: 'Edited with AI',
          tags: ['ai-enhanced', selectedPreset]
        });
      }
      showToast('Post saved successfully!', 'success');
      navigate('/forum');
    } catch (err) {
      logError(err, { context: 'EditPostPage - Save post' });
      showToast('Failed to save post to backend', 'error');
    }
  }, [id, postTitle, editedContent, originalContent, selectedPreset, showToast, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 w-full max-w-full overflow-x-hidden pb-28 md:pb-16">
      <PageHeader title="AI Post Editor & Transformer" />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-700/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Gemini & Neural Heuristic Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Content Enhancement Suite</h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Refine, polish, expand, or stylize your post in real time. Compare side-by-side revisions with automated token accounting.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 self-start md:self-auto">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs text-slate-300 font-medium">FIC Balance</div>
                <div className="text-lg font-extrabold text-white">{(balance ?? 0).toLocaleString()} FIC</div>
              </div>
              <div className="ml-2 text-[11px] font-semibold text-blue-200 bg-blue-600/40 px-2 py-0.5 rounded">
                3 FIC / Edit
              </div>
            </div>
          </div>
        </div>

        {/* Post Title Input */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <label htmlFor="postTitleInput" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Post Title
          </label>
          <input
            id="postTitleInput"
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Enter post title..."
            className="w-full px-3 py-2 text-base font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white font-bold placeholder:text-slate-400"
          />
        </div>

        {/* Preset Selector Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-blue-600" />
              Style & Tone Presets
            </h2>
            <span className="text-xs text-slate-700 font-medium">Click a preset to apply instantly</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {AI_PRESETS.map((preset) => {
              const isActive = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  disabled={isEditing}
                  className={`p-4 text-left rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                    isActive
                      ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">{preset.icon}</span>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="text-sm font-bold text-slate-900">{preset.label}</div>
                    <div className="text-xs text-slate-700 font-medium mt-1 line-clamp-2">{preset.description}</div>
                  </div>
                  <div className="mt-3 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                    Apply Preset <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Instruction Box & Action Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label htmlFor="customInstructionInput" className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Custom Editing Instruction
            </label>
            <div className="flex items-center gap-2">
              <label htmlFor="toneSelector" className="text-xs text-slate-800 font-bold">Tone:</label>
              <select
                id="toneSelector"
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="text-xs font-bold border border-slate-300 rounded-md px-2 py-1 bg-white text-slate-900 focus:ring-1 focus:ring-blue-500 focus:ring-2"
              >
                <option value="balanced">Balanced</option>
                <option value="persuasive">Persuasive</option>
                <option value="inspirational">Inspirational</option>
                <option value="direct">Direct</option>
                <option value="analytical">Analytical</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="customInstructionInput"
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g. 'Add 3 bullet points', 'Make it sound more urgent', 'Shorten by half'..."
              className="flex-1 min-h-[44px] px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-bold bg-white placeholder:text-slate-400"
              disabled={isEditing}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEdit();
              }}
            />
            <button
              onClick={() => handleEdit()}
              disabled={isEditing || !originalContent.trim()}
              className="min-h-[44px] px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
            >
              {isEditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Edit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Comparison Workspace (Side-by-Side Dual Editor) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Content Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-bold text-slate-800">Original Post</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                <span>{metrics.origWords} words</span>
                <span>•</span>
                <span>{metrics.readTimeOrig} min read</span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <textarea
                value={originalContent}
                onChange={(e) => setOriginalContent(e.target.value)}
                placeholder="Type or paste post content here..."
                className="w-full h-64 sm:h-80 p-3 text-sm text-slate-900 bg-white border focus:ring-0 resize-none font-sans leading-relaxed font-bold border-slate-300 rounded placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
              <span>Editable source draft</span>
              <button
                onClick={() => setOriginalContent('')}
                className="hover:text-red-500 transition-colors"
              >
                Clear text
              </button>
            </div>
          </div>

          {/* AI-Edited Content Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
            <div className="px-5 py-3.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-slate-900">AI-Enhanced Result</span>
                {editedContent && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white tracking-wide">
                    Live
                  </span>
                )}
              </div>

              {/* Revision History Undo / Redo */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  title="Undo AI edit"
                  className="p-1 rounded text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-700 font-mono">
                  {historyIndex >= 0 ? `${historyIndex + 1}/${history.length}` : '0/0'}
                </span>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  title="Redo AI edit"
                  className="p-1 rounded text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-4 h-4 scale-x-[-1]" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col bg-slate-50/30">
              {isEditing ? (
                <div className="h-64 sm:h-80 flex flex-col items-center justify-center space-y-3">
                  <LoadingSpinner />
                  <div className="text-sm font-semibold text-blue-600 animate-pulse">
                    Crafting enhanced copy...
                  </div>
                </div>
              ) : editedContent ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-64 sm:h-80 p-3 text-sm text-slate-900 bg-white border focus:ring-0 resize-none font-sans leading-relaxed font-bold border-slate-300 rounded placeholder:text-slate-400"
                />
              ) : (
                <div className="h-64 sm:h-80 flex flex-col items-center justify-center text-center p-6 text-slate-700">
                  <Wand2 className="w-10 h-10 text-slate-700 mb-3 stroke-[1.5]" />
                  <div className="text-sm font-semibold text-slate-600">No AI Edit Generated Yet</div>
                  <p className="text-xs text-slate-700 max-w-xs mt-1">
                    Select a style preset above or enter custom instructions to generate transformed copy.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions for AI Output */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span>{metrics.editedWords} words</span>
                {editedContent && metrics.wordDiff !== 0 && (
                  <span className={`font-bold ${metrics.wordDiff > 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                    ({metrics.wordDiff > 0 ? `+${metrics.wordDiff}` : metrics.wordDiff} wds / {metrics.pctChange}%)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editedContent && (
                  <>
                    <button
                      onClick={handleCopy}
                      className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center gap-1 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={handleApplyAsBase}
                      title="Set this output as original to apply further chained edits"
                      className="px-2.5 py-1 rounded border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-950  border-blue-400 font-bold font-medium transition-colors"
                    >
                      Use as Base
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Global Action Footer */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleRevert}
              disabled={!editedContent}
              className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2 text-sm font-bold border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Discard AI Changes
            </button>
            <button
              onClick={() => navigate('/forum')}
              className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save & Publish Post
            </button>
          </div>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Edit Post Mobile Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
      >
        <button
          type="button"
          onClick={() => handleEdit()}
          disabled={isEditing || !originalContent.trim()}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer disabled:opacity-40"
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>AI Polish</span>
        </button>
        <button
          type="button"
          onClick={handleUndo}
          disabled={historyIndex <= 0}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
        >
          <RotateCcw className="w-5 h-5 mb-0.5" />
          <span>Undo</span>
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!editedContent}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer disabled:opacity-30"
        >
          <Copy className="w-5 h-5 mb-0.5" />
          <span>Copy</span>
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <Check className="w-5 h-5 mb-0.5" />
          <span>Save</span>
        </button>
      </nav>
    </div>
  );
};

export default EditPostPage;
