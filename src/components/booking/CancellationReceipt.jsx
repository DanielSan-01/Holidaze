import React from 'react';

const CancellationReceipt = ({ 
  cancelledBooking, 
  isOpen, 
  onClose, 
  onViewVenue,
  formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}) => {
  if (!isOpen || !cancelledBooking) return null;

  const handleViewVenue = () => {
    if (onViewVenue && cancelledBooking.venue?.id) {
      onViewVenue(cancelledBooking.venue.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Booking Cancelled!</h2>
          
          <div className="bg-gray-50 p-4 rounded mb-4 text-left">
            <h3 className="font-semibold mb-2">Cancelled Booking</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Venue:</strong> {cancelledBooking.venue?.name || 'N/A'}</p>
              <p><strong>Check-in:</strong> {formatDate(cancelledBooking.dateFrom)}</p>
              <p><strong>Check-out:</strong> {formatDate(cancelledBooking.dateTo)}</p>
              <p><strong>Guests:</strong> {cancelledBooking.guests}</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-6">
            <p className="font-medium text-green-600 mb-2">✅ Successfully cancelled</p>
            <p>These dates are now available for other guests to book.</p>
            <p className="text-xs mt-2">You will not be charged for this booking.</p>
          </div>
          
          <div className="flex gap-3">
            {cancelledBooking.venue?.id && (
              <button
                onClick={handleViewVenue}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                View Venue
              </button>
            )}
            <button
              onClick={onClose}
              className={`${cancelledBooking.venue?.id ? 'flex-1' : 'w-full'} bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationReceipt; 