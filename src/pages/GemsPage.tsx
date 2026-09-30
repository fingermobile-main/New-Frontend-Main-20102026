import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { SearchIcon, StarIcon, HeartIcon } from '../components/icons';
import gemsService, { GemItem } from '../services/gemsService';

const GemsPage: React.FC = () => {
  const { showToast, handleGlobalAction } = useAppContext();
  const [allGems, setAllGems] = useState<GemItem[]>([]);  // Renamed from 'gems' to 'allGems' to avoid conflict
  const [userBalance, setUserBalance] = useState<number>(0);
  const [loadingState, setLoadingState] = useState(true); // Renamed from 'loading' to 'loadingState' to avoid conflict
  const [errorState, setErrorState] = useState<string | null>(null); // Renamed from 'error' to 'errorState' to avoid conflict
  const [searchTermState, setSearchTermState] = useState(''); // Renamed from 'searchTerm' to 'searchTermState' to avoid conflict
  const [sortByState, setSortByState] = useState<'price' | 'rating' | 'newest'>('rating'); // Renamed from 'sortBy' to 'sortByState' to avoid conflict

  // Infinite scroll state
  const [hasMoreState, setHasMoreState] = useState(true); // Renamed from 'hasMore' to 'hasMoreState' to avoid conflict
  const [pageState, setPageState] = useState(1); // Renamed from 'page' to 'pageState' to avoid conflict
  const [itemsState, setItemsState] = useState<GemItem[]>([]); // Renamed from 'items' to 'itemsState' to avoid conflict
  const [isLoadingMoreState, setIsLoadingMoreState] = useState(false); // Renamed from 'isLoadingMore' to 'isLoadingMoreState' to avoid conflict
  const observer = useRef<IntersectionObserver | null>(null);
  const gemsPerPage = 6;

  useEffect(() => {
    gemsService.getGemBalance().then(res => {
      if (res.success) {
        setUserBalance(res.balance);
      }
    }).catch(err => console.warn('Could not fetch gem balance:', err));
  }, []);

  const lastGemElementRef = useCallback((node: Element | null) => {
    if (node) {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMoreState) {
          loadMoreItems();
        }
      });
      observer.current.observe(node);
    }
  }, [hasMoreState]);

  // Filter and sort gems
  const filteredGems = useMemo(() => {
    return allGems
      .filter(gem =>
        gem.title.toLowerCase().includes(searchTermState.toLowerCase()) ||
        gem.category.toLowerCase().includes(searchTermState.toLowerCase())
      )
      .sort((a, b) => {
        if (sortByState === 'price') return a.price - b.price;
        if (sortByState === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [allGems, searchTermState, sortByState]);

  useEffect(() => {
    const fetchGems = async () => {
      try {
        setLoadingState(true);
        const res = await gemsService.getGems();
        if (res && res.data) {
          setAllGems(res.data);
        }
      } catch (err) {
        setErrorState('Failed to load gems');
      } finally {
        setLoadingState(false);
      }
    };
    fetchGems();
  }, []);

  // Initialize items with existing gems
  useEffect(() => {
    setItemsState(filteredGems.slice(0, gemsPerPage));
    setPageState(1);
    setHasMoreState(filteredGems.length > gemsPerPage);
  }, [filteredGems]);

  // Load more items for infinite scroll
  const loadMoreItems = useCallback(() => {
    setIsLoadingMoreState(true);

    // Simulate API call
    setTimeout(() => {
      const nextIndex = pageState * gemsPerPage;
      const nextItems = filteredGems.slice(nextIndex, nextIndex + gemsPerPage);

      if (nextItems.length > 0) {
        setItemsState(prev => [...prev, ...nextItems]);
        setPageState(prev => prev + 1);
      } else {
        setHasMoreState(false);
      }

      setIsLoadingMoreState(false);
    }, 1000);
  }, [filteredGems, pageState]);

  // Handle infinite scrolling logic
  useEffect(() => {
    setItemsState(filteredGems.slice(0, gemsPerPage));
    setPageState(1);
    setHasMoreState(filteredGems.length > gemsPerPage);
  }, [filteredGems]);

  // Set up infinite scroll observer
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoadingMoreState || !hasMoreState) {
        return;
      }
      loadMoreItems();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreItems, isLoadingMoreState, hasMoreState]);


  if (loadingState) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gems</h1>
          <p className="text-gray-600">Discover premium content and exclusive offerings</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 border border-purple-200 text-purple-900 font-semibold rounded-full shadow-sm text-sm">
            <span>💎 Gem Balance:</span>
            <span className="text-purple-700 font-bold">{userBalance.toLocaleString()}</span>
          </div>
        </div>

        {errorState && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center" role="alert">
            {errorState}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search gems..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={searchTermState}
                onChange={(e) => setSearchTermState(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={sortByState}
              onChange={(e) => setSortByState(e.target.value as 'price' | 'rating' | 'newest')}
            >
              <option value="rating">Highest Rated</option>
              <option value="price">Price: Low to High</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Gems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemsState.map((gem, index) => {
            if (index === itemsState.length - 1) {
              return (
                <div
                  key={gem.id}
                  ref={lastGemElementRef}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <div className="bg-gray-200 border-2 border-dashed w-full h-48" />
                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <StarIcon className="h-3 w-3 mr-1" />
                      {gem.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{gem.title}</h3>
                      <span className="text-lg font-bold text-purple-600">${gem.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">by {gem.creator}</p>
                    <p className="text-gray-600 text-sm mt-3">{gem.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (handleGlobalAction) handleGlobalAction('like', gem.id);
                        }}
                        className="flex items-center text-gray-500 text-sm hover:text-red-500 transition-colors"
                      >
                        <HeartIcon className="h-4 w-4 mr-1" />
                        {gem.likes} likes
                      </button>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        {gem.category}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (handleGlobalAction) handleGlobalAction('save', gem.id);
                        showToast(`Added ${gem.title} to cart`, 'success');
                      }}
                      className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={gem.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <div className="bg-gray-200 border-2 border-dashed w-full h-48" />
                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <StarIcon className="h-3 w-3 mr-1" />
                      {gem.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{gem.title}</h3>
                      <span className="text-lg font-bold text-purple-600">${gem.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">by {gem.creator}</p>
                    <p className="text-gray-600 text-sm mt-3">{gem.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (handleGlobalAction) handleGlobalAction('like', gem.id);
                        }}
                        className="flex items-center text-gray-500 text-sm hover:text-red-500 transition-colors"
                      >
                        <HeartIcon className="h-4 w-4 mr-1" />
                        {gem.likes} likes
                      </button>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        {gem.category}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (handleGlobalAction) handleGlobalAction('save', gem.id);
                        showToast(`Added ${gem.title} to cart`, 'success');
                      }}
                      className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>

        {!hasMoreState && itemsState.length > 0 && (
          <div className="text-center mt-8 text-gray-500">
            You've reached the end of the gems list.
          </div>
        )}

        {itemsState.length === 0 && !loadingState && (
          <div className="text-center py-12">
            <p className="text-gray-500">No gems found matching your criteria.</p>
          </div>
        )}

        {/* Loading indicator for infinite scroll */}
        {isLoadingMoreState && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default GemsPage;
