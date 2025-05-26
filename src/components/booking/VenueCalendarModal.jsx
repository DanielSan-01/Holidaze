import React from 'react';
import BookingCalendar from './BookingCalendar.jsx';

const VenueCalendarModal = ({ 
  isOpen, 
  onClose, 
  venue, 
  bookings = [] 
}) => {
  if (!isOpen || !venue) return null;

  // Handle clicking outside the modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Dummy function for calendar - venue managers don't select dates
  const handleDateChange = () => {
    // No-op for venue manager view
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {venue.media?.[0]?.url && (
                <img 
                  src={venue.media[0].url} 
                  alt={venue.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900">{venue.name}</h2>
                <p className="text-sm text-gray-600">Booking Calendar</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Venue Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Price per night:</span>
                <p className="font-semibold">${venue.price}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Max guests:</span>
                <p className="font-semibold">{venue.maxGuests}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Total bookings:</span>
                <p className="font-semibold">{bookings.length}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Upcoming:</span>
                <p className="font-semibold">
                  {bookings.filter(booking => new Date(booking.dateFrom) >= new Date()).length}
                </p>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-6">
            <BookingCalendar
              bookedDates={bookings}
              onDateChange={handleDateChange}
              checkIn=""
              checkOut=""
              minDate={new Date(2020, 0, 1)} // Allow viewing past dates
            />
          </div>

          {/* Booking List */}
          {bookings.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">All Bookings</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {bookings
                  .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom))
                  .map((booking) => {
                    const checkIn = new Date(booking.dateFrom);
                    const checkOut = new Date(booking.dateTo);
                    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                    const total = nights * venue.price;
                    const isUpcoming = checkIn >= new Date();
                    
                    return (
                      <div 
                        key={booking.id} 
                        className={`p-3 rounded-lg border ${
                          isUpcoming ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {isUpcoming ? 'Upcoming' : 'Past'}
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {booking.customer?.name || 'Guest'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {checkIn.toLocaleDateString()} - {checkOut.toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.guests} guest{booking.guests > 1 ? 's' : ''} • {nights} night{nights > 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">${total}</p>
                            <p className="text-xs text-gray-500">Total</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {bookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No bookings yet for this venue.</p>
              <p className="text-sm">Bookings will appear here when guests make reservations.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Close Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCalendarModal; 