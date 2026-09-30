import { useNavigate} from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { useAppContext } from '../contexts/AppContext';


import { useAuth } from '../contexts/AuthContext';
import {
  MembersIcon,
  CalendarIcon,
  LocationMarkerIcon,
  AcademicCapIcon
} from '../icons';
import PageHeader from '../components/PageHeader';
import EnhancedFilterBar from '../components/shared/EnhancedFilterBar';

interface NyscEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description?: string;
  participants: number;
  organizer: string;
}

interface Discussion {
  id: string;
  title: string;
  author: string;
  timeAgo: string;
  content: string;
  replies: number;
  views: number;
}

const NyscPage: React.FC = () => {
  const { member } = useAuth();
  const navigate = useNavigate();
  const { nyscEvents, discussions, showToast } = useAppContext();

  const [events, setEvents] = useState<NyscEvent[]>([]);
  const [discussionsList, setDiscussionsList] = useState<Discussion[]>([]);
  const [stats, setStats] = useState<{ totalMembers: number; activeMembers: number; statesCount: number; batchesCount: number }>({
    totalMembers: 0,
    activeMembers: 0,
    statesCount: 0,
    batchesCount: 0
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchNyscData = async () => {
      try {
        const { nyscService } = await import('../services/nyscService');
        const [liveEvents, liveDiscussions, liveStats] = await Promise.all([
          nyscService.getEvents(),
          nyscService.getDiscussions(),
          nyscService.getStats()
        ]);

        if (liveEvents && liveEvents.length > 0) {
          setEvents(liveEvents.map((e: any) => ({
            id: String(e.id),
            title: e.title,
            date: e.date,
            location: e.location,
            description: e.description,
            participants: e.participants || e.participants_count || 0,
            organizer: e.organizer
          })));
        }

        if (liveDiscussions && liveDiscussions.length > 0) {
          setDiscussionsList(liveDiscussions.map((d: any) => ({
            id: String(d.id),
            title: d.title,
            author: d.author,
            timeAgo: d.timeAgo || d.time_ago || 'Recently',
            content: d.content,
            replies: d.replies || 0,
            views: d.views || 0
          })));
        }

        if (liveStats) {
          setStats(liveStats);
        }
      } catch (err) {
        console.error('Failed to load NYSC data:', err);
      }
    };

    fetchNyscData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHeader
        title="NYSC Connect"
        description="Connecting National Youth Service Corps members across Nigeria for collaboration, networking, and community building."
      />

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-4xl font-bold mb-4">NYSC Connect</h1>
        <p className="text-xl max-w-3xl">
          Connecting National Youth Service Corps members across Nigeria for
          collaboration, networking, and community building.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center mb-3">
            <MembersIcon className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Networking</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Connect with fellow corps members from different states and
            institutions.
          </p>
          <button
            onClick={() => navigate('/network')}
            className="text-blue-600 font-semibold hover:underline"
          >
            Explore Network
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center mb-3">
            <AcademicCapIcon className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Resources</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Access helpful resources and guides for NYSC service year.
          </p>
          <button
            onClick={() => navigate('/resources')}
            className="text-blue-600 font-semibold hover:underline"
          >
            View Resources
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center mb-3">
            <CalendarIcon className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Events</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Stay updated with NYSC events and community gatherings.
          </p>
          <button
            onClick={() => navigate('/events')}
            className="text-blue-600 font-semibold hover:underline"
          >
            Browse Events
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Upcoming Events
        </h2>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-gray-800">
                  {event.title}
                </h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {event.date}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <LocationMarkerIcon className="w-4 h-4 mr-1" />
                <span>{event.location}</span>
              </div>
              <p className="text-gray-600 mt-2">{event.description}</p>
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span>{event.participants} participants</span>
                  <span>by {event.organizer}</span>
                </div>
                <button className="text-blue-600 font-medium text-sm hover:underline">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Recent Discussions
        </h2>
        <EnhancedFilterBar
          filterOptions={{
            categories: [
              'all',
              'Orientation',
              'Primary Assignment',
              'Community Development',
              'Clearance'
            ],
            sortByOptions: [
              { value: 'recent', label: 'Most Recent' },
              { value: 'popular', label: 'Most Popular' },
              { value: 'replies', label: 'Most Replies' }
            ],
            searchPlaceholder: 'Search discussions...'
          }}
        />
        <div className="space-y-4 mt-4">
          {discussionsList.map((discussion) => (
            <div
              key={discussion.id}
              className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
            >
              <h3 className="font-semibold text-lg text-gray-800">
                {discussion.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Started by {discussion.author} • {discussion.timeAgo}
              </p>
              <p className="text-gray-500 mt-2">{discussion.content}</p>
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span>{discussion.replies} replies</span>
                  <span>{discussion.views} views</span>
                </div>
                <button
                  onClick={() => navigate(`/discussions/${discussion.id}`)}
                  className="text-blue-600 font-medium text-sm hover:underline"
                >
                  Join Discussion
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NyscPage;
