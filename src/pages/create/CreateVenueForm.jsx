import React, { useState, useEffect } from 'react';
import { useCreateVenue } from '../../hooks/venues';
import { useNavigate } from 'react-router-dom';
import LocationPicker from './LocationPicker';
import { sanitizeInput, isValidUrl, validateSearchQuery, encodeHtml } from '../../utils/security.js';

// Image Preview Component
const ImagePreview = ({ url, alt, index }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (url && url.trim()) {
      setLoading(true);
      setError(false);
      setLoaded(false);
    } else {
      setLoading(false);
      setError(false);
      setLoaded(false);
    }
  }, [url]);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
    setLoaded(true);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    setLoaded(false);
  };

  if (!url || !url.trim()) {
    return (
      <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🖼️</div>
          <p className="text-sm">Paste an image URL above to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-32 rounded border overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-sm text-gray-600">Loading image...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-red-50 border border-red-200 flex items-center justify-center">
          <div className="text-center text-red-600">
            <div className="text-xl mb-1">❌</div>
            <p className="text-xs">Failed to load image</p>
            <p className="text-xs">Check URL validity</p>
          </div>
        </div>
      )}
      
      <img
        src={url}
        alt={alt || `Preview ${index + 1}`}
        className={`w-full h-full object-cover ${loaded ? 'block' : 'hidden'}`}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {loaded && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          ✓ Loaded
        </div>
      )}
    </div>
  );
};

const CreateVenueForm = () => {
  const { createVenue, validateForm, loading, error } = useCreateVenue();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    media: [{ url: '', alt: '' }],
    price: 0,
    maxGuests: 0,
    rating: 0,
    checkoutTime: '11:00',
    cancellationPolicy: 48,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false
    },
    location: {
      address: '',
      city: '',
      zip: '',
      country: '',
      continent: '',
      lat: 0,
      lng: 0
    }
  });

  const [formErrors, setFormErrors] = useState({});
  const [successData, setSuccessData] = useState(null);
  const [policyWarning, setPolicyWarning] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Sanitize all text inputs immediately (but preserve spaces for description)
    let sanitizedValue = value;
    if (type === 'text' || type === 'url' || type === 'textarea') {
      if (name === 'description') {
        // For description, only remove the most dangerous content but preserve formatting
        sanitizedValue = value
          .replace(/[<>]/g, '') // Remove HTML tags
          .replace(/javascript:/gi, '') // Remove javascript: protocol
          .replace(/on\w+\s*=/gi, '') // Remove event handlers
          .replace(/eval\s*\(/gi, '') // Remove eval calls
          .replace(/Function\s*\(/gi, ''); // Remove Function constructor
        // Don't trim description to preserve user formatting
      } else {
        sanitizedValue = sanitizeInput(value);
      }
    }
    
    // Additional validation for URL fields
    if (type === 'url' && sanitizedValue.length > 0) {
      // Validate URL format and security
      if (!isValidUrl(sanitizedValue)) {
        setFormErrors(prev => ({
          ...prev,
          [name]: 'Please enter a valid HTTP/HTTPS URL'
        }));
        return; // Don't update state with invalid URL
      }
      
      // Check for dangerous patterns in URLs
      const dangerousPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /file:/i,
        /ftp:/i,
        /<script/i,
        /on\w+\s*=/i,
        /eval\s*\(/i,
        /Function\s*\(/i
      ];
      
      if (dangerousPatterns.some(pattern => pattern.test(sanitizedValue))) {
        setFormErrors(prev => ({
          ...prev,
          [name]: 'URL contains potentially dangerous content'
        }));
        return;
      }
      
      // Clear any previous errors for this field
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Validate text inputs for dangerous patterns (but be more lenient for description)
    if ((type === 'text' || type === 'textarea') && sanitizedValue.length > 0) {
      // For description field, only check for the most dangerous patterns
      if (name === 'description') {
        const dangerousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /eval\s*\(/i,
          /Function\s*\(/i
        ];
        
        if (dangerousPatterns.some(pattern => pattern.test(sanitizedValue))) {
          setFormErrors(prev => ({
            ...prev,
            [name]: 'Input contains invalid characters or patterns'
          }));
          return;
        }
      } else {
        // For other text fields, use the full validation
        if (!validateSearchQuery(sanitizedValue)) {
          setFormErrors(prev => ({
            ...prev,
            [name]: 'Input contains invalid characters or patterns'
          }));
          return;
        }
      }
      
      // Clear any previous errors for this field
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (name.startsWith('meta.')) {
      const metaField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaField]: type === 'checkbox' ? checked : sanitizedValue
        }
      }));
    } else if (name.startsWith('media.')) {
      const [, index, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        media: prev.media.map((item, i) => 
          i === parseInt(index) ? { ...item, [field]: sanitizedValue } : item
        )
      }));
    } else {
      // Check if user is changing default policies
      if (name === 'checkoutTime' && sanitizedValue !== '11:00') {
        setPolicyWarning(true);
      } else if (name === 'cancellationPolicy' && Number(sanitizedValue) !== 48) {
        setPolicyWarning(true);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(sanitizedValue) : sanitizedValue)
      }));
    }
  };

  // Add paste event handler for URL fields - mobile-friendly approach
  const handlePaste = (e) => {
    // For URL fields, let the paste happen naturally, then validate after
    if (e.target.type === 'url') {
      // Don't prevent default - let the paste happen
      // Use setTimeout to validate after the paste completes
      setTimeout(() => {
        const pastedValue = e.target.value;
        const fieldName = e.target.name;
        
        if (pastedValue && pastedValue.length > 0) {
          const sanitized = sanitizeInput(pastedValue);
          
          // Check for dangerous patterns
          const dangerousPatterns = [
            /javascript:/i,
            /data:/i,
            /vbscript:/i,
            /file:/i,
            /ftp:/i,
            /<script/i,
            /on\w+\s*=/i,
            /eval\s*\(/i,
            /Function\s*\(/i
          ];
          
          if (dangerousPatterns.some(pattern => pattern.test(sanitized))) {
            setFormErrors(prev => ({
              ...prev,
              [fieldName]: 'Pasted URL contains potentially dangerous content'
            }));
            e.target.value = ''; // Clear the field
            return;
          }
          
          // If it's a valid URL format, clear any errors
          if (isValidUrl(sanitized)) {
            setFormErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[fieldName];
              return newErrors;
            });
            
            // Update the sanitized value
            if (sanitized !== pastedValue) {
              e.target.value = sanitized;
            }
            
            // Trigger the change handler to update state
            const syntheticEvent = {
              target: {
                name: fieldName,
                value: sanitized,
                type: 'url'
              }
            };
            handleInputChange(syntheticEvent);
          }
        }
      }, 10); // Small delay to ensure paste completes
    }
  };

  // Handle location selection from GoogleLocationPicker
  const handleLocationSelect = (locationData) => {
    setFormData(prev => ({
      ...prev,
      location: locationData
    }));
    
    // Clear any location-related errors
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.location;
      return newErrors;
    });
  };

  const addMediaField = () => {
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, { url: '', alt: '' }]
    }));
  };

  const removeMediaField = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      media: [{ url: '', alt: '' }],
      price: 0,
      maxGuests: 0,
      rating: 0,
      checkoutTime: '11:00',
      cancellationPolicy: 48,
      meta: {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false
      },
      location: {
        address: '',
        city: '',
        zip: '',
        country: '',
        continent: '',
        lat: 0,
        lng: 0
      }
    });
    setFormErrors({});
    setSuccessData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      // Filter out empty media entries, but keep at least one if all are empty
      const cleanedMedia = formData.media.filter(item => item.url.trim() !== '');
      
      const venueData = {
        ...formData,
        media: cleanedMedia.length > 0 ? cleanedMedia : [{ url: '', alt: '' }]
      };

      const result = await createVenue(venueData);
      if (result) {
        console.log('✅ Venue created successfully:', result.name, 'ID:', result.id);
        setSuccessData(result);
        // Don't navigate immediately, let user choose
      }
    } catch (err) {
      console.error('Failed to create venue:', err);
    }
  };

  // Success state - show success message with options
  if (successData) {
    return (
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Venue Created Successfully!</h3>
          <p className="text-sm text-gray-500 mb-6">
            Your venue "{successData.name}" has been created and is now live.
            <br />
            <span className="text-xs">Note: It may take a moment for the venue to appear in your profile.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`/venue/${successData.id}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View Venue
            </button>
            <button
              onClick={() => navigate('/profile?refresh=true')}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Go to My Venues
            </button>
            <button
              onClick={() => resetForm()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Create Another Venue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per night (USD) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="1"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {formErrors.price && (
              <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {formErrors.description && (
            <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
          )}
        </div>

        {/* Max Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Guests *
          </label>
          <input
            type="number"
            name="maxGuests"
            value={formData.maxGuests}
            onChange={handleInputChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {formErrors.maxGuests && (
            <p className="mt-1 text-sm text-red-600">{formErrors.maxGuests}</p>
          )}
        </div>

        {/* Hidden Rating Field - API expects this */}
        <input
          type="hidden"
          name="rating"
          value={formData.rating}
        />

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="meta.wifi"
                checked={formData.meta.wifi}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              WiFi
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="meta.parking"
                checked={formData.meta.parking}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              Parking
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="meta.breakfast"
                checked={formData.meta.breakfast}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              Breakfast
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="meta.pets"
                checked={formData.meta.pets}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              Pets Allowed
            </label>
          </div>
        </div>

        {/* Venue Policies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Checkout Time *
            </label>
            <input
              type="time"
              name="checkoutTime"
              value={formData.checkoutTime}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Standard checkout time for guests (default: 11:00 AM)
            </p>
            {formErrors.checkoutTime && (
              <p className="mt-1 text-sm text-red-600">{formErrors.checkoutTime}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation Policy (hours) *
            </label>
            <select
              name="cancellationPolicy"
              value={formData.cancellationPolicy}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value={24}>24 hours (Flexible)</option>
              <option value={48}>48 hours (Moderate)</option>
              <option value={72}>72 hours (Strict)</option>
              <option value={168}>7 days (Very Strict)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              How far in advance guests can cancel without penalty
            </p>
            {formErrors.cancellationPolicy && (
              <p className="mt-1 text-sm text-red-600">{formErrors.cancellationPolicy}</p>
            )}
          </div>
        </div>

        {/* API Limitation Warning */}
        {policyWarning && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  API Limitation Notice
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    The Noroff API does not support custom checkout times or cancellation policies. 
                    Your venue will display the default values (Checkout: 11:00 AM, Cancel: 48h notice) 
                    regardless of your selection here.
                  </p>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setPolicyWarning(false)}
                    className="text-sm text-amber-800 hover:text-amber-900 font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Images
          </label>
          {formData.media.map((item, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
              {/* Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    name={`media.${index}.url`}
                    value={item.url}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                    placeholder="Paste image URL here (e.g., https://example.com/image.jpg)"
                    className={`w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors[`media.${index}.url`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength={2048}
                    autoComplete="off"
                    spellCheck="false"
                  />
                  {formErrors[`media.${index}.url`] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors[`media.${index}.url`]}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      name={`media.${index}.alt`}
                      value={item.alt}
                      onChange={handleInputChange}
                      placeholder="Describe the image"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {formData.media.length > 1 && (
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeMediaField(index)}
                        className="px-3 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        title="Remove this image"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Image Preview */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Preview
                </label>
                <ImagePreview 
                  url={item.url} 
                  alt={item.alt} 
                  index={index} 
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addMediaField}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
          >
            <span className="mr-2">+</span>
            Add Another Image
          </button>

        </div>

        {/* Location Picker */}
        <div>
          <LocationPicker 
            onLocationSelect={handleLocationSelect}
            initialLocation={formData.location.lat ? formData.location : null}
          />
          {formErrors.location && (
            <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Venue...' : 'Create Venue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVenueForm; 