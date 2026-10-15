import React, { useState, useContext } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { PostContext } from '../../../contexts/PostContext';
import { useAuth } from '../../../contexts/AuthContext';
import { ChevronLeftIcon, ChevronRightIcon } from '../../../components/icons';
import type { Post } from '../../../types';

const ContentCalendarPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { openModal } = useAppContext();
  const postContext = useContext(PostContext);
  const posts = postContext?.posts || [];
  const { member } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());

  const memberPosts = member
    ? posts.filter((p: Post) => p.author.id === member.id)
    : [];

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
    <div>
      <h1 className="text-2xl font-bold mb-6 sm:text-3xl lg:text-4xl">
        Content Calendar
      </h1>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold sm:text-2xl">
            {currentDate.toLocaleString('default', {
              month: 'long',
              year: 'numeric'
            })}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-500 mb-2 sm:text-base">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            if (!date)
              return (
                <div
                  key={`empty-${index}`}
                  className="border rounded-lg h-32 bg-gray-50"
                ></div>
              );

            const filteredPosts = memberPosts.filter(
              (p: any) =>
                new Date(p.timestamp).toDateString() === date.toDateString(),
            );
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <div
                key={date.toISOString()}
                className="border rounded-lg h-32 p-1.5 flex flex-col"
              >
                <span
                  className={`font-semibold text-xs self-start ${isToday ? 'bg-brand-blue text-white rounded-full w-5 h-5 flex items-center justify-center' : ''} sm:text-sm`}
                >
                  {date.getDate()}
                </span>
                <div className="mt-1 flex-1 overflow-y-auto text-left space-y-1">
                  {filteredPosts.map((post: any) => (
                    <div
                      key={post.id}
                      className="text-xs bg-blue-100 text-blue-950 border border-blue-400 font-bold p-1 rounded cursor-pointer hover:bg-blue-200 sm:text-sm"
                    >
                      <p className="truncate font-medium">
                        {post.title || post.content?.replace(/<[^>]*>?/gm, '').substring(0, 30) + '...'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={() => openModal('composer')}
            className="px-4 py-2 text-sm font-semibold bg-brand-blue text-white rounded-full hover:bg-blue-700 sm:text-base"
          >
            Schedule a Post
          </button>
        </div>
      </div>
    </div>
  ); // Added missing closing brace for return statement
}; // Added missing closing brace for component function

export default ContentCalendarPage;
