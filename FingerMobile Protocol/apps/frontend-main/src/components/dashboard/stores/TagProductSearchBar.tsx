import React, { useState, useEffect } from 'react';
import {
  Search,
  Tag,
  Check,
  Store,
  Sparkles,
  Gift,
  Coins,
  Percent,
  X,
  ExternalLink,
} from 'lucide-react';
import { CrossStoreProduct } from '../../../types/roles-permissions';
import crossStoreSearchService from '../../../services/crossStoreSearchService';

interface TagProductSearchBarProps {
  onSelectProduct?: (product: CrossStoreProduct) => void;
  selectedProducts?: CrossStoreProduct[];
  onRemoveProduct?: (productId: string) => void;
}

export const TagProductSearchBar: React.FC<TagProductSearchBarProps> = ({
  onSelectProduct,
  selectedProducts = [],
  onRemoveProduct,
}) => {
  const [query, setQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [results, setResults] = useState<CrossStoreProduct[]>([]);
  const [matchingStores, setMatchingStores] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const supportedStores = [
    { id: 'all', name: 'All 5 Stores', color: '#64748B' },
    { id: 'MarketPlace', name: 'MarketPlace', color: '#2563EB' },
    { id: 'OwnIt', name: 'OwnIt', color: '#7C3AED' },
    { id: 'Flamingo', name: 'Flamingo', color: '#E11D48' },
    { id: 'Storefront', name: 'Storefront', color: '#059669' },
    { id: 'FingerLux', name: 'FingerLux', color: '#D97706' },
  ];

  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);
      try {
        const res = await crossStoreSearchService.searchStores({
          query,
          store: selectedStore,
          limit: 15,
        });
        setResults(res.results);
        setMatchingStores(res.matchingStores);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(handleSearch, 200);
    return () => clearTimeout(timer);
  }, [query, selectedStore]);

  return (
    <div className="w-full space-y-3">
      {/* Selected Tagged Products Pills */}
      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((p) => (
            <div
              key={p.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold shadow-sm"
            >
              <Tag className="w-3 h-3 text-blue-400" />
              <span>{p.title}</span>
              <span
                className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold"
                style={{ backgroundColor: p.storeBadgeColor, color: '#fff' }}
              >
                {p.store}
              </span>
              <span className="text-amber-400 font-mono text-[11px]">{p.price} FIC</span>
              {onRemoveProduct && (
                <button
                  type="button"
                  onClick={() => onRemoveProduct(p.id)}
                  className="hover:text-red-400 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Mini Search Bar (Crawler across MarketPlace, OwnIt, Flamingo, Storefront, FingerLux) */}
      <div className="relative">
        <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <div className="pl-3.5 text-slate-700">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            placeholder="Search & tag items across MarketPlace, OwnIt, Flamingo, Storefront, FingerLux..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpenDropdown(true);
            }}
            onFocus={() => setIsOpenDropdown(true)}
            className="w-full px-3 py-2.5 text-xs bg-white dark:bg-slate-900 focus:outline-none text-slate-900 dark:text-white font-bold border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
          />

          {loading && (
            <div className="pr-3 text-xs text-slate-700 animate-pulse font-mono">
              Crawling...
            </div>
          )}
        </div>

        {/* Store Highlight Badges */}
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap mr-1">
            Stores:
          </span>
          {supportedStores.map((st) => {
            const isHighlighted = matchingStores.includes(st.id) || st.id === 'all';
            const isSelected = selectedStore === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStore(st.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : isHighlighted
                    ? 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-400'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium border-slate-300 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <span>{st.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Results Dropdown */}
        {isOpenDropdown && results.length > 0 && (
          <div
            className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-30 max-h-72 overflow-y-auto space-y-1 animate-in fade-in"
            onMouseLeave={() => setIsOpenDropdown(false)}
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Matching Products & Entitlements ({results.length})</span>
              <button
                onClick={() => setIsOpenDropdown(false)}
                className="text-slate-700 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            {results.map((product) => {
              const alreadySelected = selectedProducts.some((p) => p.id === product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => {
                    if (onSelectProduct) {
                      onSelectProduct(product);
                    }
                    setIsOpenDropdown(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                    alreadySelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-slate-700 text-[11px] shadow-sm flex-shrink-0"
                      style={{ backgroundColor: product.storeBadgeColor }}
                    >
                      {product.store.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {product.title}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {product.store}
                        </span>
                        <span>•</span>
                        <span>{product.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                        {product.price} {product.currency}
                      </div>
                      {product.fiatPrice && (
                        <div className="text-[10px] text-slate-700">{product.fiatPrice}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label={alreadySelected ? `Product ${product.title} already tagged` : `Tag ${product.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectProduct) {
                          onSelectProduct(product);
                        }
                        setIsOpenDropdown(false);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {alreadySelected ? 'Tagged' : '+ Tag'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
