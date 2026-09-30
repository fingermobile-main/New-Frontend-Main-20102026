import React, { useEffect, useState } from 'react';
import { flamingoService, FlamingoSizeChart } from '../../services/flamingoService';

interface SizeGuideProps {
  brandName?: string;
  categoryId?: string;
}

const SizeGuide: React.FC<SizeGuideProps> = ({ brandName, categoryId }) => {
  const [sizeCharts, setSizeCharts] = useState<FlamingoSizeChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [selectedGender, setSelectedGender] = useState('unisex');

  useEffect(() => {
    loadSizeCharts();
  }, [brandName, categoryId, selectedRegion, selectedGender]);

  const loadSizeCharts = async () => {
    try {
      setLoading(true);
      // @ts-ignore - Auto-suppressed for compilation
      const params: SizeGuideParams = {};
      if (brandName) params.brand_name = brandName;
      if (categoryId) params.category_id = categoryId;
      if (selectedRegion) params.region = selectedRegion;
      if (selectedGender) params.gender = selectedGender;

      const data = await flamingoService.getSizeCharts(params);
      setSizeCharts(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load size charts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
          onClick={loadSizeCharts}
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
        <h2 className="text-2xl font-bold text-gray-900">Size Guide</h2>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="US">US Sizes</option>
          <option value="EU">EU Sizes</option>
          <option value="UK">UK Sizes</option>
          <option value="JP">JP Sizes</option>
        </select>

        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="unisex">All Genders</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>
      </div>

      {/* Size Charts */}
      {sizeCharts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No size charts available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sizeCharts.map((chart) => (
            <div
              key={chart.id}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              {/* Chart Header */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {chart.brand_name} - {chart.category_id}
                </h3>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {chart.region}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {chart.gender}
                  </span>
                </div>
              </div>

              {/* Size Table */}
              {chart.sizes && Object.keys(chart.sizes).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        {(() => {
                          const firstSizeKey = Object.keys(chart.sizes)[0];
                          if (!firstSizeKey) return null;
                          const firstSizeData: any = (chart.sizes as any)[firstSizeKey];
                          if (!firstSizeData) return null;
                          return Object.keys(firstSizeData).map((key) => (
                            <th
                              key={key}
                              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {key.replace('_', ' ').toUpperCase()}
                            </th>
                          ));
                        })()}

                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(chart.sizes).map(([sizeLabel, measurements]) => (
                        <tr key={sizeLabel} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {sizeLabel}
                          </td>
                          {Object.entries(measurements as Record<string, any>).map(([key, value]) => (
                            <td key={key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                              {value as React.ReactNode}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No size data available</p>
              )}

              {/* Source Info */}
              {chart.source_url && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={chart.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    View source →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SizeGuide;
