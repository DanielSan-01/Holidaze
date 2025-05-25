/**
 * Apply search and filter criteria to a list of venues
 * @param {Array} venues - Array of venue objects
 * @param {string} searchTerm - Search term to filter by
 * @param {Object} filters - Filter options object
 * @returns {Array} Filtered venues array
 */
export const filterVenues = (venues, searchTerm = '', filters = {}) => {
  let filtered = [...venues];

  // Apply search filter
  if (searchTerm && searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(venue => 
      venue.name?.toLowerCase().includes(searchLower) ||
      venue.description?.toLowerCase().includes(searchLower) ||
      venue.location?.city?.toLowerCase().includes(searchLower) ||
      venue.location?.country?.toLowerCase().includes(searchLower)
    );
  }

  // Apply price filters
  if (filters.minPrice) {
    filtered = filtered.filter(venue => venue.price >= parseFloat(filters.minPrice));
  }
  if (filters.maxPrice) {
    filtered = filtered.filter(venue => venue.price <= parseFloat(filters.maxPrice));
  }

  // Apply guest filter
  if (filters.maxGuests) {
    filtered = filtered.filter(venue => venue.maxGuests >= parseInt(filters.maxGuests));
  }

  // Apply rating filter
  if (filters.minRating) {
    filtered = filtered.filter(venue => venue.rating >= parseFloat(filters.minRating));
  }

  // Apply amenity filters
  if (filters.wifi) {
    filtered = filtered.filter(venue => venue.meta?.wifi);
  }
  if (filters.parking) {
    filtered = filtered.filter(venue => venue.meta?.parking);
  }
  if (filters.breakfast) {
    filtered = filtered.filter(venue => venue.meta?.breakfast);
  }
  if (filters.pets) {
    filtered = filtered.filter(venue => venue.meta?.pets);
  }

  return filtered;
};

/**
 * Check if there are any active filters
 * @param {Object} filters - Filter options object
 * @returns {boolean} True if any filters are active
 */
export const hasActiveFilters = (filters = {}) => {
  return Object.values(filters).some(value => value !== '' && value !== false);
};

/**
 * Sort venues by specified criteria
 * @param {Array} venues - Array of venue objects
 * @param {string} sortBy - Sort criteria key
 * @returns {Array} Sorted venues array
 */
export const sortVenues = (venues, sortBy = '') => {
  if (!sortBy || venues.length === 0) {
    return [...venues]; // Return copy of original array
  }

  const sorted = [...venues];

  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    
    case 'rating-high':
      return sorted.sort((a, b) => b.rating - a.rating);
    
    case 'rating-low':
      return sorted.sort((a, b) => a.rating - b.rating);
    
    case 'name-asc':
      return sorted.sort((a, b) => a.name?.toLowerCase().localeCompare(b.name?.toLowerCase()));
    
    case 'name-desc':
      return sorted.sort((a, b) => b.name?.toLowerCase().localeCompare(a.name?.toLowerCase()));
    
    case 'guests-high':
      return sorted.sort((a, b) => b.maxGuests - a.maxGuests);
    
    case 'guests-low':
      return sorted.sort((a, b) => a.maxGuests - b.maxGuests);
    
    default:
      return sorted; // Return unsorted copy
  }
}; 