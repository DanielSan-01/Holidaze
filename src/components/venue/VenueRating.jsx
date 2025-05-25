import React, { useState, useEffect } from 'react';

/**
 * VenueRating Component
 * 
 * NOTE: This rating system is implemented as a LOCAL-ONLY feature.
 * The Holidaze API does not provide endpoints for submitting user ratings.
 * While the API includes a 'rating' field for venues, there is no documented
 * way to update this field through user submissions.
 * 
 * This component stores ratings in localStorage as a demonstration of
 * what a rating system could look like if the API supported it.
 */

export default function VenueRating({ booking, onRatingSubmit, disabled = false, existingRating = null }) {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(!!existingRating);

  // Update state when existingRating changes
  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
      setHasRated(true);
    }
  }, [existingRating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRatingSubmit({
        venueId: booking.venue.id,
        bookingId: booking.id,
        rating
      });
      setHasRated(true);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
    setIsSubmitting(false);
  };

  const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled || hasRated}
      className={`text-2xl transition-colors duration-150 ${
        filled 
          ? 'text-yellow-400' 
          : 'text-gray-300 hover:text-yellow-300'
      } ${disabled || hasRated ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      ★
    </button>
  );

  if (hasRated) {
    return (
      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-700">
            <span className="text-lg">✓</span>
            <span className="font-medium">
              {existingRating ? 'Rating updated!' : 'Thank you for your rating!'}
            </span>
          </div>
          <button
            onClick={() => setHasRated(false)}
            className="text-blue-500 hover:text-blue-700 text-sm underline"
          >
            Edit Rating
          </button>
        </div>
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
          <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
        </div>
        {existingRating?.timestamp && (
          <p className="mt-1 text-xs text-gray-500">
            Rated on {new Date(existingRating.timestamp).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  }

  // Check if booking is in the past (eligible for rating)
  const bookingEndDate = new Date(booking.dateTo);
  const today = new Date();
  // For demo purposes, allow rating regardless of dates
  const canRate = true; // bookingEndDate < today;

  if (!canRate) {
    const isOngoing = new Date(booking.dateFrom) <= today && today <= bookingEndDate;
    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          {isOngoing 
            ? `🏨 Enjoy your stay! You can rate this venue after checkout on ${bookingEndDate.toLocaleDateString()}`
            : `You can rate this venue after your stay ends on ${bookingEndDate.toLocaleDateString()}`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-medium text-gray-900 mb-3">Rate Your Stay</h4>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                filled={star <= (hover || rating)}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={rating === 0 || isSubmitting || disabled}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
          <button
            type="button"
            onClick={() => {
              setRating(0);
              setHover(0);
            }}
            disabled={isSubmitting || disabled}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:cursor-not-allowed text-sm transition-colors"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
} 