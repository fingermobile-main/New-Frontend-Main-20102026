import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import MarketplaceCatalogConsole from '../../components/dashboard/catalog/MarketplaceCatalogConsole';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MarketplaceCatalogPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 mb-2">
          <Link to="/marketplace" className="hover:text-indigo-700 flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5 mr-0.5" />
            <span>Marketplace Store</span>
          </Link>
          <span>/</span>
          <span className="text-slate-900">Marketplace Product Catalogue</span>
        </div>

        <MarketplaceCatalogConsole />
      </div>
    </MainLayout>
  );
};

export default MarketplaceCatalogPage;
