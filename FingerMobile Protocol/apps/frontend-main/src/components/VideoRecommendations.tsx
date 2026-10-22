import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

interface VideoRecommendationsProps {
  userId?: string;
  limit?: number;
}

const VideoRecommendations: React.FC<VideoRecommendationsProps> = ({ userId, limit = 5 }) => {
  const [videos, setVideos] = React.useState<any[]>([]);

  React.useEffect(() => {
    setVideos([
      { id: '1', title: 'Getting Started with React', creator: 'CodeMaster', views: '12K', duration: '15:30' },
      { id: '2', title: 'Advanced TypeScript Patterns', creator: 'TypeGuru', views: '8.5K', duration: '22:45' },
      { id: '3', title: 'Building Scalable APIs', creator: 'BackendPro', views: '15K', duration: '18:20' },
      { id: '4', title: 'UI/UX Design Principles', creator: 'DesignWizard', views: '20K', duration: '12:15' },
      { id: '5', title: 'DevOps Best Practices', creator: 'CloudExpert', views: '9.2K', duration: '25:00' }
    ]);
  }, [userId]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300">
      <div className="p-6 border-b border-slate-300">
        <h3 className="text-lg font-bold text-gray-900">Recommended Videos</h3>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {videos.slice(0, limit).map((video) => (
          <Link
            key={video.id}
            to={`/dancia4tv?video=${video.id}`}
            aria-label={`Watch ${video.title} by ${video.creator}`}
            className="block p-4 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-24 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:opacity-90 transition-opacity">
                <PlayIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h4>
                <p className="text-xs text-slate-700 mt-1">{video.creator}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-700">
                  <span>{video.views} views</span>
                  <span>•</span>
                  <span>{video.duration}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoRecommendations;
