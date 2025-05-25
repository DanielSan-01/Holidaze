import React from 'react';

const LocationDisplay = ({ location, className = "" }) => {
  if (!location) return null;

  const formatLocation = (location) => {
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.country) parts.push(location.country);
    return parts.join(', ');
  };

  const hasCoordinates = location.lat !== undefined && location.lng !== undefined && 
                        location.lat !== 0 && location.lng !== 0;

  return (
    <div className={`location-display ${className}`}>
      {formatLocation(location) && (
        <div className="text-sm text-gray-600 mb-2">
          📍 {formatLocation(location)}
        </div>
      )}
      
      {location.address && (
        <div className="text-xs text-gray-500 mb-1">
          {location.address}
        </div>
      )}
      
      {location.zip && (
        <div className="text-xs text-gray-500 mb-1">
          {location.zip}
        </div>
      )}
      
      {hasCoordinates && (
        <div className="text-xs text-gray-400">
          Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
};

export default LocationDisplay; 