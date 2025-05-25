import React from 'react';

export default function VenueMap({ venue, className = "", height = "h-64" }) {
  // Check if we have valid coordinates
  if (!venue?.location?.lat || !venue?.location?.lng) {
    return (
      <div className={`w-full ${height} bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 ${className}`}>
        <div className="text-center">
          <div className="text-lg font-medium text-gray-600 mb-2">📍 Location</div>
          <p className="text-sm text-gray-500">
            {[venue?.location?.address, venue?.location?.city, venue?.location?.country]
              .filter(Boolean)
              .join(', ') || 'Location information not available'}
          </p>
          <p className="text-xs text-gray-400 mt-2">Map coordinates not provided</p>
        </div>
      </div>
    );
  }

  const { lat, lng } = venue.location;
  
  // Create simple Google Maps embed URL (no API key required)
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;

  return (
    <div className={`w-full ${height} rounded-lg overflow-hidden ${className}`}>
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
    </div>
  );
} 