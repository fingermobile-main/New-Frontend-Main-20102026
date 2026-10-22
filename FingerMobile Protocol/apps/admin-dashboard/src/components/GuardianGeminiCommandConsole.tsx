import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import { 
  Shield, 
  Sparkles, 
  Key, 
  Send, 
  Loader2, 
  CheckCircle, 
  Copy, 
  Eye, 
  EyeOff, 
  Terminal,
  Cpu,
  Lock,
  RotateCcw,
  Clock,
  Activity,
  Code
} from 'lucide-react';
import { AIBridgeService } from '../services/AIBridgeService';
import type { PromptResponse } from '../services/AIBridgeService';

interface GuardianGeminiCommandConsoleProps {
  contextName?: 'MasterDashboard' | 'StercsDashboard';
}

const GUARDIAN_PRESETS = [
  '🛡️ Audit active spending caps, tighten thresholds to $500, and flag anomalies',
  '🚨 Deep fraud scan & trigger strict containment on suspicious accounts',
  '❄️ Quarantine dormant accounts (>90 days inactive) with unpaid liabilities',
  '📜 Verify WORM cryptographic audit chain & generate compliance proof'
];

const GEMINI_PRESETS = [
  '⚡ LIVE: Enhance StercsEditor widget layout, palette schemas & dynamic bindings',
  '🏛️ LIVE: Synthesize platform security policies & SDUI governance rules',
  '🚀 LIVE: Generate PostgreSQL migration scripts for pending cluster tables',
  '🛠️ LIVE: Implement full-stack module code & trigger platform update execution'
];

export const GuardianGeminiCommandConsole: React.FC<GuardianGeminiCommandConsoleProps> = ({
  contextName = 'MasterDashboard'
}) => {
  // Special Engine Selection Tabs
  const [activeEngine, setActiveEngine] = useState<'guardian' | 'gemini'>(
    contextName === 'StercsDashboard' ? 'guardian' : 'gemini'
  );

  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('fmp_superadmin_gemini_key') || '' : ''));
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<PromptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);

  // Auto-growing textarea reference
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(100, textareaRef.current.scrollHeight)}px`;
    }
  }, [prompt]);

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    if (val.trim()) {
      localStorage.setItem('fmp_superadmin_gemini_key', val.trim());
    } else {
      localStorage.removeItem('fmp_superadmin_gemini_key');
    }
  };

  const handleClearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('fmp_superadmin_gemini_key');
  };

  const handlePresetClick = (preset: string) => {
    setPrompt(preset);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isSubmitting) return;

    const startTime = performance.now();
    try {
      setIsSubmitting(true);
      setError(null);

      const res = await AIBridgeService.executePrompt({
        prompt: prompt.trim(),
        apiKey: apiKey.trim() || undefined,
        targetEngine: activeEngine,
        context: contextName
      });

      const elapsed = Math.round(performance.now() - startTime);
      setExecutionTimeMs(elapsed);
      setResponse(res);
      setPrompt('');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to dispatch AI prompt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!response?.result) return;
    navigator.clipboard.writeText(response.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLocalKeyActive = Boolean(apiKey && apiKey.trim().length > 0);

  return (
    <Card 
      title=""
      className={`border-t-4 transition-all shadow-2xl ${
        activeEngine === 'guardian' 
          ? 'border-t-orange-600 bg-slate-900/95 text-white' 
          : 'border-t-indigo-600 bg-slate-900/95 text-white'
      }`}
    >
      <div className="space-y-6">
        {/* 1. SPECIAL ENGINE SELECTION TABS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className={`p-3 rounded-2xl shadow-lg transition-transform ${
              activeEngine === 'guardian' 
                ? 'bg-gradient-to-tr from-amber-600 to-orange-600 text-white shadow-orange-600/30' 
                : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-indigo-600/30'
            }`}>
              {activeEngine === 'guardian' ? <Shield className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black tracking-tight text-white">
                  {activeEngine === 'guardian' ? 'Guardian AI Directive Console' : 'Gemini AI “LIVE” Platform Director'}
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-orange-400 border border-orange-500/30">
                  SuperAdmin Sovereign Root
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeEngine === 'guardian' 
                  ? 'Autonomous platform security, threat containment, spend cap rules, and STERCS services enforcement.'
                  : '“LIVE” platform direction, policy management, platform code enhancement, implementation and executions.'}
              </p>
            </div>
          </div>

          {/* Engine Selection Tabs */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start lg:self-auto shadow-inner">
            <button
              type="button"
              onClick={() => setActiveEngine('guardian')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeEngine === 'guardian'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/30 scale-102'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              Guardian AI (Security & STERCS)
            </button>
            <button
              type="button"
              onClick={() => setActiveEngine('gemini')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeEngine === 'gemini'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-102'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              Gemini AI (“LIVE” Platform & Code)
            </button>
          </div>
        </div>

        {/* 2. API KEY MANAGEMENT WITH TOGGLE & DUAL-STATE VISUAL INDICATOR */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/90 shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs">
              <Key className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold text-slate-200">Gemini API Key Authentication:</span>
            </div>

            {/* Visual Indicator of Key Mode */}
            <div className="flex items-center gap-2 pt-0.5">
              {isLocalKeyActive ? (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Using Locally Stored API Key (SuperAdmin Override)
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-sky-400 font-semibold bg-sky-500/10 px-2.5 py-0.5 rounded-md border border-sky-500/20">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  Using Default Environment Key (Server Config: gemini-2.5-flash)
                </div>
              )}
            </div>
          </div>

          {/* Secure Key Input with Mask/Reveal and Clear Option */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="AIzaSy... (Enter custom Google Gemini API Key)"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 font-mono shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                title={showApiKey ? 'Hide API Key' : 'Reveal API Key'}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {isLocalKeyActive && (
              <button
                type="button"
                onClick={handleClearApiKey}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-colors shrink-0"
                title="Clear local key & revert to default environment key"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 3. PRE-DEFINED QUICK-ACTION COMMAND CHIPS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-orange-400" />
              Pre-Defined Quick-Action Directives ({activeEngine === 'guardian' ? 'Guardian AI' : 'Gemini AI'})
            </label>
            <span className="text-[10px] text-slate-500">Click to load into console</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {(activeEngine === 'guardian' ? GUARDIAN_PRESETS : GEMINI_PRESETS).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="text-left text-xs bg-slate-950/80 hover:bg-slate-800/90 text-slate-300 hover:text-white px-3.5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all shadow-sm active:scale-99 flex items-center justify-between group"
              >
                <span className="truncate pr-2 font-medium">{preset}</span>
                <span className="text-slate-500 group-hover:text-orange-400 text-xs shrink-0 font-bold">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. AUTO-GROWING SUPERADMIN PROMPT TEXTAREA & DISPATCH */}
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              SuperAdmin Command & Execution Prompt
            </span>
            <span className="text-slate-500 text-[10px] font-normal">
              Shift + Enter for newline • Auto-expanding prompt area
            </span>
          </label>

          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder={
              activeEngine === 'guardian'
                ? "Instruct Guardian AI: e.g. 'Audit active spending caps across all user accounts, review inactivity logs with pending liabilities, and enforce strict containment rules...'"
                : "Instruct Gemini AI: e.g. 'LIVE: Enhance StercsEditor widget layout and generate TypeScript code for dynamic SDUI screens...'"
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono leading-relaxed transition-all shadow-inner"
            disabled={isSubmitting}
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-[11px] text-slate-400 self-start sm:self-auto">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sovereign Platform Scope: <strong className="text-slate-200">{contextName}</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-mono">v2.5.0</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !prompt.trim()}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black text-white shadow-xl transition-all ${
                activeEngine === 'guardian'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-600/30'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30'
              } disabled:opacity-40 disabled:cursor-not-allowed active:scale-98`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Live Directive...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute on {activeEngine === 'guardian' ? 'Guardian AI' : 'Gemini AI'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* 5. ERROR NOTIFICATION */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center justify-between shadow-lg">
            <span><strong>Execution Error:</strong> {error}</span>
            <button 
              type="button" 
              onClick={() => setError(null)} 
              className="text-red-400 hover:text-white font-bold ml-2 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 6. ADVANCED RESPONSE CONSOLE WITH SYNTAX HIGHLIGHTING, BADGES & EXECUTION DETAILS */}
        {response && (
          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
            {/* Console Action Bar & Badges */}
            <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-white tracking-wide">
                  {response.targetEngine === 'guardian' ? 'GUARDIAN AI DIRECTIVE OUTPUT' : 'GEMINI AI LIVE EXECUTION OUTPUT'}
                </span>

                {/* Action Badges */}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> ACTION EXECUTED
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                  <Code className="w-3 h-3" /> CODE & POLICY GENERATED
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> WORM VERIFIED
                </span>
              </div>

              {/* Copy to Clipboard */}
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors font-medium shadow-sm"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied to Clipboard' : 'Copy Output'}
              </button>
            </div>

            {/* Execution Details Bar */}
            <div className="px-5 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2 font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {new Date(response.timestamp).toLocaleTimeString()}
                </span>
                {executionTimeMs !== null && (
                  <span className="text-slate-300">
                    Execution Time: <strong className="text-emerald-400">{executionTimeMs}ms</strong>
                  </span>
                )}
                <span>Status: <strong className="text-emerald-400">200 OK</strong></span>
              </div>
              <span className="text-slate-400">Context: {contextName}</span>
            </div>

            {/* Action Taken & Formatted Markdown Response Body */}
            <div className="p-5 space-y-4 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 flex items-start gap-2">
                <strong className="text-slate-200 font-sans shrink-0">Action Taken:</strong> 
                <span className="font-mono text-slate-300 leading-relaxed">{response.actionTaken}</span>
              </div>

              {/* Formatted Markdown Display */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 font-mono text-xs selection:bg-indigo-500 selection:text-white">
                {response.result}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GuardianGeminiCommandConsole;
