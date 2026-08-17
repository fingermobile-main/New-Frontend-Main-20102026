import React, { useState, useEffect } from 'react';
import { CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';

interface EnhancedEventsProps {
  userId?: string;
}

const EnhancedEvents: React.FC<EnhancedEventsProps> = ({ userId }) => {
  const [events, setEvents] = React.useState<any[]>([]);
  const [activeTab, setActiveTab] = React.useState<'upcoming' | 'past' | 'my'>('upcoming');

  React.useEffect(() => {
    setEvents([
      { id: '1', title: 'Tech Conference 2026', date: '2026-07-15', attendees: 250, type: 'conference', location: 'Virtual' },
      { id: '2', title: 'Community Meetup', date: '2026-06-25', attendees: 85, type: 'meetup', location: 'Lagos, Nigeria' },
      { id: '3', title: 'Workshop: React Advanced', date: '2026-07-01', attendees: 45, type: 'workshop', location: 'Virtual' },
      { id: '4', title: 'Hackathon Challenge', date: '2026-08-10', attendees: 120, type: 'hackathon', location: 'Abuja, Nigeria' }
    ]);
  }, [userId]);

  const filteredEvents = events.filter(event => {
    if (activeTab === 'past') return new Date(event.date) < new Date();
    if (activeTab === 'my') return true; // Mock: user's events
    return new Date(event.date) >= new Date();
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Events</h3>
        <div className="flex space-x-2">
          {(['upcoming', 'past', 'my'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredEvents.map((event) => (
          <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <UsersIcon className="w-4 h-4" />
                    {event.attendees} attending
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{event.location}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                {event.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No events found</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedEvents;
