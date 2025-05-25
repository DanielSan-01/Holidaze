import React, { useState, useEffect } from 'react';
import { sanitizeInput, validateSearchQuery } from '../../utils/security.js';

export default function SearchVenues({ 
  onSearch, 
  searchParams = null,
  setSearchParams = null,
  placeholder = "Search venues by name, location, or description...",
  initialValue = ""
}) {
  const [searchInput, setSearchInput] = useState(initialValue);
  const [error, setError] = useState('');

  // Initialize search from URL params
  useEffect(() => {
    if (searchParams) {
      const urlSearch = searchParams.get('search');
      if (urlSearch && urlSearch !== searchInput) {
        // Validate and sanitize URL search parameter
        const sanitizedSearch = sanitizeInput(urlSearch);
        if (validateSearchQuery(sanitizedSearch)) {
          setSearchInput(sanitizedSearch);
          onSearch(sanitizedSearch);
        } else {
          setError('Invalid search query from URL');
          setSearchInput('');
        }
      }
    }
  }, [searchParams]);

  // Update search input when initialValue changes
  useEffect(() => {
    const sanitizedInitial = sanitizeInput(initialValue);
    if (validateSearchQuery(sanitizedInitial)) {
      setSearchInput(sanitizedInitial);
      setError('');
    }
  }, [initialValue]);

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    
    // Sanitize input immediately
    const sanitizedValue = sanitizeInput(rawValue);
    
    // Validate the sanitized input
    if (!validateSearchQuery(sanitizedValue) && sanitizedValue.length > 0) {
      setError('Search contains invalid characters or patterns');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Update state with sanitized value
    setSearchInput(sanitizedValue);
    
    // Only call onSearch with validated input
    if (typeof onSearch === 'function') {
      onSearch(sanitizedValue);
    }
    
    // Update URL params if provided
    if (setSearchParams) {
      const newParams = new URLSearchParams(searchParams);
      if (sanitizedValue.trim()) {
        newParams.set('search', sanitizedValue);
      } else {
        newParams.delete('search');
      }
      setSearchParams(newParams);
    }
  };

  const handleClear = () => {
    setSearchInput('');
    setError('');
    
    if (typeof onSearch === 'function') {
      onSearch('');
    }
    
    if (setSearchParams) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      setSearchParams(newParams);
    }
  };

  const handleKeyDown = (e) => {
    // Prevent potential injection through keyboard events
    if (e.key === 'Enter') {
      e.preventDefault();
      // Re-validate on enter
      if (!validateSearchQuery(searchInput)) {
        setError('Invalid search query');
        return;
      }
    }
    
    // Block dangerous key combinations
    if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
      // Allow paste but validate after
      setTimeout(() => {
        const value = e.target.value;
        const sanitized = sanitizeInput(value);
        if (!validateSearchQuery(sanitized)) {
          setError('Pasted content contains invalid characters');
          setSearchInput('');
          e.target.value = '';
        }
      }, 0);
    }
  };

  const handlePaste = (e) => {
    // Intercept paste events to validate content
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const sanitized = sanitizeInput(pastedText);
    
    if (!validateSearchQuery(sanitized)) {
      setError('Pasted content contains invalid characters or patterns');
      return;
    }
    
    setSearchInput(sanitized);
    if (typeof onSearch === 'function') {
      onSearch(sanitized);
    }
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          maxLength={100} // Limit input length
          className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 ${
            error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
          // Additional security attributes
          autoComplete="off"
          spellCheck="false"
          autoCorrect="off"
          autoCapitalize="off"
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {searchInput ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              type="button"
              aria-label="Clear search"
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
      
      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}
      
      {/* Security notice for users */}
      {searchInput.length > 50 && (
        <div className="mt-2 text-xs text-gray-500">
          Search queries are limited to 100 characters for security reasons.
        </div>
      )}
    </div>
  );
} 