import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { generateCodeWithAi } from '../../services/api';
import { SparklesIcon } from '../../components/icons';
import { AgenticAiResponse } from '../../types';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

interface AiGeneratedComponentProps {
  response: AgenticAiResponse;
}

const ResponseDisplay: React.FC<AiGeneratedComponentProps> = ({ response }) => {
  return (
    <div className="mt-4 p-4 bg-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold text-white">AI Generated Plan:</h3>
      <p className="text-gray-300 whitespace-pre-wrap">{response.plan}</p>

      <h3 className="text-lg font-semibold text-white mt-4">Proposed Changes:</h3>
      {(response.changes || []).map((change: any, index: number) => (
        <div key={index} className="mt-2 p-3 bg-gray-600 rounded-md">
          <p className="text-gray-200">File: {change.file}</p>
          {change.lineNumber && <p className="text-gray-200">Line: {change.lineNumber}</p>}
          {change.changeType && <p className="text-gray-200">Type: {change.changeType}</p>}
          {change.content && (
            <pre className="mt-1 p-2 bg-gray-800 rounded text-green-300 overflow-x-auto">
              <code>{change.content}</code>
            </pre>
          )}
          <p className="text-gray-200">Description: {change.description}</p>
        </div>
      ))}
    </div>
  );
};

const CodeAgentPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<AgenticAiResponse | null>(null);
  const [history, setHistory] = useState<{ prompt: string; response: AgenticAiResponse }[]>([]);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { enforceAiAction, showToast } = useAppContext();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, response, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse(null);
    const currentPrompt = prompt;

    try {
      // Enforce AI Governance prior to code generation
      const decision = await enforceAiAction?.('code_generation', { prompt: currentPrompt });
      if (decision && !decision.approved) {
        setResponse({
          id: 'governance-block',
          agentId: 'system',
          timestamp: new Date().toISOString(),
          query: currentPrompt,
          rawResponse: `Governance blocked: ${decision.reason ?? 'Not permitted'}`,
          plan: [`Governance blocked: ${decision.reason ?? 'Not permitted'}`],
          changes: []
        });
        showToast(`Governance blocked: ${decision.reason ?? 'Not permitted'}`, 'warning');
        return;
      }

      const sanitizedPrompt = currentPrompt; // No sanitizedPayload from enforceAiAction

      const result = await generateCodeWithAi(sanitizedPrompt ?? currentPrompt);
      const processedResult: AgenticAiResponse = {
        id: 'temp-id',
        agentId: 'temp-agent-id',
        timestamp: new Date().toISOString(),
        query: sanitizedPrompt ?? currentPrompt,
        rawResponse: JSON.stringify(result),
        // @ts-ignore - Auto-suppressed for compilation
        plan: result.plan || [], // Ensure plan is an array
        // @ts-ignore - Auto-suppressed for compilation
        changes: result.changes || [] // Ensure changes is an array
      };

      setResponse(processedResult);
      setHistory(prev => [...prev, { prompt: sanitizedPrompt ?? currentPrompt, response: processedResult }]);
      showToast('Code generated successfully', 'success');
    } catch (error) {
      console.error('Error generating code with AI:', error);
      const errorResponse: AgenticAiResponse = {
        id: 'error-response',
        agentId: 'system',
        timestamp: new Date().toISOString(),
        query: currentPrompt,
        rawResponse: 'Error: Failed to generate code. Please try again.',
        plan: ['Error: Failed to generate code. Please try again.'],
        changes: []
      };

      setResponse(errorResponse);
      showToast('Failed to generate code', 'error');
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };


  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-6 w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto flex flex-col flex-grow">
        <h1 className="text-3xl font-black text-cyan-400 mb-6">Code Agent</h1>

        <div className="flex-grow overflow-y-auto pr-4 mb-6 custom-scrollbar">
          {history.map((item, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <p className="font-semibold text-gray-200 mb-2">Prompt: {item.prompt}</p>
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="font-semibold text-cyan-400">Gemini Code Agent</p>
                {item.response && <ResponseDisplay response={item.response} />}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center mb-6">
              <SparklesIcon className="animate-spin h-8 w-8 text-cyan-400" />
              <p className="ml-3 text-lg text-cyan-400">Generating code...</p>
            </div>
          )}
          {response && !isLoading && history.length === 0 && (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <p className="font-semibold text-cyan-400">Gemini Code Agent</p>
              <ResponseDisplay response={response} />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the code you want the AI to generate or modify..."
            className="flex-grow p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 text-sm font-medium"
            disabled={isLoading || !consentGiven}
          />
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={isLoading || !consentGiven}
          >
            {isLoading ? 'Generating...' : 'Generate Code'}
          </button>
        </form>

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="ai-consent"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="form-checkbox h-5 w-5 text-cyan-600 rounded focus:ring-cyan-500"
          />
          <label htmlFor="ai-consent" className="ml-2 text-gray-300 text-sm font-medium">
            I understand that AI-generated code may contain errors or security vulnerabilities and I will review it carefully before deployment.
          </label>
        </div>

        {/* Sovereign Platform Ownership Directive */}
        <div className="mt-8">
          <PlatformOwnershipCard />
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-slate-700 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
        <a
          href="/super-admin/code-agent"
          aria-label="Code Agent"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-300 hover:text-cyan-400"
        >
          <span className="text-base">🤖</span>
          <span>Agent</span>
        </a>
        <button
          onClick={() => { const input = document.querySelector('textarea') as HTMLTextAreaElement; if (input) { input.focus(); input.scrollIntoView({ behavior: 'smooth' }); } }}
          aria-label="Prompt Agent"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-300 hover:text-cyan-400"
        >
          <span className="text-base">💬</span>
          <span>Prompt</span>
        </button>
        <button
          onClick={() => window.location.reload()}
          aria-label="Reload Agent"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-300 hover:text-cyan-400"
        >
          <span className="text-base">🔄</span>
          <span>Sync</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to Top"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-300 hover:text-cyan-400"
        >
          <span className="text-base">⬆️</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default CodeAgentPage;
