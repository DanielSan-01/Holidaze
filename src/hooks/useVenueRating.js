import { useState } from 'react';

/**
 * useVenueRating Hook
 * 
 * LOCAL STORAGE IMPLEMENTATION - API LIMITATION
 * 
 * The Holidaze API documentation does not include endpoints for user rating submissions.
 * While venues have a 'rating' field, there is no way to POST/PUT user ratings.
 * 
 * This hook implements a local-only rating system using localStorage
 * as a demonstration of rating functionality that could be implemented
 * if the API supported user rating submissions in the future.
 * 
 * In a real implementation, the submitRating function would make an API call
 * to something like POST /holidaze/venues/{id}/ratings
 */

export const useVenueRating = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratings, setRatings] = useState(new Map()); // Store ratings locally

  const submitRating = async ({ venueId, bookingId, rating }) => {
    setIsSubmitting(true);
    
    try {
      // LOCAL STORAGE IMPLEMENTATION DUE TO API LIMITATIONS
      // In a real implementation, this would be an API call like:
      // const response = await fetch(`/holidaze/venues/${venueId}/ratings`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` },
      //   body: JSON.stringify({ rating, bookingId })
      // });
      
      const ratingData = {
        venueId,
        bookingId,
        rating,
        timestamp: new Date().toISOString(),
        id: `rating_${bookingId}_${Date.now()}`
      };

      // Store in localStorage for persistence
      const existingRatings = JSON.parse(localStorage.getItem('venueRatings') || '[]');
      
      // Check if user already rated this booking
      const existingRatingIndex = existingRatings.findIndex(r => r.bookingId === bookingId);
      
      if (existingRatingIndex >= 0) {
        // Update existing rating
        existingRatings[existingRatingIndex] = ratingData;
      } else {
        // Add new rating
        existingRatings.push(ratingData);
      }
      
      localStorage.setItem('venueRatings', JSON.stringify(existingRatings));
      
      // Update local state
      setRatings(prev => {
        const newMap = new Map(prev);
        newMap.set(bookingId, ratingData);
        return newMap;
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Rating submitted:', ratingData);
      return ratingData;
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRating = (bookingId) => {
    // Check local state first
    if (ratings.has(bookingId)) {
      return ratings.get(bookingId);
    }
    
    // Check localStorage
    const existingRatings = JSON.parse(localStorage.getItem('venueRatings') || '[]');
    const rating = existingRatings.find(r => r.bookingId === bookingId);
    
    if (rating) {
      setRatings(prev => {
        const newMap = new Map(prev);
        newMap.set(bookingId, rating);
        return newMap;
      });
    }
    
    return rating;
  };

  const getAllRatings = () => {
    return JSON.parse(localStorage.getItem('venueRatings') || '[]');
  };

  const hasRated = (bookingId) => {
    return !!getRating(bookingId);
  };

  const getRatingByVenueId = (venueId) => {
    const allRatings = getAllRatings();
    return allRatings.find(r => r.venueId === venueId);
  };

  const hasRatedVenue = (venueId) => {
    return !!getRatingByVenueId(venueId);
  };

  return {
    submitRating,
    getRating,
    getAllRatings,
    hasRated,
    getRatingByVenueId,
    hasRatedVenue,
    isSubmitting
  };
}; 