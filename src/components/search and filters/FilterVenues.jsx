import React, { useState } from 'react';

export default function FilterVenues({ onFilterChange, filters = {}, onClearFilters, onSort, currentSort = '' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    minPrice: '',
    maxPrice: '',
    maxGuests: '',
    minRating: '',
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
    ...filters
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      minPrice: '',
      maxPrice: '',
      maxGuests: '',
      minRating: '',
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
      >
        <div className="flex items-center">
          <span className="font-medium text-gray-900">Filters</span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              Active
            </span>
          )}
        </div>
        <svg 
          className={`w-5 h-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range ($)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Max Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
              <input
                type="number"
                placeholder="Any"
                value={localFilters.maxGuests}
                onChange={(e) => handleFilterChange('maxGuests', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Rating Filter & Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating Options</label>
              <div className="flex space-x-2">
                <select
                  value={localFilters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars ⭐⭐⭐⭐</option>
                  <option value="3">3+ Stars ⭐⭐⭐</option>
                  <option value="2">2+ Stars ⭐⭐</option>
                  <option value="1">1+ Stars ⭐</option>
                </select>
                <select
                  value={currentSort}
                  onChange={(e) => onSort && onSort(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="lg:col-span-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { key: 'wifi', label: '📶 WiFi' },
                  { key: 'parking', label: '🚗 Parking' },
                  { key: 'breakfast', label: '🍳 Breakfast' },
                  { key: 'pets', label: '🐕 Pets' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={localFilters[key]}
                      onChange={(e) => handleFilterChange(key, e.target.checked)}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
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