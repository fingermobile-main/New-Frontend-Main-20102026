import React from 'react';
import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from "../contexts/AppContext";
import { 
  ChartBarIcon, 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ClockIcon,
  DownloadIcon,
  FunnelIcon
} from '../icons';

interface MetricData {
  name: string;
  value: number;
  timestamp: number;
  labels?: Record<string, string>;
}

const PrometheusMetricsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [timeRange, setTimeRange] = useState('1h');
  const [viewMode, setViewMode] = useState<'graph' | 'table'>('table');

  useEffect(() => {
    fetchMetrics();
  }, [query, timeRange]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      // In production, this would query the /metrics endpoint or Prometheus API
      // For now, simulate metric data
      const simulatedMetrics: MetricData[] = [
        { name: 'http_requests_total', value: 125847, timestamp: Date.now(), labels: { method: 'GET', status: '200' } },
        { name: 'http_requests_total', value: 3421, timestamp: Date.now(), labels: { method: 'POST', status: '200' } },
        { name: 'http_request_duration_seconds', value: 0.245, timestamp: Date.now(), labels: { quantile: '0.99' } },
        { name: 'node_cpu_usage_percent', value: 45.2, timestamp: Date.now() },
        { name: 'node_memory_usage_bytes', value: 2147483648, timestamp: Date.now() },
        { name: 'process_resident_memory_bytes', value: 524288000, timestamp: Date.now() },
        { name: 'database_connections_active', value: 42, timestamp: Date.now() },
        { name: 'cache_hit_ratio', value: 0.94, timestamp: Date.now() }
      ];
      
      setMetrics(simulatedMetrics);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      showToast('Failed to load Prometheus metrics', 'error');
      setLoading(false);
    }
  };

  const handleExportMetrics = () => {
    const csvContent = [
      ['Metric Name', 'Value', 'Timestamp', 'Labels'].join(','),
      ...metrics.map(m => [
        m.name,
        m.value,
        new Date(m.timestamp).toISOString(),
        JSON.stringify(m.labels || {})
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prometheus-metrics-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Metrics exported successfully', 'success');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900">Prometheus Metrics</h1>
                <p className="text-gray-600">Explore and query system metrics using PromQL</p>
              </div>
            </div>
            <button
              onClick={handleExportMetrics}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors"
            >
              <DownloadIcon className="h-5 w-5 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Query Builder */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Query Builder</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PromQL Query
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., http_requests_total{method='GET'}"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  onClick={fetchMetrics}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors"
                >
                  Execute
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Range
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="5m">Last 5 minutes</option>
                  <option value="15m">Last 15 minutes</option>
                  <option value="1h">Last 1 hour</option>
                  <option value="6h">Last 6 hours</option>
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  View Mode
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-lg ${
                      viewMode === 'table'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode('graph')}
                    className={`px-4 py-2 rounded-lg ${
                      viewMode === 'graph'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Graph
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Display */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metric Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Labels
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.map((metric, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {metric.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {typeof metric.value === 'number' && metric.value % 1 !== 0
                          ? metric.value.toFixed(3)
                          : metric.value}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {metric.labels ? (
                          <div className="space-y-1">
                            {Object.entries(metric.labels).map(([key, value]) => (
                              <div key={key} className="flex items-center text-xs">
                                <span className="font-medium text-gray-600">{key}:</span>
                                <span className="ml-1 text-gray-800">{value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {new Date(metric.timestamp).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Metrics Visualization</h3>
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Graph visualization would be rendered here</p>
                <p className="text-sm text-gray-400 mt-2">Integrate with Chart.js or D3.js for time-series charts</p>
              </div>
            </div>
          </div>
        )}

        {/* Common Metrics Quick Access */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'http_requests_total',
              'http_request_duration_seconds',
              'node_cpu_usage_percent',
              'node_memory_usage_bytes',
              'database_connections_active',
              'cache_hit_ratio'
            ].map((metricName) => (
              <button
                key={metricName}
                onClick={() => setQuery(metricName)}
                className="p-4 bg-gray-50 rounded-lg hover:bg-orange-50 hover:border-orange-300 border border-gray-200 transition-colors text-left"
              >
                <code className="text-sm font-mono text-orange-600">{metricName}</code>
              </button>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrometheusMetricsPage;
