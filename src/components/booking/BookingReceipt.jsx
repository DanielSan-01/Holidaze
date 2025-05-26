import React from 'react';

const BookingReceipt = ({ 
  bookingData, 
  venue, 
  isOpen, 
  onClose, 
  onViewBookings, 
  calculateNights, 
  calculateTotal, 
  formatDate,
  showViewBookingsButton = true,
  autoRedirect = false,
  userName = null
}) => {
  if (!isOpen || !bookingData) return null;

  const handleViewBookings = () => {
    if (onViewBookings) {
      onViewBookings();
    }
  };

  const handleClose = () => {
    if (autoRedirect && onViewBookings) {
      // Auto-redirect to bookings instead of just closing
      onViewBookings();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          {userName && (
            <p className="text-lg text-gray-700 mb-2">
              Thank you, <span className="font-semibold text-blue-600">{userName}</span>!
            </p>
          )}
          <h2 className="text-2xl font-bold text-green-600 mb-4">Booking Confirmed!</h2>
          
          <div className="bg-gray-50 p-4 rounded mb-4 text-left">
            <h3 className="font-semibold mb-2">Booking Receipt</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Booking ID:</strong> {bookingData.id}</p>
              <p><strong>Venue:</strong> {venue?.name || 'N/A'}</p>
              <p><strong>Check-in:</strong> {formatDate(bookingData.dateFrom)}</p>
              <p><strong>Check-out:</strong> {formatDate(bookingData.dateTo)}</p>
              <p><strong>Guests:</strong> {bookingData.guests}</p>
              <p><strong>Nights:</strong> {calculateNights()}</p>
              <p><strong>Total:</strong> ${calculateTotal()}</p>
              <p><strong>Booked:</strong> {formatDate(bookingData.created)}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {showViewBookingsButton && (
              <button
                onClick={handleViewBookings}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                View My Bookings
              </button>
            )}
            <button
              onClick={handleClose}
              className={`${showViewBookingsButton ? 'flex-1' : 'w-full'} bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400`}
            >
              {autoRedirect ? 'Continue' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingReceipt; 