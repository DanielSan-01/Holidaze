import React from 'react';

export default function VenueMap({ venue, className = "", height = "h-64" }) {
  // Bergen centrum coordinates as fallback
  const bergenLat = 60.3913;
  const bergenLng = 5.3221;
  
  // Use venue coordinates if available, otherwise default to Bergen centrum
  const lat = venue?.location?.lat || bergenLat;
  const lng = venue?.location?.lng || bergenLng;
  
  // Check if we're using fallback coordinates
  const usingFallback = !venue?.location?.lat || !venue?.location?.lng;
  
  // Create simple Google Maps embed URL (no API key required)
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;

  return (
    <div className={`w-full ${height} rounded-lg overflow-hidden ${className} relative`}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map of ${venue.name}`}
        className="rounded-lg w-full h-full"
      />
      
      {/* Show location info overlay */}
      <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 rounded p-2 text-xs">
        <div className="font-medium text-gray-800">
          📍 {usingFallback ? 'Bergen centrum (default location)' : 'Venue location'}
        </div>
        <div className="text-gray-600">
          {[venue?.location?.address, venue?.location?.city, venue?.location?.country]
            .filter(Boolean)
            .join(', ') || 'Location details not provided'}
        </div>
        {usingFallback && (
          <div className="text-gray-500 text-xs mt-1">
            Exact coordinates not available - showing Bergen city center
          </div>
        )}
      </div>
    </div>
  );
} 