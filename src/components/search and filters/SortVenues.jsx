import React from 'react';

export default function SortVenues({ onSort, currentSort = '', sortOptions = [] }) {
  const defaultSortOptions = [
    { value: '', label: 'Default (Newest First)' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating-high', label: 'Rating: High to Low' },
    { value: 'rating-low', label: 'Rating: Low to High' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'guests-high', label: 'Max Guests: High to Low' },
    { value: 'guests-low', label: 'Max Guests: Low to High' }
  ];

  const options = sortOptions.length > 0 ? sortOptions : defaultSortOptions;

  const handleSortChange = (e) => {
    onSort(e.target.value);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={handleSortChange}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
} 