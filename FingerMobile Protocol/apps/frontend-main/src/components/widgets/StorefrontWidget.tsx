import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface StorefrontPreview {
  id: string;
  name: string;
  sales: number;
}

const DEFAULT_STORE: StorefrontPreview = {
  id: '1',
  name: 'Digital Products',
  sales: 125
};

const StorefrontWidget: React.FC = () => {
  const [store, setStore] = useState<StorefrontPreview>(DEFAULT_STORE);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get('/api/storefront/featured');
        const raw = response?.data?.data ?? response?.data;
        if (raw && typeof raw === 'object' && raw.name && typeof raw.sales === 'number') {
          setStore(raw);
        } else {
          setStore(DEFAULT_STORE);
        }
      } catch (e) {
        setStore(DEFAULT_STORE);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-slate-300 dark:border-slate-700">
      <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">Storefront</h3>
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
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Latest items</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 font-medium">Sales: <span className="font-bold text-slate-900 dark:text-white">{store.sales}</span></p>
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
