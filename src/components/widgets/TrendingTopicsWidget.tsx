import React, { useState, useEffect } from 'react';
import { trendService, Trend } from '../../services/TrendService';
import { Gift } from 'lucide-react';
import SendFicModal from '../SendFicModal';

const TrendingTopicsWidget: React.FC = () => {
  const [topics, setTopics] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTipModal, setShowTipModal] = useState(false);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      const data = await trendService.getTrendingHashtags();
      if (data && Array.isArray(data) && data.length > 0) {
        setTopics(data.slice(0, 5));
      } else {
        setTopics([
          { id: '1', hashtag: '#Blockchain', category: 'Tech', posts: 12500, engagement: 0, growth: 0, period: '24h' },
          { id: '2', hashtag: '#Web3', category: 'Tech', posts: 8200, engagement: 0, growth: 0, period: '24h' },
          { id: '3', hashtag: '#FingerMobile', category: 'Platform', posts: 5100, engagement: 0, growth: 0, period: '24h' },
          { id: '4', hashtag: '#DeFi', category: 'Finance', posts: 3400, engagement: 0, growth: 0, period: '24h' },
          { id: '5', hashtag: '#NFTs', category: 'Art', posts: 2100, engagement: 0, growth: 0, period: '24h' },
        ]);
      }
    } catch (e) {
      console.error('Failed to fetch trends:', e);
      setTopics([
        { id: '1', hashtag: '#Blockchain', category: 'Tech', posts: 12500, engagement: 0, growth: 0, period: '24h' },
        { id: '2', hashtag: '#Web3', category: 'Tech', posts: 8200, engagement: 0, growth: 0, period: '24h' },
        { id: '3', hashtag: '#FingerMobile', category: 'Platform', posts: 5100, engagement: 0, growth: 0, period: '24h' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatPosts = (posts: number) => {
    if (posts > 1000) return (posts / 1000).toFixed(1) + 'K';
    return posts.toString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Trending Topics</h3>
      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>)}
          </div>
        ) : (
          topics.map((topic, index) => (
            <div key={index} className="flex justify-between items-center group">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-orange-500 transition-colors">
                {topic.hashtag}
              </span>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-700 dark:text-gray-400">
                  {formatPosts(topic.posts)} posts
                </span>
                <button
                  onClick={() => setShowTipModal(true)}
                  className="hidden group-hover:flex items-center gap-1 text-[10px] bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300 px-2 py-1 rounded transition-colors"
                  title="Boost Trend"
                >
                  <Gift className="w-3 h-3" /> Boost
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <button className="mt-4 w-full text-center text-sm text-orange-500 font-medium hover:underline">
        Show More
      </button>

      {showTipModal && (
        <SendFicModal
          onClose={() => setShowTipModal(false)}
          onSend={async (recipient, amount, message) => {
            console.log(`Sending ${amount} FIC to boost with message: ${message}`);
            return Promise.resolve();
          }}
        />
      )}
    </div>
  );
};

export default TrendingTopicsWidget;
