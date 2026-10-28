import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import OwnitCatalogConsole from '../../components/dashboard/catalog/OwnitCatalogConsole';
import { ArrowLeft, Gem, RefreshCw, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const OwnitCatalogPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="w-full max-w-full overflow-x-hidden min-h-screen max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28 md:pb-12 space-y-5 sm:space-y-6">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 mb-2">
          <Link to="/ownit" className="hover:text-purple-700 flex items-center space-x-1 min-h-[44px] py-2">
            <ArrowLeft className="w-4 h-4 mr-0.5 shrink-0" />
            <span>OwnIt Store</span>
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-black">OwnIt Product Catalogue</span>
        </div>

        <OwnitCatalogConsole />
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div
        data-testid="ownit-catalog-mobile-dock"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl px-4 py-2 pb-safe"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link
            to="/ownit"
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl text-slate-700 hover:text-slate-900 active:scale-95 transition"
          >
            <ShoppingBag className="w-5 h-5 mb-0.5 text-purple-600" />
            <span className="text-[11px] font-bold leading-tight">OwnIt Mall</span>
          </Link>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl text-purple-700 font-bold bg-purple-50"
          >
            <Gem className="w-5 h-5 mb-0.5 text-purple-700" />
            <span className="text-[11px] leading-tight">Catalogue</span>
          </button>
          <Link
            to="/ownit-tracking"
            className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-md shadow-purple-500/20 active:scale-95 transition"
          >
            <span className="text-base mb-0.5">📦</span>
            <span className="text-[11px] leading-tight">Tracking</span>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default OwnitCatalogPage;
