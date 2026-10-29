import React, { useEffect, useState } from 'react';
import promptsService, { ThreatAnalysis } from '../../services/promptsService';

interface PromptsThreatDashboardProps {
  userId?: string;
}

const PromptsThreatDashboard: React.FC<PromptsThreatDashboardProps> = ({ userId }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [lastAnalysis, setLastAnalysis] = useState<ThreatAnalysis | null>(null);
  const [threatHistory, setThreatHistory] = useState<ThreatAnalysis[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load threat history on mount
  useEffect(() => {
    loadThreatHistory();
    loadStats();
  }, []);

  const loadThreatHistory = async () => {
    try {
      const history = await promptsService.getAnalyzedThreats(20);
      setThreatHistory(history);
    } catch (err: any) {
      console.error('Failed to load threat history:', err);
    }
  };

  const loadStats = async () => {
    try {
      // Get threat patterns as stats
      const patterns = await promptsService.getThreatPatterns();
      setStats({
        totalAnalyses: patterns.length,
        threatsDetected: patterns.filter((p: any) => p.severity === 'high' || p.severity === 'critical').length,
        mitigationsApplied: 0,
        patternCount: patterns.length
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleAnalyzePrompt = async () => {
    if (!promptInput.trim()) {
      setError('Please enter a prompt to analyze');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const analysis = await promptsService.analyzePrompt({
        content: promptInput,
        source: 'dashboard_input'
      });

      setLastAnalysis(analysis);

      // Refresh history
      await loadThreatHistory();

      // Clear input
      setPromptInput('');
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleMitigate = async (threatId: string, action: string) => {
    try {
      await promptsService.mitigateThreat(threatId, action);
      setSuccessMessage(`✓ Mitigation applied successfully: ${action}`);
      setTimeout(() => setSuccessMessage(null), 4000);
      await loadThreatHistory();
    } catch (err: any) {
      setError(err.message || 'Mitigation failed');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
    case 'critical': return 'bg-red-600 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-yellow-500 text-black';
    case 'low': return 'bg-blue-500 text-white';
    default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
    case 'dangerous': return 'text-red-600 font-bold';
    case 'suspicious': return 'text-orange-500 font-semibold';
    case 'safe': return 'text-green-600 font-semibold';
    default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">PRO-MPTS™©® Threat Analyzer</h2>
        <p className="text-sm opacity-90">Protocol and Manipulation System - AI-Powered Threat Detection</p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-slate-300 dark:border-gray-700">
            <div className="text-sm text-slate-800 dark:text-slate-200 font-bold">Total Analyses</div>
            <div className="text-2xl font-bold">{stats.totalAnalyses || 0}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-slate-300 dark:border-gray-700">
            <div className="text-sm text-slate-800 dark:text-slate-200 font-bold">Threats Detected</div>
            <div className="text-2xl font-bold text-red-600">{stats.threatsDetected || 0}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-slate-300 dark:border-gray-700">
            <div className="text-sm text-slate-800 dark:text-slate-200 font-bold">Mitigations Applied</div>
            <div className="text-2xl font-bold text-green-600">{stats.mitigationsApplied || 0}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-slate-300 dark:border-gray-700">
            <div className="text-sm text-slate-800 dark:text-slate-200 font-bold">Detection Rate</div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalAnalyses > 0
                ? Math.round((stats.threatsDetected / stats.totalAnalyses) * 100)
                : 0}%
            </div>
          </div>
        </div>
      )}

      {/* Prompt Analysis Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-slate-300 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Analyze Prompt for Threats</h3>

        <div className="space-y-4">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Enter prompt or input to analyze for security threats..."
            className="w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-slate-900 font-bold bg-white placeholder:text-slate-500"
            rows={4}
          />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-400 dark:border-emerald-600 rounded-lg p-3 text-emerald-900 dark:text-emerald-300 font-bold text-sm">
              {successMessage}
            </div>
          )}

          <button
            onClick={handleAnalyzePrompt}
            disabled={analyzing}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {analyzing ? 'Analyzing...' : '🔍 Analyze for Threats'}
          </button>
        </div>
      </div>

      {/* Last Analysis Result */}
      {lastAnalysis && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-slate-300 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Latest Analysis Result</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-800 dark:text-slate-200 font-bold">Risk Level:</span>
              <span className={`text-lg ${getRiskLevelColor(lastAnalysis.risk_level)}`}>
                {lastAnalysis.risk_level.toUpperCase()}
              </span>
            </div>

            {lastAnalysis.threats_found.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Threats Found ({lastAnalysis.threats_found.length})</h4>
                <div className="space-y-2">
                  {lastAnalysis.threats_found.map((threat) => (
                    <div key={threat.id} className="border border-slate-300 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{threat.type}</span>
                        <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(threat.severity)}`}>
                          {threat.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">{threat.description}</p>

                      {threat.countermeasures.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Countermeasures:</p>
                          <div className="flex flex-wrap gap-2">
                            {threat.countermeasures.map((countermeasure: string, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => handleMitigate(threat.id, countermeasure)}
                                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                              >
                                {countermeasure}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lastAnalysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {lastAnalysis.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Threat History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-slate-300 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Recent Threat Analysis History</h3>

        {threatHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-700 dark:text-slate-300 font-medium">
            No threat analyses yet. Start by analyzing a prompt above.
          </div>
        ) : (
          <div className="space-y-3">
            {threatHistory.slice(0, 10).map((analysis) => (
              <div key={analysis.analysis_id} className="border border-slate-300 dark:border-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {new Date(analysis.timestamp).toLocaleString()}
                  </span>
                  <span className={`text-sm ${getRiskLevelColor(analysis.risk_level)}`}>
                    {analysis.risk_level.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  {analysis.threats_found.length} threat(s) detected
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptsThreatDashboard;
