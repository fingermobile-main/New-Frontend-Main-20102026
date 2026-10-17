import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useDancie4TvDiscovery } from '../hooks/useDancie4TvDiscovery';
import { useDancie4TvFeed } from '../hooks/useDancie4TvFeed';
import { useDancie4TvUpdates } from '../hooks/useDancie4TvUpdates';

interface DiscoveryItem {
  id: string | number;
  title: string;
  thumbnailUrl?: string;
  creatorName?: string;
  views?: number;
}

// eslint-disable-next-line no-unused-vars
interface FeedVideo {
  id: string | number;
  title: string;
  creatorName: string;
  thumbnailUrl?: string;
  uploadDate?: string;
}

// eslint-disable-next-line no-unused-vars
interface UpdateItem {
  id: string | number;
  message: string;
  timestamp: string | number | Date;
}

const Dancie4TvPage: React.FC = () => {
  const { member } = useAuth();

  const {
    feedVideos,
    loading: feedLoading,
    error: feedError,
  } = useDancie4TvFeed(member?.id);

  const {
    discoveryData,
    loading: discoveryLoading,
    error: discoveryError,
  } = useDancie4TvDiscovery();

  const {
    updates,
    loading: updatesLoading,
    error: updatesError,
  } = useDancie4TvUpdates();

  return (
    <MainLayout pageTitle="Dancie 4 Tv">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dancie 4 Tv</h1>
          <p className="text-gray-600">
            Watch the latest videos and discover new content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Discovery Column */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Discovery</h2>
            {discoveryLoading ? (
              <p className="text-slate-700">Loading discovery content...</p>
            ) : discoveryError ? (
              <p className="text-red-500">{discoveryError}</p>
            ) : (
              <div className="space-y-4">
                {((discoveryData?.personalized || []) as DiscoveryItem[]).map((item) => (
                  <div key={item.id} className="border-b pb-2">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    {item.creatorName && (
                      <p className="text-sm text-slate-700">By {item.creatorName}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feed Column */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Feed</h2>
            {feedLoading ? (
              <p className="text-slate-700">Loading your feed...</p>
            ) : feedError ? (
              <p className="text-red-500">{feedError}</p>
            ) : (
              <div className="space-y-4">
                {feedVideos.map((video) => (
                  <div key={video.id} className="border-b pb-2">
                    <h3 className="font-medium text-gray-800">{video.title}</h3>
                    <p className="text-sm text-slate-700">By {video.creatorName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Updates Column */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Updates</h2>
            {updatesLoading ? (
              <p className="text-slate-700">Loading updates...</p>
            ) : updatesError ? (
              <p className="text-red-500">{updatesError}</p>
            ) : (
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="border-b pb-2">
                    <h3 className="font-medium text-gray-800">{update.message}</h3>
                    <p className="text-sm text-slate-700">
                      {new Date(update.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dancie4TvPage;
