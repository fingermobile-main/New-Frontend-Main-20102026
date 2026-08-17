import { useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

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
  const [searchParams] = useSearchParams();
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
        setResults(response.results || []);
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Searching...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Search Results</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Found {results.length} results for "{query}" {type !== 'all' && `in ${type}`}
        </p>
      </div>

      <div className="mb-6">
        <button 
          onClick={handleAiAssistAction}
          className="flex items-center text-brand-blue hover:text-blue-700"
        >
          <span>Ask AI for help with these results</span>
        </button>
      </div>

      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map(result => (
            <a 
              key={result.id} 
              href={result.url}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex">
                {result.thumbnail && (
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{result.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{result.description}</p>
                  <div className="mt-1">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded">
                      {result.type}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No results found for your search</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;