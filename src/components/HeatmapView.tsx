import React, { useState } from 'react';
import { CalendarDaysIcon, MapPinIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

// Mock data for heatmap
const generateMockHeatmapData = () => {
  const data = [];
  for (let day = 0; day < 30; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Generate activity based on time of day and day of week
      const dayOfWeek = (day + 3) % 7; // Starting on Wednesday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      let baseActivity = 10;
      if (hour >= 8 && hour <= 17) baseActivity += 15; // Daytime activity
      if (hour >= 19 && hour <= 22) baseActivity += 20; // Evening activity
      if (isWeekend) baseActivity += 10; // Weekend boost

      // Random variation
      const activity = Math.max(0, baseActivity + Math.floor(Math.random() * 20) - 10);

      data.push({
        day,
        hour,
        activity,
        dayLabel: `Day ${day + 1}`,
        hourLabel: `${hour}:00`
      });
    }
  }
  return data;
};

const HeatmapView: React.FC = () => {
  const [heatmapData] = useState(generateMockHeatmapData());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-04');

  // Group data by day
  const groupedByDay = heatmapData.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, typeof heatmapData>);

  // Get activity levels for coloring
  const maxActivity = Math.max(...heatmapData.map(d => d.activity), 1);

  const getActivityColor = (activity: number) => {
    if (activity === 0) return 'bg-gray-100';
    if (activity < maxActivity * 0.25) return 'bg-green-200';
    if (activity < maxActivity * 0.5) return 'bg-green-400';
    if (activity < maxActivity * 0.75) return 'bg-green-600';
    return 'bg-green-800';
  };

  // Get hours for labels
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Activity Heatmap</h2>
            <p className="mt-1 text-sm text-gray-500">Visualize your engagement patterns</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Engagement Patterns</h3>
            <div className="flex items-center text-sm text-gray-500">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-green-200 rounded mr-1"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-green-400 rounded mr-1"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-800 rounded mr-1"></div>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Heatmap grid */}
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Hour labels */}
              <div className="flex ml-12">
                {hours.map(hour => (
                  <div key={hour} className="w-8 h-8 flex items-center justify-center text-xs text-gray-500">
                    {hour % 4 === 0 ? hour : ''}
                  </div>
                ))}
              </div>

              {/* Days and activity blocks */}
              {Object.entries(groupedByDay).slice(0, 14).map(([day, dayData]) => (
                <div key={day} className="flex items-center mt-1">
                  <div className="w-12 text-xs text-gray-500 text-right pr-2">
                    Day {parseInt(day) + 1}
                  </div>
                  <div className="flex">
                    {dayData.map((hourData, hourIndex) => (
                      <div
                        key={hourIndex}
                        className={`w-8 h-8 mx-px ${getActivityColor(hourData.activity)}`}
                        title={`Day ${parseInt(day) + 1}, ${hourData.hour}:00 - ${hourData.activity} activities`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full border text-blue-950 border-blue-400 font-black">
                <SunIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Peak Activity Time</p>
                <p className="text-lg font-bold text-gray-900">7-10 PM</p>
                <p className="text-xs text-gray-500 mt-1">Most engagement happens in the evening</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-5 border border-purple-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full border text-purple-950 border-purple-400 font-black">
                <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Best Day to Engage</p>
                <p className="text-lg font-bold text-gray-900">Saturday</p>
                <p className="text-xs text-gray-500 mt-1">Higher activity on weekends</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-5 border border-amber-100">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-full border text-amber-950 border-amber-400 font-black">
                <MapPinIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Optimal Frequency</p>
                <p className="text-lg font-bold text-gray-900">Daily</p>
                <p className="text-xs text-gray-500 mt-1">Consistent presence increases matches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-blue-50 rounded-lg p-5 border border-blue-100">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Recommendations</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Schedule your most engaging content for evenings between 7-10 PM when activity peaks
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Maintain consistent activity on weekends, especially Saturdays, for better visibility
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Try posting 2-3 times daily during peak hours to maximize engagement opportunities
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Use the early morning hours (6-9 AM) for less competitive posting with steady engagement
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeatmapView;
