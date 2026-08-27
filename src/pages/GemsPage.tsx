import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';

import { useAppContext } from "../contexts/AppContext";
import { playAudio } from '../utils/audioPlayer';
import apiService, { ApiService } from '../services/apiService';
import { VoiceLine } from '../types';


import AdBanner from '../components/AdBanner';
import FixedAdBanner from '../components/FixedAdBanner';
import BurgerMenu from '../components/BurgerMenu';
import {
  GemIcon,
  SearchIcon,
  MicrophoneIcon,
  TvIcon,
  MusicalNoteIcon as MusicNoteIcon,
  ShoppingBagIcon,
  GiftIcon,
  LinkIcon,
  FilterIcon,
  SortIcon,
  HeartIcon,
  ShareIcon,
  SparklesIcon, 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon, 
  UserGroupIcon,
  ChevronDownIcon
} from '../icons';
import { useGems } from '../hooks/useGems';
import LoadingSpinner from '../components/LoadingSpinner';
import PostCard from '../components/PostCard';

interface Gem {
  id: number;
  title: string;
  author: string;
  price: string;
  image: string;
  tags: string[];
  likes: number;
  views: number;
  category: string;
  isLiked?: boolean;
  createdAt: string;
}

const GemsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-bold">Gems</h1>
      <p>This is the gems page.</p>
    </div>
  );
};

// Original complex version with all features
const GemsPageOriginal: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedGem, setSelectedGem] = useState<Gem | null>(null);
  const [giftAmount, setGiftAmount] = useState('');
  const [paylinkAmount, setPaylinkAmount] = useState('');
  const [convertAmount, setConvertAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { ficBalance, showToast } = useAppContext();
  const { gems, loading, error, refreshGems } = useGems();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [voiceLines, setVoiceLines] = useState<VoiceLine[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchVoiceLines = async () => {
      try {
        // Mock voice lines fetch - ApiService.voices not implemented
        setVoiceLines([]);
      } catch (error) {
        console.error("Failed to fetch voice lines:", error);
      }
    };

    fetchVoiceLines();
  
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">Error loading gems: {error}</p>
            <button 
              onClick={refreshGems}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter and sort gems
  const filteredGems = gems
    .filter(gem => {
      const matchesSearch = gem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           gem.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           gem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterBy === 'all' || gem.category === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'popular') return b.likes - a.likes;
      if (sortBy === 'priceHigh') return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
      if (sortBy === 'priceLow') return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
      return 0;
    });

  const categories = ['all', ...Array.from(new Set(gems.map(gem => gem.category)))];

  const handleLike = (gemId: number) => {
    // In a real app, this would call an API
    console.info('Liking gem:', gemId);
    showToast('Added to favorites!', 'success');
  };

  const handleShare = (gemId: number) => {
    // In a real app, this would share the gem
    console.info('Sharing gem:', gemId);
    showToast('Link copied to clipboard!', 'success');
  };

  const openGiftModal = (gem: Gem) => {
    setSelectedGem(gem);
    setShowGiftModal(true);
  };

  const openPaylinkModal = (gem: Gem) => {
    setSelectedGem(gem);
    setShowPaylinkModal(true);
  };

  const openConvertModal = () => {
    setShowConvertModal(true);
  };

  const handleSendGift = () => {
    if (!selectedGem) return;
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowGiftModal(false);
      setGiftAmount('');
      showToast(`Gift sent to ${selectedGem.author}!`, 'success');
    }, 1500);
  };

  const handleCreatePaylink = () => {
    if (!selectedGem) return;
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaylinkModal(false);
      setPaylinkAmount('');
      showToast(`Paylink created for ${selectedGem.title}!`, 'success');
    }, 1500);
  };

  const handleConvertGems = () => {
    if (!convertAmount || parseFloat(convertAmount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowConvertModal(false);
      setConvertAmount('');
      showToast(`Converted ${convertAmount} Gems to FIC!`, 'success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Gems Marketplace</h1>
            </div>
            <button
              onClick={() => {
                if (voiceLines.length > 0) {
                  const randomIndex = Math.floor(Math.random() * voiceLines.length);
                  playAudio(voiceLines[randomIndex].audioUrl);
                } else {
                  showToast("No voice lines available.", "info");
                }
              }}
              className="ml-4 px-3 py-1 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-md hover:from-green-600 hover:to-teal-600"
            >
              Play Voice
            </button>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <span className="text-blue-100">Balance:</span>
                <span className="ml-2 font-bold text-yellow-300">{ficBalance} FIC</span>
              </div>
              <BurgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center">
            <SparklesIcon className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold ml-2 text-gray-900">Premium Content Marketplace</h1>
          </div>
          <p className="text-gray-600 mt-2">Discover exclusive digital content from creators around the world</p>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search gems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-200"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="bg-gray-50 text-gray-900 px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none border border-gray-200 pr-8"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 text-gray-900 px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none border border-gray-200 pr-8"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="priceLow">Price: Low to High</option>
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <SparklesIcon className="h-6 w-6 text-purple-500 mr-2" />
              <h3 className="text-gray-600 text-sm">Total Gems</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{gems.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <UserGroupIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="text-gray-600 text-sm">Creators</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Array.from(new Set(gems.map(gem => gem.author))).length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-gray-600 text-sm">Categories</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <h3 className="text-gray-600 text-sm">Avg. Price</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${(gems.reduce((sum, gem) => sum + parseFloat(gem.price.replace('$', '')), 0) / gems.length).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Gems grid/list */}
        {filteredGems.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }>
            {filteredGems.map((gem) => (
              <div 
                key={gem.id} 
                className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-transform hover:shadow-md ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={viewMode === 'list' ? 'w-1/3' : ''}>
                  <div className="relative">
                    <img 
                      src={gem.image} 
                      alt={gem.title} 
                      className={`w-full object-cover ${viewMode === 'list' ? 'h-full' : 'h-48'}`} 
                     />
                    <div className="absolute top-2 right-2 bg-black/30 rounded-full p-1">
                      <HeartIcon 
                        className={`w-5 h-5 cursor-pointer ${gem.isLiked ? 'text-red-500 fill-current' : 'text-white'}`} 
                        onClick={() => handleLike(gem.id)}
                      />
                    </div>
                  </div>
                </div>
                <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{gem.title}</h3>
                      <p className="text-gray-500 text-sm">by {gem.author}</p>
                    </div>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-bold">
                      {gem.price} FIC
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <HeartIcon className="w-4 h-4 mr-1" /> {gem.likes}
                    </span>
                    <span className="flex items-center">
                      <TvIcon className="w-4 h-4 mr-1" /> {gem.views}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {gem.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => openGiftModal(gem)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center"
                    >
                      <GiftIcon className="w-4 h-4 mr-2" /> Gift
                    </button>
                    <button 
                      onClick={() => openPaylinkModal(gem)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-bold flex items-center justify-center"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" /> Paylink
                    </button>
                    <button 
                      onClick={() => handleShare(gem.id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-lg"
                    >
                      <ShareIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No gems found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Gift Modal */}
      {showGiftModal && selectedGem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Send a Gift</h3>
              <button 
                onClick={() => setShowGiftModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                <img 
                  src={selectedGem.image} 
                  alt={selectedGem.title} 
                  className="w-16 h-16 rounded-lg object-cover mr-4"
                 />
                <div>
                  <h4 className="font-bold text-gray-900">{selectedGem.title}</h4>
                  <p className="text-gray-500 text-sm">by {selectedGem.author}</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Gift Amount (FIC)</label>
                <input
                  type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-200"
                  placeholder="Enter amount"
                />
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-600">Your Balance:</span>
                <span className="text-purple-600 font-bold">{ficBalance} FIC</span>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button 
                onClick={() => setShowGiftModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendGift}
                disabled={isProcessing || !giftAmount || parseFloat(giftAmount) <= 0 || parseFloat(giftAmount) > ficBalance}
                className={`px-4 py-2 rounded-lg font-bold ${
                  isProcessing || !giftAmount || parseFloat(giftAmount) <= 0 || parseFloat(giftAmount) > ficBalance
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                }`}
              >
                {isProcessing ? 'Sending...' : 'Send Gift'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paylink Modal */}
      {showPaylinkModal && selectedGem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Create Paylink</h3>
              <button 
                onClick={() => setShowPaylinkModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                <img 
                  src={selectedGem.image} 
                  alt={selectedGem.title} 
                  className="w-16 h-16 rounded-lg object-cover mr-4"
                 />
                <div>
                  <h4 className="font-bold text-gray-900">{selectedGem.title}</h4>
                  <p className="text-gray-500 text-sm">by {selectedGem.author}</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Paylink Amount (FIC)</label>
                <input
                  type="number"
                  value={paylinkAmount}
                  onChange={(e) => setPaylinkAmount(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-200"
                  placeholder="Enter amount"
                />
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Base price: <span className="text-purple-600">{selectedGem.price} FIC</span>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button 
                onClick={() => setShowPaylinkModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreatePaylink}
                disabled={isProcessing || !paylinkAmount || parseFloat(paylinkAmount) <= 0}
                className={`px-4 py-2 rounded-lg font-bold ${
                  isProcessing || !paylinkAmount || parseFloat(paylinkAmount) <= 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                }`}
              >
                {isProcessing ? 'Creating...' : 'Create Paylink'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert Gems Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Convert Gems to FIC</h3>
              <button 
                onClick={() => setShowConvertModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Convert Amount (Gems)</label>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-200"
                  placeholder="Enter amount"
                />
              </div>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Exchange Rate:</span>
                  <span className="text-gray-900 font-bold">1 Gem = 0.1 FIC</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Estimated Receive:</span>
                  <span className="text-green-600 font-bold">{convertAmount ? (parseFloat(convertAmount) * 0.1).toFixed(2) : '0.00'} FIC</span>
                </div>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-600">Your Gems Balance:</span>
                <span className="text-purple-600 font-bold">1250 Gems</span>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button 
                onClick={() => setShowConvertModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={handleConvertGems}
                disabled={isProcessing || !convertAmount || parseFloat(convertAmount) <= 0}
                className={`px-4 py-2 rounded-lg font-bold ${
                  isProcessing || !convertAmount || parseFloat(convertAmount) <= 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white'
                }`}
              >
                {isProcessing ? 'Converting...' : 'Convert Gems'}
              </button>
            </div>
          </div>
        </div>
      )}

      <FixedAdBanner />
    </div>
  );
};
export default GemsPage;