import React from 'react';

const LocationDisplay = ({ location, className = "" }) => {
  // For this school project, always show Bergen centrum
  // This ensures consistent, professional-looking location data for demos
  const bergenLocation = {
    city: 'Bergen',
    country: 'Norway',
    address: 'Bergen Sentrum',
    zip: '5003',
    lat: 60.3913,
    lng: 5.3221
  };

  // Use provided location data if available, otherwise use Bergen defaults
  const displayLocation = {
    city: location?.city || bergenLocation.city,
    country: location?.country || bergenLocation.country,
    address: location?.address || bergenLocation.address,
    zip: location?.zip || bergenLocation.zip,
    lat: bergenLocation.lat, // Always use Bergen coordinates
    lng: bergenLocation.lng  // Always use Bergen coordinates
  };

  const formatLocation = (loc) => {
    const parts = [];
    if (loc.city) parts.push(loc.city);
    if (loc.country) parts.push(loc.country);
    return parts.join(', ');
  };

  return (
    <div className={`location-display ${className}`}>
      <div className="text-sm text-gray-600 mb-2">
        📍 {formatLocation(displayLocation)}
      </div>
      
      {displayLocation.address && (
        <div className="text-xs text-gray-500 mb-1">
          {displayLocation.address}
        </div>
      )}
      
      {displayLocation.zip && (
        <div className="text-xs text-gray-500 mb-1">
          {displayLocation.zip}
        </div>
      )}
      
      <div className="text-xs text-gray-400">
        Coordinates: {displayLocation.lat.toFixed(4)}, {displayLocation.lng.toFixed(4)}
      </div>
    </div>
  );
};

export default LocationDisplay; 