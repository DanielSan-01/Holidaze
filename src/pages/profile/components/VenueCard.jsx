import React from 'react';
import LocationDisplay from './LocationDisplay';

const VenueCard = ({ venue, onClick, showOwnerBadge = false, showLastVisited = false }) => {
  return (
    <div 
      className="border rounded p-4 cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={() => onClick(venue.id)}
    >
      {/* Owner badge */}
      {showOwnerBadge && (
        <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
          Owner
        </div>
      )}
      
      {venue.media?.[0]?.url && (
        <img
          src={venue.media[0].url}
          alt={venue.media[0].alt || venue.name}
          className="w-full h-32 object-cover rounded mb-2"
        />
      )}
      
      <h4 className="font-semibold text-blue-600 hover:text-blue-800">{venue.name}</h4>
      <p className="text-gray-600 text-sm mb-2">{venue.description}</p>
      
      {/* Location Display */}
      {venue.location && (
        <LocationDisplay location={venue.location} className="mb-2" />
      )}
      
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
    </div>
  );
};

export default VenueCard; 