import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import StorefrontVettingCatalogConsole from '../../components/dashboard/catalog/StorefrontVettingCatalogConsole';
import { ArrowLeft, Store, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const StorefrontCatalogPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700 mb-2">
          <Link
            to="/storefront"
            className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl hover:text-amber-800 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span>Storefront Portal</span>
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-black">General Storefront Product Catalogue</span>
        </div>

        <StorefrontVettingCatalogConsole />

        {/* Sovereign Mobile Navigation Quick Dock */}
        <nav
          aria-label="Storefront Catalog Mobile Actions"
          className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
        >
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Store className="w-5 h-5 mb-0.5" />
            <span>Catalog</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.querySelector('input[placeholder*="Search merchant items"]');
              if (el) (el as HTMLElement).focus();
            }}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span>Filter</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const refreshBtn = document.querySelector('button:has(svg.lucide-refresh-cw)');
              if (refreshBtn) (refreshBtn as HTMLButtonElement).click();
            }}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-5 h-5 mb-0.5" />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/storefront')}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span>Portal</span>
          </button>
        </nav>
      </div>
    </MainLayout>
  );
};

export default StorefrontCatalogPage;
