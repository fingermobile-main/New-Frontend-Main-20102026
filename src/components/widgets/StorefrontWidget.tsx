import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface StorefrontPreview {
  id: string;
  name: string;
  sales: number;
}

const StorefrontWidget: React.FC = () => {
  const [store, setStore] = useState<StorefrontPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get('/api/storefront/featured');
        setStore(response.data);
      } catch (e) {
        // Fallback for development
        setStore({
          id: '1',
          name: 'Digital Products',
          sales: 125
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Storefront</h3>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-300 dark:bg-gray-600 h-20 rounded-lg w-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      ) : store ? (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
          <div className="bg-gradient-to-br from-orange-400 to-amber-400 h-20 rounded-lg mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <h4 className="font-bold text-base text-gray-900 dark:text-white">{store.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Latest items</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Sales: {store.sales}</p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => navigate(store ? `/storefront/${store.id}` : '/marketplace')}
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-lg hover:from-orange-600 hover:to-amber-600 transition mt-4 text-base font-medium shadow"
      >
        View Store
      </button>
    </div>
  );
};

export default StorefrontWidget;
