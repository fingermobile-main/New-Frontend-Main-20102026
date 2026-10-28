import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import FlamingoCatalogConsole from '../../components/dashboard/catalog/FlamingoCatalogConsole';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const FlamingoCatalogPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 mb-2">
            <Link to="/flamingo" className="hover:text-pink-700 flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5 mr-0.5" />
              <span>Flamingo VIP Store</span>
            </Link>
            <span>/</span>
            <span className="text-slate-900">Flamingo Product Catalogue</span>
          </div>

          <FlamingoCatalogConsole />
        </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
          <Link
            to="/flamingo"
            aria-label="Flamingo Store"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-pink-600"
          >
            <span className="text-base">🦩</span>
            <span>Flamingo</span>
          </Link>
          <button
            onClick={() => { const input = document.querySelector('input[type="text"]') as HTMLInputElement; if (input) { input.focus(); input.scrollIntoView({ behavior: 'smooth' }); } }}
            aria-label="Search Flamingo"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-pink-600"
          >
            <span className="text-base">🔍</span>
            <span>Search</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            aria-label="Reload Flamingo"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-pink-600"
          >
            <span className="text-base">🔄</span>
            <span>Sync</span>
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to Top"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-pink-600"
          >
            <span className="text-base">⬆️</span>
            <span>Top</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default FlamingoCatalogPage;
