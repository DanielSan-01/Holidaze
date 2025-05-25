import React from 'react';
import { useVenueRating } from '../hooks/venues';

/**
 * VenueRatingDisplay Component
 * 
 * Displays both venue ratings from the API and user's personal ratings from localStorage.
 * 
 * NOTE: Personal ratings are LOCAL ONLY due to Holidaze API limitations.
 * The API does not provide endpoints for user rating submissions, so personal
 * ratings are stored in localStorage as a demonstration feature.
 */

export default function VenueRatingDisplay({ venue, showPersonalRating = true, className = "" }) {
  const { getAllRatings } = useVenueRating();
  
  // Get user's personal rating for this venue
  const userRating = showPersonalRating ? getAllRatings().find(r => r.venueId === venue.id) : null;
  
  return (
    <div className={`rating-display ${className}`}>
      {/* Venue's original rating */}
      <div className="venue-rating">
        <span className="text-gray-600">
          {venue.rating === 0 ? 'No venue rating' : (
            <>
              <span className="font-medium">Venue:</span> {venue.rating.toFixed(1)} ★
            </>
          )}
        </span>
      </div>
      
      {/* User's personal rating */}
      {userRating && (
        <div className="personal-rating mt-1">
          <span className="text-blue-600">
            <span className="font-medium">Your rating:</span> {userRating.rating} ★
          </span>
          <span className="text-xs text-gray-500 ml-2">
            ({new Date(userRating.timestamp).toLocaleDateString()})
          </span>
        </div>
      )}
      
      {/* Show combined rating if both exist */}
      {venue.rating > 0 && userRating && (
        <div className="combined-rating mt-1">
          <span className="text-sm text-gray-500">
            Average: {((venue.rating + userRating.rating) / 2).toFixed(1)} ★
          </span>
        </div>
      )}
    </div>
  );
} 