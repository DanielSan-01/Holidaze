import React, { useState } from 'react';

export default function FilterVenues({ onFilterChange, filters = {}, onClearFilters, onSort, currentSort = '' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    minPrice: '',
    maxPrice: '',
    maxGuests: '',
    minRating: '',
    checkIn: '',
    checkOut: '',
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
    ...filters
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    
    // Validate date range
    if (key === 'checkIn' && newFilters.checkOut && value >= newFilters.checkOut) {
      newFilters.checkOut = ''; // Clear check-out if it's before or same as check-in
    }
    if (key === 'checkOut' && newFilters.checkIn && value <= newFilters.checkIn) {
      return; // Don't allow check-out before or same as check-in
    }
    
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      minPrice: '',
      maxPrice: '',
      maxGuests: '',
      minRating: '',
      checkIn: '',
      checkOut: '',
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
    if (onClearFilters) {
      onClearFilters();
    }
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== '' && value !== false
  );

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isExpanded}
        aria-controls="filter-panel"
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} filter options${hasActiveFilters ? ' (filters currently active)' : ''}`}
      >
        <div className="flex items-center">
          <span className="font-medium text-gray-900">Filters</span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full" aria-label="Filters are active">
              Active
            </span>
          )}
        </div>
        <svg 
          className={`w-5 h-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div id="filter-panel" className="mt-3 p-4 bg-white border border-gray-200 rounded-lg" role="region" aria-label="Filter options">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <fieldset className="lg:col-span-2">
              <legend className="block text-sm font-medium text-gray-700 mb-2">Available Dates</legend>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label htmlFor="check-in-date" className="block text-xs text-gray-600 mb-1">Check-in</label>
                  <input
                    id="check-in-date"
                    type="date"
                    value={localFilters.checkIn}
                    onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Check-in date"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="check-out-date" className="block text-xs text-gray-600 mb-1">Check-out</label>
                  <input
                    id="check-out-date"
                    type="date"
                    value={localFilters.checkOut}
                    onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                    min={localFilters.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Check-out date"
                  />
                </div>
              </div>
            </fieldset>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range ($)</label>
              <div className="flex space-x-2">
                <input
                  id="min-price"
                  type="number"
                  placeholder="Min"
                  value={localFilters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Minimum price per night"
                  min="0"
                />
                <input
                  id="max-price"
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Maximum price per night"
                  min="0"
                />
              </div>
            </div>

            {/* Max Guests */}
            <div>
              <label htmlFor="max-guests" className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
              <input
                id="max-guests"
                type="number"
                placeholder="Any"
                value={localFilters.maxGuests}
                onChange={(e) => handleFilterChange('maxGuests', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Maximum number of guests"
                min="1"
              />
            </div>

            {/* Rating Filter & Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating & Sort Options</label>
              <div className="flex space-x-2">
                <select
                  id="min-rating"
                  value={localFilters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Minimum rating filter"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars (Excellent)</option>
                  <option value="3">3+ Stars (Good)</option>
                  <option value="2">2+ Stars (Fair)</option>
                  <option value="1">1+ Stars (Poor)</option>
                </select>
                <select
                  id="sort-order"
                  value={currentSort}
                  onChange={(e) => onSort && onSort(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Sort venues by"
                >
                  <option value="">Default Order</option>
                  <option value="rating-high">Rating: High to Low</option>
                  <option value="rating-low">Rating: Low to High</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="guests-high">Max Guests: High to Low</option>
                </select>
              </div>
            </div>

            {/* Amenities */}
            <fieldset className="lg:col-span-4 md:col-span-2">
              <legend className="block text-sm font-medium text-gray-700 mb-2">Amenities</legend>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { key: 'wifi', label: 'WiFi', icon: '📶' },
                  { key: 'parking', label: 'Parking', icon: '🚗' },
                  { key: 'breakfast', label: 'Breakfast', icon: '🍳' },
                  { key: 'pets', label: 'Pets allowed', icon: '🐕' }
                ].map(({ key, label, icon }) => (
                  <label key={key} className="flex items-center text-sm cursor-pointer">
                    <input
                      id={`amenity-${key}`}
                      type="checkbox"
                      checked={localFilters[key]}
                      onChange={(e) => handleFilterChange(key, e.target.checked)}
                      className="mr-2 text-blue-600 focus:ring-blue-500 focus:ring-2"
                      aria-describedby={`amenity-${key}-desc`}
                    />
                    <span aria-hidden="true" className="mr-1">{icon}</span>
                    <span>{label}</span>
                    <span id={`amenity-${key}-desc`} className="sr-only">
                      Filter venues that include {label.toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 