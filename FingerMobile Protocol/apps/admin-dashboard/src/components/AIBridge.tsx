import React, { useState } from 'react';
import Card from './Card';
import { Bot, Send, Loader2 } from 'lucide-react';
import { AIBridgeService } from '../services/AIBridgeService';

const AIBridge: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<{result: string; actionTaken: string; success: boolean} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      const result = await AIBridgeService.executePrompt({ prompt, context: 'MasterDashboard' });
      setResponse(result);
      setPrompt('');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to execute prompt');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Gemini AI Builder Bridge" className="border-t-4 border-t-purple-500">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Use the AI Builder Bridge to push edits, build the platform, or resolve missing modules.
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., 'Generate the missing NotificationModule and push to db...'"
            className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !prompt.trim()}
            className="absolute bottom-3 right-3 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        {response && (
          <div className={`p-4 rounded-md border text-sm ${response.success ? 'bg-green-50 text-green-800 border-green-200' : 'bg-yellow-50 text-yellow-800 border-yellow-200'}`}>
            <h4 className="font-bold flex items-center mb-2">
              <Bot className="h-4 w-4 mr-2" /> 
              {response.success ? 'Action Successful' : 'Action Incomplete'}
            </h4>
            <div className="mb-2"><strong>Result:</strong> {response.result}</div>
            <div><strong>Action Taken:</strong> {response.actionTaken}</div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIBridge;
