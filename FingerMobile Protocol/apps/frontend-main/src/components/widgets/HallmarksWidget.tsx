import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Hallmark {
  id: string;
  name: string;
  icon: string; // Tailwind color classes for background
}

const DEFAULT_HALLMARKS: Hallmark[] = [
  { id: '1', name: 'Verified Account', icon: 'from-blue-500 to-blue-600' },
  { id: '2', name: 'Community Leader', icon: 'from-green-500 to-green-600' },
  { id: '3', name: 'Top Contributor', icon: 'from-purple-500 to-purple-600' }
];

const HallmarksWidget: React.FC = () => {
  const [hallmarks, setHallmarks] = useState<Hallmark[]>(DEFAULT_HALLMARKS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHallmarks = async () => {
      try {
        const response = await axios.get('/api/hallmarks/recent');
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : null;

        if (list && list.length > 0) {
          setHallmarks(list);
        } else {
          setHallmarks(DEFAULT_HALLMARKS);
        }
      } catch (e) {
        setHallmarks(DEFAULT_HALLMARKS);
      } finally {
        setLoading(false);
      }
    };
    fetchHallmarks();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-slate-300 dark:border-slate-700">
      <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">Hallmarks</h3>
      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center py-2">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-4 border text-slate-950 border-slate-400 font-black"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            ))}
          </div>
        ) : (
          (Array.isArray(hallmarks) ? hallmarks : DEFAULT_HALLMARKS).map((hallmark) => (
            <Link
              to="/settings/badges"
              key={hallmark.id}
              className="flex items-center py-3 group hover:opacity-90 transition-opacity"
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${hallmark.icon} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-base font-semibold text-slate-800 dark:text-gray-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                {hallmark.name}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default HallmarksWidget;
