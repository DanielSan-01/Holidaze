import React from 'react';
import { sanitizeInput, encodeHtml } from '../utils/security.js';

const BookingCard = ({ booking, onCancel, onViewVenue }) => {
  // Sanitize all text inputs to prevent XSS
  const safeName = sanitizeInput(booking?.venue?.name || 'Unknown Venue');
  const safeLocation = sanitizeInput(booking?.venue?.location?.city || 'Unknown Location');
  const safeDescription = sanitizeInput(booking?.venue?.description || '');
  
  // Validate dates
  const checkIn = booking?.dateFrom ? new Date(booking.dateFrom) : null;
  const checkOut = booking?.dateTo ? new Date(booking.dateTo) : null;
  
  // Validate and sanitize numeric values
  const guests = Math.max(1, parseInt(booking?.guests) || 1);
  const price = Math.max(0, parseFloat(booking?.venue?.price) || 0);
  
  // Calculate total safely
  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))) : 1;
  const total = price * nights;
  
  // Safe image URL validation
  const imageUrl = booking?.venue?.media?.[0]?.url;
  const safeImageUrl = imageUrl && imageUrl.startsWith('http') ? imageUrl : '/placeholder-image.jpg';
  
  const formatDate = (date) => {
    if (!date || isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleCancel = () => {
    if (typeof onCancel === 'function' && booking?.id) {
      onCancel(booking);
    }
  };
  
  const handleViewVenue = () => {
    if (typeof onViewVenue === 'function' && booking?.venue?.id) {
      onViewVenue(booking.venue.id);
    }
  };
  
  // Determine booking status
  const now = new Date();
  const isUpcoming = checkIn && checkIn > now;
  const isActive = checkIn && checkOut && checkIn <= now && now <= checkOut;
  const isPast = checkOut && checkOut < now;
  
  const getStatusColor = () => {
    if (isUpcoming) return 'bg-blue-100 text-blue-800';
    if (isActive) return 'bg-green-100 text-green-800';
    if (isPast) return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };
  
  const getStatusText = () => {
    if (isUpcoming) return 'Upcoming';
    if (isActive) return 'Active';
    if (isPast) return 'Completed';
    return 'Unknown';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={safeImageUrl}
          alt={`${safeName} venue`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Venue Name and Location */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {encodeHtml(safeName)}
          </h3>
          <p className="text-sm text-gray-600">
            📍 {encodeHtml(safeLocation)}
          </p>
        </div>
        
        {/* Booking Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Check-in:</span>
            <span className="font-medium">{formatDate(checkIn)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Check-out:</span>
            <span className="font-medium">{formatDate(checkOut)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Guests:</span>
            <span className="font-medium">{guests}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Nights:</span>
            <span className="font-medium">{nights}</span>
          </div>
        </div>
        
        {/* Price */}
        <div className="border-t pt-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total:</span>
            <span className="text-lg font-bold text-gray-900">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleViewVenue}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Venue
          </button>
          {isUpcoming && (
            <button
              onClick={handleCancel}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard; 