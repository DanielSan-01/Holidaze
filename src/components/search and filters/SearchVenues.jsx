import React, { useState, useEffect } from 'react';

export default function SearchVenues({ 
  onSearch, 
  searchParams = null,
  setSearchParams = null,
  placeholder = "Search venues by name, location, or description...",
  initialValue = ""
}) {
  const [searchInput, setSearchInput] = useState(initialValue);

  // Initialize search from URL params
  useEffect(() => {
    if (searchParams) {
      const urlSearch = searchParams.get('search');
      if (urlSearch && urlSearch !== searchInput) {
        setSearchInput(urlSearch);
        onSearch(urlSearch);
      }
    }
  }, [searchParams]);

  // Update search input when initialValue changes
  useEffect(() => {
    setSearchInput(initialValue);
  }, [initialValue]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value);
    
    // Update URL params if provided
    if (setSearchParams) {
      const newParams = new URLSearchParams(searchParams);
      if (value.trim()) {
        newParams.set('search', value);
      } else {
        newParams.delete('search');
      }
      setSearchParams(newParams);
    }
  };

  const handleClear = () => {
    setSearchInput('');
    onSearch('');
    if (setSearchParams) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      setSearchParams(newParams);
    }
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {searchInput ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
} 