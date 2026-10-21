import React, { useState } from 'react';
import {
  Package,
  ShoppingBag,
  Flame,
  Gem,
  Store
} from 'lucide-react';
import GeneralProductCatalogConsole from './GeneralProductCatalogConsole';
import MarketplaceCatalogConsole from './MarketplaceCatalogConsole';
import FlamingoCatalogConsole from './FlamingoCatalogConsole';
import OwnitCatalogConsole from './OwnitCatalogConsole';
import StorefrontVettingCatalogConsole from './StorefrontVettingCatalogConsole';

export type CatalogSubTab = 'general' | 'marketplace' | 'flamingo' | 'ownit' | 'storefront';

interface UnifiedCommerceCatalogHubProps {
  initialTab?: CatalogSubTab;
}

export const UnifiedCommerceCatalogHub: React.FC<UnifiedCommerceCatalogHubProps> = ({
  initialTab = 'general'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<CatalogSubTab>(initialTab);

  const TABS = [
    {
      id: 'general' as CatalogSubTab,
      name: 'General Product Catalogue',
      subtitle: 'Universal Master Inventory & Media',
      icon: Package,
      color: 'text-emerald-700',
      badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-300'
    },
    {
      id: 'marketplace' as CatalogSubTab,
      name: 'Marketplace Catalogue',
      subtitle: 'Public Hardware & Goods',
      icon: ShoppingBag,
      color: 'text-indigo-700',
      badgeBg: 'bg-indigo-100 text-indigo-950 border-indigo-300'
    },
    {
      id: 'flamingo' as CatalogSubTab,
      name: 'Flamingo Catalogue',
      subtitle: 'Luxury Fashion & VIP Tiers',
      icon: Flame,
      color: 'text-pink-700',
      badgeBg: 'bg-pink-100 text-pink-950 border-pink-300'
    },
    {
      id: 'ownit' as CatalogSubTab,
      name: 'OwnIt Catalogue',
      subtitle: '1-of-1 Assets & Installments',
      icon: Gem,
      color: 'text-purple-700',
      badgeBg: 'bg-purple-100 text-purple-950 border-purple-300'
    },
    {
      id: 'storefront' as CatalogSubTab,
      name: 'Storefront Vetting',
      subtitle: 'Merchant Inspection & Censorship',
      icon: Store,
      color: 'text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-950 border-amber-300'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Switcher */}
      <div className="bg-white border border-slate-300 rounded-2xl p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => {
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl border text-left transition ${
                  isSelected
                    ? `${tab.badgeBg} font-black shadow-sm ring-1 ring-slate-400`
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${tab.color}`} />
                <div>
                  <div className="text-xs font-bold leading-tight">{tab.name}</div>
                  <div className="text-[10px] text-slate-600 font-medium">{tab.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Selected Console */}
      {activeSubTab === 'general' && <GeneralProductCatalogConsole />}
      {activeSubTab === 'marketplace' && <MarketplaceCatalogConsole />}
      {activeSubTab === 'flamingo' && <FlamingoCatalogConsole />}
      {activeSubTab === 'ownit' && <OwnitCatalogConsole />}
      {activeSubTab === 'storefront' && <StorefrontVettingCatalogConsole />}
    </div>
  );
};

export default UnifiedCommerceCatalogHub;
