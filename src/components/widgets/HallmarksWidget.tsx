import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Hallmark {
  id: string;
  name: string;
  icon: string; // Tailwind color classes for background
}

const HallmarksWidget: React.FC = () => {
  const [hallmarks, setHallmarks] = useState<Hallmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHallmarks = async () => {
      try {
        const response = await axios.get('/api/hallmarks/recent');
        setHallmarks(response.data);
      } catch (e) {
        setHallmarks([
          { id: '1', name: 'Verified Account', icon: 'from-blue-500 to-blue-600' },
          { id: '2', name: 'Community Leader', icon: 'from-green-500 to-green-600' },
          { id: '3', name: 'Top Contributor', icon: 'from-purple-500 to-purple-600' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchHallmarks();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Hallmarks</h3>
      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center py-2">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-4 border text-gray-950 border-gray-400 font-black"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            ))}
          </div>
        ) : (
          hallmarks.map((hallmark) => (
            <div key={hallmark.id} className="flex items-center py-3 group cursor-pointer">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${hallmark.icon} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {hallmark.name}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HallmarksWidget;
