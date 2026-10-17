import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PhotoCredit {
  id: string;
  photographer: string;
  available: number;
}

const PhotoCreditWidget: React.FC = () => {
  const [credit, setCredit] = useState<PhotoCredit | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const response = await axios.get('/api/photocredits/suggested');
        setCredit(response.data);
      } catch (e) {
        setCredit({
          id: '1',
          photographer: '@photographer',
          available: 50
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCredit();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Suggested Photocredit</h3>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-300 dark:bg-gray-600 h-20 rounded-lg w-full mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
        </div>
      ) : credit ? (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4">
          <div className="bg-gradient-to-br from-indigo-400 to-blue-500 h-20 rounded-lg mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h4 className="font-bold text-base text-gray-900 dark:text-white">Photo Credits</h4>
          <p className="text-sm text-slate-700 dark:text-gray-400">{credit.photographer}</p>
          <p className="text-sm text-slate-700 dark:text-gray-400 mt-3">Available: {credit.available}</p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => navigate(credit ? `/photocredit/${credit.id}` : '/photocredits')}
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-lg hover:from-orange-600 hover:to-amber-600 transition text-base font-medium shadow"
      >
        Buy Credits
      </button>
      <div className="flex justify-center mt-4 space-x-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-2 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        ))}
      </div>
    </div>
  );
};

export default PhotoCreditWidget;
