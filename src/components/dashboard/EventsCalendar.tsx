import React, { useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface EventsCalendarProps {}

const EventsCalendar: React.FC<EventsCalendarProps> = () => {
  const [currentMonth] = React.useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">{currentMonth}</h3>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-medium text-gray-500 py-2">{day}</div>
        ))}
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} className={`py-2 rounded ${i === 15 ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}>
            {(i % 31) + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsCalendar;
