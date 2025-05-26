import React, { useState, useEffect } from 'react';

export default function BookingCalendar({ 
  bookedDates = [], 
  onDateChange, 
  checkIn, 
  checkOut,
  minDate = new Date() 
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState({
    checkIn: checkIn ? new Date(checkIn) : null,
    checkOut: checkOut ? new Date(checkOut) : null
  });
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false);

  // Update selected dates when props change
  useEffect(() => {
    setSelectedDates({
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null
    });
  }, [checkIn, checkOut]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateUnavailable = (date) => {
    if (!date) return false;
    
    return bookedDates.some(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  const isDateInRange = (date) => {
    if (!date || !selectedDates.checkIn || !selectedDates.checkOut) return false;
    return date > selectedDates.checkIn && date < selectedDates.checkOut;
  };

  const isDateSelected = (date) => {
    if (!date) return false;
    return (selectedDates.checkIn && date.getTime() === selectedDates.checkIn.getTime()) ||
           (selectedDates.checkOut && date.getTime() === selectedDates.checkOut.getTime());
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    return date < minDate || isDateUnavailable(date);
  };

  const handleDateClick = (date) => {
    if (isDateDisabled(date)) return;

    if (!isSelectingCheckOut && !selectedDates.checkIn) {
      // First selection - set check-in
      const newCheckIn = date;
      setSelectedDates({ checkIn: newCheckIn, checkOut: null });
      setIsSelectingCheckOut(true);
      if (onDateChange) {
      onDateChange({
        checkIn: newCheckIn.toISOString().split('T')[0],
        checkOut: ''
      });
      }
    } else if (isSelectingCheckOut) {
      // Second selection - set check-out
      if (date <= selectedDates.checkIn) {
        // If selected date is before or same as check-in, reset and set as new check-in
        setSelectedDates({ checkIn: date, checkOut: null });
        if (onDateChange) {
        onDateChange({
          checkIn: date.toISOString().split('T')[0],
          checkOut: ''
        });
        }
      } else {
        // Valid check-out date
        const newCheckOut = date;
        setSelectedDates({ ...selectedDates, checkOut: newCheckOut });
        setIsSelectingCheckOut(false);
        if (onDateChange) {
        onDateChange({
          checkIn: selectedDates.checkIn.toISOString().split('T')[0],
          checkOut: newCheckOut.toISOString().split('T')[0]
        });
        }
      }
    } else {
      // Reset selection
      setSelectedDates({ checkIn: date, checkOut: null });
      setIsSelectingCheckOut(true);
      if (onDateChange) {
      onDateChange({
        checkIn: date.toISOString().split('T')[0],
        checkOut: ''
      });
      }
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const days = getDaysInMonth(currentMonth);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold">{formatMonthYear(currentMonth)}</h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-2"></div>;
          }

          const isDisabled = isDateDisabled(date);
          const isSelected = isDateSelected(date);
          const isInRange = isDateInRange(date);
          const isUnavailable = isDateUnavailable(date);

          let cellClass = "p-2 text-center text-sm cursor-pointer rounded transition-colors ";
          
          if (isDisabled) {
            cellClass += "text-gray-300 cursor-not-allowed ";
            if (isUnavailable) {
              cellClass += "bg-red-100 text-red-400 line-through ";
            }
          } else if (isSelected) {
            cellClass += "bg-blue-500 text-white font-semibold ";
          } else if (isInRange) {
            cellClass += "bg-blue-100 text-blue-800 ";
          } else {
            cellClass += "hover:bg-gray-100 ";
          }

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={cellClass}
              title={isUnavailable ? 'This date is unavailable' : ''}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>In range</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-100 rounded"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>

      {selectedDates.checkIn && !selectedDates.checkOut && (
        <div className="mt-3 text-sm text-blue-600 text-center">
          Now select your check-out date
        </div>
      )}

      {selectedDates.checkIn && selectedDates.checkOut && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Checkout: 11:00 AM</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Cancel: 48h notice</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 