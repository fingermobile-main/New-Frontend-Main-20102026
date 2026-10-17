import React, { useEffect, useState } from 'react';
import sentientService, { BehavioralAnalysis } from '../../services/sentientService';

interface SentientAIDashboardProps {
  userId?: string;
}

const SentientAIDashboard: React.FC<SentientAIDashboardProps> = ({ userId }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [behaviorData, setBehaviorData] = useState('');
  const [lastAnalysis, setLastAnalysis] = useState<BehavioralAnalysis | null>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    anomaliesDetected: 0,
    avgRiskLevel: 'low'
  });
  const [error, setError] = useState<string | null>(null);

  // Load anomalies on mount
  useEffect(() => {
    loadAnomalies();
  }, []);

  const loadAnomalies = async () => {
    try {
      const anomalyList = await sentientService.getAnomalies(userId, 20);
      setAnomalies(anomalyList);

      // Update stats
      setStats(prev => ({
        ...prev,
        anomaliesDetected: anomalyList.length
      }));
    } catch (err: any) {
      console.error('Failed to load anomalies:', err);
    }
  };

  const handleAnalyzeBehavior = async () => {
    if (!userId || !behaviorData.trim()) {
      setError('User ID and behavior data required');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const analysis = await sentientService.analyzeBehavior(userId, {
        actions: JSON.parse(behaviorData),
        timestamp: new Date().toISOString()
      });

      setLastAnalysis(analysis);

      // Update stats
      setStats(prev => ({
        ...prev,
        totalAnalyses: prev.totalAnalyses + 1
      }));

      // Refresh anomalies
      await loadAnomalies();

      // Clear input
      setBehaviorData('');
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
    case 'critical': return 'text-red-600 font-bold';
    case 'high': return 'text-orange-500 font-semibold';
    case 'medium': return 'text-yellow-500 font-semibold';
    case 'low': return 'text-green-600 font-semibold';
    default: return 'text-gray-600';
    }
  };

  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel) {
    case 'critical': return 'bg-red-600 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-yellow-500 text-black';
    case 'low': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">SENTIENT™©® AI Control Center</h2>
        <p className="text-sm opacity-90">Sentient Engine for Neural Threat Identification & Evaluation</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Analyses</div>
          <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Anomalies Detected</div>
          <div className="text-2xl font-bold text-orange-600">{stats.anomaliesDetected}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Avg Risk Level</div>
          <div className={`text-2xl ${getRiskLevelColor(stats.avgRiskLevel)}`}>
            {stats.avgRiskLevel.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Behavioral Analysis Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Analyze Member Behavior</h3>

        <div className="space-y-4">
          <textarea
            value={behaviorData}
            onChange={(e) => setBehaviorData(e.target.value)}
            placeholder='Enter behavior data as JSON array (e.g., [{"action": "login", "timestamp": "..."}])...'
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
            rows={4}
          />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyzeBehavior}
            disabled={analyzing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {analyzing ? '🤖 Analyzing...' : '🧠 Analyze Behavior'}
          </button>
        </div>
      </div>

      {/* Last Analysis Result */}
      {lastAnalysis && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Latest Behavioral Analysis</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Risk Level:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelBadge(lastAnalysis.risk_level)}`}>
                {lastAnalysis.risk_level.toUpperCase()}
              </span>
            </div>

            {lastAnalysis.anomalies.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Anomalies Detected ({lastAnalysis.anomalies.length})</h4>
                <div className="space-y-2">
                  {lastAnalysis.anomalies.map((anomaly, idx) => (
                    <div key={idx} className="border border-slate-300 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{anomaly.type || 'Unknown'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Score: {anomaly.score || 'N/A'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {anomaly.description || 'No description available'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lastAnalysis.insights.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">AI Insights</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {lastAnalysis.insights.map((insight, idx) => (
                    <li key={idx}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}

            {lastAnalysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {lastAnalysis.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Anomaly Alerts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Anomaly Alerts</h3>

        {anomalies.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No anomalies detected. System operating normally.
          </div>
        ) : (
          <div className="space-y-3">
            {anomalies.slice(0, 10).map((anomaly, idx) => (
              <div key={idx} className="border border-slate-300 dark:border-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{anomaly.type || 'Unknown Anomaly'}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(anomaly.timestamp || Date.now()).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {anomaly.description || 'No details available'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SentientAIDashboard;
