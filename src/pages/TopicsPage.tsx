import React, {} from 'react';
import * as ReactRouterDOM from "react-router-dom";
import PageHeader from '../components/PageHeader';
import { useAppContext } from "../contexts/AppContext";

interface TopicType {
  id: string;
  name: string;
  description?: string;
  isTrending: boolean;
  coverImageUrl: string;
  postsCount?: number;
  followers?: number;
  isFollowing?: boolean;
  icon?: string;
  [key: string]: unknown;
}

interface HashtagType {
  id: string;
  name: string;
  tag?: string;
  isTrending: boolean;
  category: string;
  frequency?: number;
  postCount?: number;
  [key: string]: unknown;
}

const TopicsPage: React.FC = () => {
  const { topics = [], hashtags = [] } = useAppContext();

  const TopicCard: React.FC<{ topic: TopicType }> = ({ topic }) => (
    <ReactRouterDOM.NavLink
      to={`/news-feed/${topic.id}`}
      className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow hover:border-brand-blue border-2 border-transparent group"
    >
      <h3 className="font-bold text-lg text-brand-blue group-hover:underline">
        {topic.name}
      </h3>
      <p className="text-sm text-gray-600 mt-2">{topic.description}</p>
    </ReactRouterDOM.NavLink>
  );

  const HashtagListItem: React.FC<{ hashtag: HashtagType }> = ({ hashtag }) => (
    <ReactRouterDOM.NavLink
      to={`/news-feed/${hashtag.tag?.replace("#", "") || ''}`}
      className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg"
    >
      <div>
        <p className="font-bold text-gray-800 flex items-center gap-2">
          {hashtag.tag || 'Unknown Tag'}
        </p>
        <p className="text-xs text-gray-500">
          {hashtag.postCount?.toLocaleString() || '0'} posts
        </p>
      </div>
    </ReactRouterDOM.NavLink>
  );

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-full">
      <PageHeader
        title="Topics & Hashtags"
        description="Explore trending and popular conversations across the platform."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Explore Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-2">Trending Hashtags</h2>
            <div className="divide-y divide-gray-100">
              {hashtags.map((tag) => (
                <HashtagListItem key={tag.tag} hashtag={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;
