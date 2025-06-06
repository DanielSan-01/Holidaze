import React, { useState, useEffect } from 'react';

/**
 * LocationPicker Component - School Project Implementation
 * 
 * DESIGN DECISION: Fixed Bergen Location
 * 
 * Originally designed to allow users to select any location, but adapted for school project reality:
 * - Students don't input real venue locations into the API
 * - Most test data would show "unknown location" or broken addresses
 * - This creates a poor user experience in demos and presentations
 * 
 * SOLUTION: Default all venues to Bergen Sentrum
 * - Provides consistent, professional-looking location data
 * - Bergen is the project's target market (Norwegian tourism)
 * - Maintains location functionality without requiring real user input
 * - Perfect for academic demonstration purposes
 * 
 * FUTURE: In a real application, this would be a full location picker with:
 * - Google Places API integration
 * - Address autocomplete
 * - Geocoding validation
 */
const LocationPicker = ({ onLocationSelect, initialLocation = null, className = '' }) => {
  // Bergen sentrum coordinates - fixed location for school project
  const bergenSentrum = {
    lat: 60.3913,
    lng: 5.3221,
    address: 'Bergen Sentrum',
    city: 'Bergen',
    zip: '5003',
    country: 'Norway',
    continent: 'Europe'
  };

  const [selectedLocation] = useState(bergenSentrum);

  // Auto-select Bergen sentrum on mount
  useEffect(() => {
    onLocationSelect(bergenSentrum);
  }, []);

  // Simple Google Maps embed URL (no API key required)
  const mapUrl = `https://maps.google.com/maps?q=${bergenSentrum.lat},${bergenSentrum.lng}&z=14&output=embed`;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Venue Location
        </label>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <span className="text-2xl mr-2">📍</span>
            <div>
              <p className="font-medium text-blue-900">{selectedLocation.address}</p>
              <p className="text-sm text-blue-700">{selectedLocation.city}, {selectedLocation.country}</p>
              <p className="text-xs text-blue-600">
                Coordinates: {selectedLocation.lat}, {selectedLocation.lng}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          All venues are located in Bergen Sentrum for this demo
        </p>
      </div>

      {/* Map */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Map Preview
        </label>
        <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bergen Sentrum Map"
            className="rounded-lg"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          📍 Your venue will be located in Bergen Sentrum
        </p>
      </div>
    </div>
  );
};

export default LocationPicker; 