import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VenueCard({ 
  hotelData, 
  venue, 
  onClick, 
  showOwnerBadge = false, 
  onViewCalendar = null,
  className = ""
}) {
  // Support both hotelData (from API) and venue (from profile) props for DRY principle
  const venueData = hotelData || venue;
  
  const [imgSrc, setImgSrc] = useState(
    venueData?.image || venueData?.media?.[0]?.url || 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  );
  const [imgError, setImgError] = useState(false);
  
  const navigate = useNavigate();

  // Handle card click/navigation
  const handleCardClick = () => {
    if (onClick) {
      onClick(venueData.id);
    } else {
      navigate(`/venue/${venueData.id}`);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  // Handle image error with fallback
  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc('https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    }
  };

  // Format location from object to string
  const formatLocation = (location) => {
    if (!location) return 'Location not specified';
    if (typeof location === 'string') return location;
    
    const parts = [location.city, location.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  };

  // Format amenities for screen readers
  const getAmenitiesText = (meta) => {
    if (!meta) return '';
    const amenities = [];
    if (meta.wifi) amenities.push('WiFi');
    if (meta.parking) amenities.push('Parking');
    if (meta.breakfast) amenities.push('Breakfast');
    if (meta.pets) amenities.push('Pet-friendly');
    return amenities.length > 0 ? `Amenities: ${amenities.join(', ')}` : '';
  };

  // Format rating for screen readers
  const getRatingText = (rating) => {
    if (!rating) return 'No rating available';
    return `Rated ${rating} out of 5 stars`;
  };

  // Handle view calendar button
  const handleViewCalendar = (e) => {
    e.stopPropagation();
    if (onViewCalendar) {
      onViewCalendar(venueData);
    }
  };

  if (!venueData) {
    return null;
  }

  const location = formatLocation(venueData.location);
  const amenitiesText = getAmenitiesText(venueData.meta);
  const ratingText = getRatingText(venueData.rating);
  const bookingCount = venueData._count?.bookings || 0;

  return (
    <article 
      className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${venueData.name} in ${location}. ${ratingText}. Price $${venueData.price} per night. ${amenitiesText}`}
      style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Image Section */}
      <div className="relative">
        <img
          src={imgSrc}
          alt={venueData.media?.[0]?.alt || `${venueData.name} venue image`}
          className="w-full h-48 object-cover"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Rating Badge */}
        {venueData.rating !== undefined && (
          <div 
            className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded font-medium text-sm"
            aria-hidden="true"
          >
            {venueData.rating} ★
          </div>
        )}

        {/* Owner Badge */}
        {showOwnerBadge && (
          <div 
            className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold z-10"
            aria-label="You own this venue"
          >
            Owner
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Venue Name */}
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 leading-tight">
            {venueData.name}
          </h3>
        </div>

        {/* Location */}
        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
          <span className="sr-only">Location: </span>
          {location}
        </p>



        {/* Price */}
        <div className="mb-3">
          <span className="text-green-600 font-semibold text-lg" aria-label={`Price: $${venueData.price} per night`}>
            ${venueData.price}
          </span>
          <span className="text-gray-500 text-sm"> / night</span>
        </div>

        {/* Amenities */}
        {venueData.meta && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1" role="list" aria-label="Available amenities">
              {venueData.meta.wifi && (
                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded" role="listitem">
                  WiFi
                </span>
              )}
              {venueData.meta.parking && (
                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded" role="listitem">
                  Parking
                </span>
              )}
              {venueData.meta.breakfast && (
                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded" role="listitem">
                  Breakfast
                </span>
              )}
              {venueData.meta.pets && (
                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded" role="listitem">
                  Pet-friendly
                </span>
              )}
            </div>
          </div>
        )}



        {/* Action Buttons */}
        <div className="mt-auto pt-3">
          <div className="space-y-2">
            {/* Book Now Button */}
            <button 
              className="w-full btn-primary text-sm py-2"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              aria-label={`Book ${venueData.name} now`}
            >
              Book Now
            </button>

            {/* Calendar Button for Venue Managers */}
            {onViewCalendar && (
              <button
                onClick={handleViewCalendar}
                className="w-full bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`View booking calendar for ${venueData.name}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>View Calendar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Screen Reader Only Content */}
      <div className="sr-only">
        {ratingText}. 
        {amenitiesText}.
      </div>
    </article>
  );
}

export default VenueCard; 