import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PhotoCredit {
  id: string;
  photographer: string;
  available: number;
}

const DEFAULT_PHOTO_CREDIT: PhotoCredit = {
  id: '1',
  photographer: '@photographer',
  available: 50
};

const PhotoCreditWidget: React.FC = () => {
  const [credit, setCredit] = useState<PhotoCredit | null>(DEFAULT_PHOTO_CREDIT);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const response = await axios.get('/api/photocredits/suggested');
        const data = response?.data?.data || response?.data;
        if (data && typeof data === 'object' && ('id' in data || 'photographer' in data)) {
          setCredit(data);
        } else {
          setCredit(DEFAULT_PHOTO_CREDIT);
        }
      } catch (e) {
        setCredit(DEFAULT_PHOTO_CREDIT);
      } finally {
        setLoading(false);
      }
    };
    fetchCredit();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-slate-200 dark:border-slate-700">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Suggested Photocredit</h3>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-300 dark:bg-gray-600 h-20 rounded-lg w-full mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
        </div>
      ) : credit ? (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4">
          <div className="bg-slate-900 h-20 rounded-lg mb-4 flex items-center justify-center p-2 border border-slate-700/60 overflow-hidden shadow-inner">
            <img
              src="/assets/logos/photocredits_icon.png"
              alt="PhotoCredits"
              className="h-16 w-16 object-contain"
            />
          </div>
          <h4 className="font-bold text-base text-gray-900 dark:text-white">Photo Credits</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{credit.photographer}</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 font-medium">Available: <span className="font-bold text-slate-900 dark:text-white">{credit.available}</span></p>
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
