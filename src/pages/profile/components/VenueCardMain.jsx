import React from 'react';
import LocationDisplay from './LocationDisplay';

const VenueCardMain = ({ venue, showOwnerBadge = false, showLastVisited = false }) => {
  // Helper function to truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };
  return (
    <div>
      {/* Header with image and owner badge */}
      <div className="relative">
        {/* Owner badge */}
        {showOwnerBadge && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold z-10">
            Owner
          </div>
        )}
        
        {/* Venue image */}
        {venue.media?.[0]?.url && (
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
            className="w-full h-32 object-cover rounded mb-2"
          />
        )}
      </div>

      {/* Content */}
      <div>
        <h4 className="font-semibold text-blue-600 hover:text-blue-800 text-wrap-title">
          {venue.name}
        </h4>
        <p className="text-gray-600 text-sm mb-2 line-clamp-3 leading-relaxed">
          {truncateText(venue.description, 120)}
        </p>
        
        {/* Location Display */}
        {venue.location && (
          <LocationDisplay location={venue.location} className="mb-2" />
        )}
      </div>

      {/* Footer */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">${venue.price}/night</span>
          {showLastVisited ? (
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-sm text-gray-600">{venue.rating}/5</span>
            </div>
          ) : (
            <span className="text-sm text-gray-600">
              {venue._count?.bookings || 0} bookings
            </span>
          )}
        </div>
        
        {showLastVisited && venue.lastVisited && (
          <p className="text-xs text-gray-500">
            Last visited: {new Date(venue.lastVisited).toLocaleDateString()}
          </p>
        )}
        
        {/* Default Venue Policies */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>Checkout: 11:00 AM</span>
            <span>Cancel: 48h notice</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueCardMain; 