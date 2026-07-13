import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useDancie4TvDiscovery } from '../hooks/useDancie4TvDiscovery';
import { useDancie4TvFeed } from '../hooks/useDancie4TvFeed';
import { useDancie4TvUpdates } from '../hooks/useDancie4TvUpdates';
import { useAuth } from '../contexts/AuthContext';

const Dancie4TvPage: React.FC = () => {
  const { member } = useAuth();
  const {
    discoveryData,
    loading: discoveryLoading,
    error: discoveryError
  } = useDancie4TvDiscovery();
  const {
    feedVideos,
    loading: feedLoading,
    error: feedError
  } = useDancie4TvFeed(member?.id);
  const {
    updates,
    loading: updatesLoading,
    error: updatesError
  } = useDancie4TvUpdates();

  return (
    <MainLayout pageTitle="Dancie 4 Tv">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dancie 4 Tv</h1>
          <p className="text-gray-600">
            Watch the latest videos and discovery new content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Discovery Column */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Discovery</h2>
            {discoveryLoading ? (
              <p>Loading discovery content...</p>
            ) : discoveryError ? (
              <p className="text-red-500">{discoveryError}</p>
            ) : (
              <div className="space-y-4">
                {(discoveryData as unknown as any[])?.map((item: any) => (
                  <div key={item.id} className="border-b pb-2">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feed Column */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Feed</h2>
            {feedLoading ? (
              <p>Loading your feed...</p>
            ) : feedError ? (
              <p className="text-red-500">{feedError}</p>
            ) : (
              <div className="space-y-4">
                {feedVideos?.map((video: any) => (
                  <div key={video.id} className="border-b pb-2">
                    <h3 className="font-medium">{video.title}</h3>
                    <p className="text-sm text-gray-500">By {video.creator}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Updates Column */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Updates</h2>
            {updatesLoading ? (
              <p>Loading updates...</p>
            ) : updatesError ? (
              <p className="text-red-500">{updatesError}</p>
            ) : (
              <div className="space-y-4">
                {updates?.map((update: any) => (
                  <div key={update.id} className="border-b pb-2">
                    <h3 className="font-medium">{update.title}</h3>
                    <p className="text-sm text-gray-500">
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
