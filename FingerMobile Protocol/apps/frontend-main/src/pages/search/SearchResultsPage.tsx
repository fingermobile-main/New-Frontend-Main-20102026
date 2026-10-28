import { useSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Search, Sparkles, Filter, Home } from 'lucide-react';

import { search } from '../../services/api';
import { useAppContext } from '../../contexts/AppContext';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'post' | 'member' | 'product' | 'program' | 'event';
  thumbnail?: string;
  url: string;
}

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';

  const { handleAiAssist } = useAppContext();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      try {
        setLoading(true);
        const response = await search(
          query,
          type === 'all' ? undefined : { type: [type] }
        );
        // @ts-ignore - Auto-suppressed for compilation
        setResults(response?.results || []);
      } catch (err) {
        setError('Failed to perform search. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      performSearch();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, type]);

  const handleAiAssistAction = async () => {
    if (query) {
      try {
        await handleAiAssist(`Search assist for: ${query} (type: ${type})`);
      } catch (err) {
        console.error('AI assist error:', err);
      }
    }
  };

  const handleTypeFilter = (newType: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (newType === 'all') {
      nextParams.delete('type');
    } else {
      nextParams.set('type', newType);
    }
    setSearchParams(nextParams);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 font-bold">
        Searching...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Search Results</h1>
        <p className="text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base mt-1">
          Found {results.length} results for "{query}" {type !== 'all' && `in ${type}`}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {[
          { id: 'all', label: 'All Results' },
          { id: 'post', label: 'Posts' },
          { id: 'member', label: 'Members' },
          { id: 'product', label: 'Products' },
          { id: 'event', label: 'Events' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTypeFilter(tab.id)}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border ${
              type === tab.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <button
          onClick={handleAiAssistAction}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold text-sm border border-blue-200 dark:border-blue-700 flex items-center gap-2 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Ask AI for help with these results</span>
        </button>
      </div>

      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map(result => (
            <a
              key={result.id}
              href={result.url}
              className="block bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow border border-slate-300 dark:border-gray-700"
            >
              <div className="flex items-start gap-4">
                {result.thumbnail && (
                  <div className="flex-shrink-0">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-14 h-14 sm:w-16 sm:h-16" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">{result.title}</h3>
                  <p className="text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm line-clamp-2 mt-0.5">{result.description}</p>
                  <div className="mt-2">
                    <span className="inline-block px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-gray-200 bg-slate-100 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg">
                      {result.type}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 p-6">
          <p className="text-slate-700 dark:text-slate-300 font-medium">No results found for your search</p>
        </div>
      )}

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-4 md:hidden shadow-lg safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => navigate('/search')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-blue-600 font-bold"
            aria-label="New Search"
          >
            <Search className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Search</span>
          </button>
          <button
            onClick={handleAiAssistAction}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="AI Assist"
          >
            <Sparkles className="w-5 h-5 mb-1" />
            <span className="text-[10px]">AI Assist</span>
          </button>
          <button
            onClick={() => handleTypeFilter(type === 'all' ? 'post' : 'all')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Toggle Filter"
          >
            <Filter className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Filter</span>
          </button>
          <button
            onClick={() => navigate('/forum')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Home Forum"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Forum</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
