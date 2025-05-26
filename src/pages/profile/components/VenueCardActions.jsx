import React from 'react';

const VenueCardActions = ({ venue, onViewCalendar = null }) => {
  const handleCalendarClick = (e) => {
    e.stopPropagation(); // Prevent card click
    if (onViewCalendar) {
      onViewCalendar(venue);
    }
  };

  if (!onViewCalendar) return null;

  return (
    <div className="mt-3">
      <button
        onClick={handleCalendarClick}
        className="w-full bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>View Calendar</span>
      </button>
    </div>
  );
};

export default VenueCardActions; 