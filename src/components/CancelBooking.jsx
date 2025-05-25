import React, { useState } from 'react';

export default function CancelBooking({ booking, onCancelSuccess }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState('');

  const handleCancelClick = () => {
    setError('');
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    setError('');

    try {
      // Get auth data from localStorage
      const accessToken = localStorage.getItem('accessToken');
      const apiKey = localStorage.getItem('apiKey');
      
      if (!accessToken) {
        throw new Error('Please log in to cancel bookings');
      }

      const headers = {
        'Authorization': `Bearer ${accessToken}`,
      };

      // Add API key if available
      if (apiKey) {
        headers['X-Noroff-API-Key'] = apiKey;
      }

      const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${booking.id}`, {
        method: 'DELETE',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel booking: ${response.status}`);
      }

      // Success - call the parent component's success handler
      onCancelSuccess(booking.id);
      setShowConfirmModal(false);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTotal = () => {
    const checkIn = new Date(booking.dateFrom);
    const checkOut = new Date(booking.dateTo);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights * booking.venue.price * booking.guests;
  };

  return (
    <>
      {/* Cancel Link - Subtle text instead of prominent button */}
      <p className="text-gray-600 text-sm">
        <span 
          onClick={handleCancelClick}
          className="underline cursor-pointer hover:text-red-600 transition-colors"
        >
          Cancel booking
        </span>
      </p>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              
              <h2 className="text-2xl font-bold text-red-600 mb-4">Cancel Booking?</h2>
              
              {/* Booking Details */}
              <div className="bg-gray-50 p-4 rounded mb-4 text-left">
                <h3 className="font-semibold mb-2">Booking Details</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Venue:</strong> {booking.venue.name}</p>
                  <p><strong>Check-in:</strong> {formatDate(booking.dateFrom)}</p>
                  <p><strong>Check-out:</strong> {formatDate(booking.dateTo)}</p>
                  <p><strong>Guests:</strong> {booking.guests}</p>
                  <p><strong>Total Paid:</strong> ${calculateTotal()}</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-6">
                <p className="font-medium text-red-600 mb-2">⚠️ This action cannot be undone</p>
                <p>Are you sure you want to cancel this booking?</p>
                <p className="text-xs mt-2">The dates will become available for other guests to book.</p>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded mb-4">
                  {error}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isCancelling}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                  className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 