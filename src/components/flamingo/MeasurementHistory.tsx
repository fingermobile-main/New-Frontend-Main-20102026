import React, { useEffect, useState } from 'react';
import { flamingoService, FlamingoMeasurement } from '../../services/flamingoService';

interface MeasurementHistoryProps {
  userId: string;
}

const MeasurementHistory: React.FC<MeasurementHistoryProps> = ({ userId }) => {
  const [measurements, setMeasurements] = useState<FlamingoMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('chest');

  useEffect(() => {
    loadMeasurements();
  }, [userId]);

  const loadMeasurements = async () => {
    try {
      setLoading(true);
      const data = await flamingoService.getMeasurements(userId);
      // Assuming API returns array of measurements over time
      setMeasurements(Array.isArray(data) ? (data as FlamingoMeasurement[]) : []);
      setError(null);
    } catch (err) {
      setError('Failed to load measurement history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMetricValue = (measurement: FlamingoMeasurement, metric: string) => {
    return (measurement as any)[metric] || 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateChange = (current: number, previous: number) => {
    const diff = current - previous;
    const percentChange = previous !== 0 ? ((diff / previous) * 100).toFixed(1) : '0.0';
    return { diff: diff.toFixed(1), percent: percentChange };
  };

  const metrics = [
    { key: 'chest', label: 'Chest', unit: 'inches' },
    { key: 'waist', label: 'Waist', unit: 'inches' },
    { key: 'hips', label: 'Hips', unit: 'inches' },
    { key: 'shoulder_width', label: 'Shoulders', unit: 'inches' },
    { key: 'arm_length', label: 'Arm Length', unit: 'inches' },
    { key: 'inseam', label: 'Inseam', unit: 'inches' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadMeasurements}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Measurement History</h2>
        <span className="text-sm text-gray-600">
          {measurements.length} record{measurements.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Metric Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            onClick={() => setSelectedMetric(metric.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedMetric === metric.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {metric.label}
          </button>
        ))}
      </div>

      {/* Current Value Card */}
      {measurements.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-blue-700 mb-1">Current {metrics.find(m => m.key === selectedMetric)?.label}</p>
              <p className="text-4xl font-bold text-blue-900">
                {getMetricValue(measurements[0], selectedMetric)}
                <span className="text-lg text-blue-700 ml-1">
                  {metrics.find(m => m.key === selectedMetric)?.unit}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-700 mb-1">Last Updated</p>
              <p className="font-semibold text-blue-900">
                {formatDate((measurements[0] as any).updated_at || (measurements[0] as any).created_at || new Date().toISOString())}
              </p>
            </div>
          </div>

          {/* Change Indicator */}
          {measurements.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-700">Change since last:</span>
              {(() => {
                const change = calculateChange(
                  getMetricValue(measurements[0], selectedMetric),
                  getMetricValue(measurements[1], selectedMetric)
                );
                const isIncrease = parseFloat(change.diff) > 0;
                return (
                  <>
                    <span className={`text-lg font-bold ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                      {isIncrease ? '↑' : '↓'} {Math.abs(parseFloat(change.diff))} {metrics.find(m => m.key === selectedMetric)?.unit}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${isIncrease ? 'bg-red-100 text-red-950 border border-red-400 font-bold' : 'bg-green-100 text-green-950 border border-green-400 font-bold'}`}>
                      {change.percent}%
                    </span>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* History Timeline */}
      {measurements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-slate-700">No measurement history yet</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Take First Measurement
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Previous Measurements</h3>
          {measurements.slice(1).map((measurement, idx) => {
            const currentValue = getMetricValue(measurement, selectedMetric);
            const previousValue = idx < measurements.length - 2
              ? getMetricValue(measurements[idx + 2], selectedMetric)
              : currentValue;
            const change = calculateChange(currentValue, previousValue);

            return (
              <div
                key={measurement.id || idx}
                className="bg-white border border-slate-300 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {currentValue} {metrics.find(m => m.key === selectedMetric)?.unit}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate((measurement as any).updated_at || (measurement as any).created_at || new Date().toISOString())}
                    </p>
                  </div>

                  {idx < measurements.length - 1 && (
                    <div className="text-right">
                      <span className={`text-sm font-medium ${parseFloat(change.diff) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {parseFloat(change.diff) > 0 ? '↑' : '↓'} {Math.abs(parseFloat(change.diff))}
                      </span>
                      <p className="text-xs text-slate-700 mt-1">from previous</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <p className="text-sm text-purple-800">
          <strong>Tip:</strong> Update your measurements every 3-6 months or after significant weight changes for accurate size recommendations.
        </p>
      </div>
    </div>
  );
};

export default MeasurementHistory;
