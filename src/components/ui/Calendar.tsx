import React, { useState } from 'react';
interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[];
  onSelect?: (date: Date | Date[] | undefined) => void;
  className?: string;
  captionLayout?: 'label' | 'dropdown-buttons';
  fromYear?: number;
  toYear?: number;
}

const Calendar: React.FC<CalendarProps> = ({
  selected,
  onSelect,
  className = '',
  fromYear = new Date().getFullYear() - 10,
  toYear = new Date().getFullYear() + 10
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(selected instanceof Date ? selected : new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get days in month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Generate days array
  const days: (Date | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Add actual days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const isSameDay = (d1: Date | null, d2: Date | null): boolean => {
    return d1 instanceof Date &&
           d2 instanceof Date &&
           d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const isSelected = (day: Date | null): boolean => {
    if (!day) return false;

    if (Array.isArray(selected)) {
      return selected.some(date => isSameDay(day, date));
    } else if (selected instanceof Date) {
      return isSameDay(day, selected);
    }

    return false;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: Date | null) => {
    if (!day) return;

    if (onSelect) {
      onSelect(day);
    }
  };

  return (
    <div className={`rounded-md border border-input bg-white p-3 ${className}`}>
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={handlePrevMonth}
          className="rounded p-1 hover:bg-gray-100"
          aria-label="Previous month"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="text-sm font-medium">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>

        <button
          onClick={handleNextMonth}
          className="rounded p-1 hover:bg-gray-100"
          aria-label="Next month"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-muted-foreground rounded text-center text-sm font-normal"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDayClick(day)} role="button" tabIndex={0}
            className={`h-8 w-8 rounded-full text-center text-sm p-0 flex items-center justify-center ${
              day
                ? isSelected(day)
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'hover:bg-gray-100'
                : ''
            }`}
          >
            {day?.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
};

export * from './Calendar';
