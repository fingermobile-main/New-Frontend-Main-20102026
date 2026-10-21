import React, { useState, useContext } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { PostContext } from '../../../contexts/PostContext';
import { useAuth } from '../../../contexts/AuthContext';
import { ChevronLeftIcon, ChevronRightIcon } from '../../../components/icons';
import type { Post } from '../../../types';
import { PlatformOwnershipCard } from '../../../components/ownership/PlatformOwnershipCard';

const FALLBACK_CALENDAR_POSTS = [
  {
    id: 'cal-post-1',
    title: 'Weekly Ecosystem Yield Distribution Report',
    content: 'Full breakdown of FIC protocol rewards and validator node yields across all tiers.',
    timestamp: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    author: { id: 'auth-1', username: 'FingerMobile Protocol' }
  },
  {
    id: 'cal-post-2',
    title: 'AMA: Next-Gen Quantum Biometric NFC Standards',
    content: 'Live developer briefing and security review with the core architecture team.',
    timestamp: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    author: { id: 'auth-1', username: 'FingerMobile Protocol' }
  },
  {
    id: 'cal-post-3',
    title: 'Creator Monetization & Storefront Launch Event',
    content: 'Keynote detailing instant fiat and FIC off-ramp integrations for global sellers.',
    timestamp: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    author: { id: 'auth-1', username: 'FingerMobile Protocol' }
  }
];

const ContentCalendarPage: React.FC = () => {
  const { showToast, openModal } = useAppContext();
  const postContext = useContext(PostContext);
  const posts = postContext?.posts || [];
  const { member } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());

  const userPosts = member
    ? posts.filter((p: Post) => p.author.id === member.id)
    : [];
  const calendarPosts: any[] = userPosts.length > 0 ? userPosts : (FALLBACK_CALENDAR_POSTS as any[]);

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  const daysInMonth = endOfMonth.getDate();
  const startDay = startOfMonth.getDay();

  const days = Array.from(
    { length: daysInMonth },
    (_, i) =>
      new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1),
  );
  const emptyDays = Array.from({ length: startDay }, () => null);
  const calendarDays = [...emptyDays, ...days];

  const changeMonth = (offset: number) => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1),
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Content Calendar</h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">Schedule and synchronize cross-platform publications, AMAs, and transmissions</p>
        </div>
        <button
          onClick={() => openModal('composer')}
          className="px-5 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm transition-colors"
        >
          + Schedule a Post
        </button>
      </div>

      <PlatformOwnershipCard className="mb-6" />

      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black text-slate-900">
            {currentDate.toLocaleString('default', {
              month: 'long',
              year: 'numeric'
            })}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            if (!date)
              return (
                <div
                  key={`empty-${index}`}
                  className="border border-slate-200 rounded-xl h-32 bg-slate-50"
                ></div>
              );

            const filteredPosts = calendarPosts.filter(
              (p: any) =>
                new Date(p.timestamp).toDateString() === date.toDateString(),
            );
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <div
                key={date.toISOString()}
                className={`border rounded-xl h-32 p-2 flex flex-col transition-colors ${
                  isToday ? 'border-blue-500 bg-blue-50/30' : 'border-slate-300 bg-white hover:border-blue-400'
                }`}
              >
                <span
                  className={`text-xs font-bold self-start ${
                    isToday
                      ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-black'
                      : 'text-slate-800'
                  }`}
                >
                  {date.getDate()}
                </span>
                <div className="mt-1 flex-1 overflow-y-auto text-left space-y-1">
                  {filteredPosts.map((post: any) => (
                    <div
                      key={post.id}
                      onClick={() => showToast(`Opening post: ${post.title || 'Scheduled item'}`, 'info')}
                      className="text-xs bg-blue-100 text-blue-950 border border-blue-400 font-bold p-1.5 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors"
                    >
                      <p className="truncate font-semibold text-[11px]">
                        {post.title || post.content?.replace(/<[^>]*>?/gm, '').substring(0, 30) + '...'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ); // Added missing closing brace for return statement
}; // Added missing closing brace for component function

export default ContentCalendarPage;
