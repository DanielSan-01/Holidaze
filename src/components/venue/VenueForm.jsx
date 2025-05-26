import React, { useState, useEffect } from 'react';
import LocationPicker from '../../pages/create/LocationPicker';
import ImageManager from './ImageManager';

const VenueForm = ({ 
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  submitText = 'Submit',
  cancelText = 'Cancel',
  mode = 'create' // 'create' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    media: mode === 'create' ? [{ url: '', alt: '' }] : [],
    price: 0,
    maxGuests: 0,
    rating: 0,
    checkoutTime: '11:00',
    cancellationPolicy: 48,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: '',
      city: '',
      zip: '',
      country: '',
      continent: '',
      lat: 0,
      lng: 0,
    },
  });

  const [errors, setErrors] = useState({});
  const [policyWarning, setPolicyWarning] = useState(false);

  // Pre-fill form with initial data (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        media: initialData.media || [],
        price: initialData.price || 0,
        maxGuests: initialData.maxGuests || 0,
        rating: initialData.rating || 0,
        checkoutTime: initialData.checkoutTime || '11:00',
        cancellationPolicy: initialData.cancellationPolicy || 48,
        meta: {
          wifi: initialData.meta?.wifi || false,
          parking: initialData.meta?.parking || false,
          breakfast: initialData.meta?.breakfast || false,
          pets: initialData.meta?.pets || false,
        },
        location: {
          address: initialData.location?.address || '',
          city: initialData.location?.city || '',
          zip: initialData.location?.zip || '',
          country: initialData.location?.country || '',
          continent: initialData.location?.continent || '',
          lat: initialData.location?.lat || 0,
          lng: initialData.location?.lng || 0,
        },
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error when user starts typing - do this FIRST and separately
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Check HTML5 validity for time inputs
    if (type === 'time' && !e.target.validity.valid) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Please enter a valid time'
      }));
      return;
    }
    
    // Update form data
    if (name.startsWith('meta.')) {
      const metaField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaField]: checked
        }
      }));
    } else {
      // Check if user is changing default policies
      if (name === 'checkoutTime' && value !== '11:00') {
        setPolicyWarning(true);
      } else if (name === 'cancellationPolicy' && Number(value) !== 48) {
        setPolicyWarning(true);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
      }));
    }
  };

  const handleLocationChange = (location) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
    
    // Clear location errors
    if (errors.location) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.location;
        return newErrors;
      });
    }
  };

  const handleMediaChange = (newMedia) => {
    setFormData(prev => ({
      ...prev,
      media: newMedia
    }));
  };

  const handleMediaErrorChange = (newErrors) => {
    console.log('Media error change - New errors:', newErrors);
    setErrors(prev => {
      const updated = {
        ...prev,
        ...newErrors
      };
      console.log('Media error change - Updated errors:', updated);
      return updated;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Venue name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.maxGuests < 0) {
      newErrors.maxGuests = 'Max guests cannot be negative';
    }

    // Validate checkout time (HTML5 time input handles format validation)
    if (!formData.checkoutTime) {
      newErrors.checkoutTime = 'Please enter a valid time';
    }

    // Validate cancellation policy
    if (!formData.cancellationPolicy) {
      newErrors.cancellationPolicy = 'Cancellation policy is required';
    } else {
      const validPolicies = [24, 48, 72, 168];
      if (!validPolicies.includes(parseInt(formData.cancellationPolicy))) {
        newErrors.cancellationPolicy = 'Please select a valid cancellation policy';
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    // Merge validation errors with existing errors (like media errors)
    // Put validationErrors first so existing errors (like media errors) take precedence
    const allErrors = { ...validationErrors, ...errors };
    
    console.log('Submit - Current errors:', errors);
    console.log('Submit - Validation errors:', validationErrors);
    console.log('Submit - All errors:', allErrors);
    
    // Only block submission for critical errors (not media errors)
    const criticalErrors = Object.keys(allErrors).filter(key => !key.startsWith('media'));
    if (criticalErrors.length > 0) {
      setErrors(allErrors);
      return;
    }

    // For create mode, filter out empty media entries
    let finalData = { ...formData };
    if (mode === 'create') {
      const cleanedMedia = formData.media.filter(item => item.url.trim() !== '');
      finalData = {
        ...formData,
        media: cleanedMedia.length > 0 ? cleanedMedia : [{ url: '', alt: '' }]
      };
    }

    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Venue Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter venue name"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price per night *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
            min="1"
            required
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="4"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe your venue..."
          required
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Guests *
        </label>
        <input
          type="number"
          id="maxGuests"
          name="maxGuests"
          value={formData.maxGuests}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.maxGuests ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="0"
          min="0"
          required
        />
        {errors.maxGuests && <p className="text-red-500 text-sm mt-1">{errors.maxGuests}</p>}
      </div>

      {/* Hidden Rating Field - API expects this for create mode */}
      {mode === 'create' && (
        <input
          type="hidden"
          name="rating"
          value={formData.rating}
        />
      )}

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'wifi', label: 'WiFi', icon: '📶' },
            { key: 'parking', label: 'Parking', icon: '🅿️' },
            { key: 'breakfast', label: 'Breakfast', icon: '🥐' },
            { key: 'pets', label: 'Pets Allowed', icon: '🐕' },
          ].map((amenity) => (
            <label key={amenity.key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name={`meta.${amenity.key}`}
                checked={formData.meta[amenity.key]}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">
                {amenity.icon} {amenity.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Venue Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="checkoutTime" className="block text-sm font-medium text-gray-700 mb-2">
            Checkout Time *
          </label>
          <input
            type="time"
            id="checkoutTime"
            name="checkoutTime"
            value={formData.checkoutTime}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.checkoutTime ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Standard checkout time for guests
          </p>
          {errors.checkoutTime && <p className="text-red-500 text-sm mt-1">{errors.checkoutTime}</p>}
        </div>

        <div>
          <label htmlFor="cancellationPolicy" className="block text-sm font-medium text-gray-700 mb-2">
            Cancellation Policy (hours) *
          </label>
          <select
            id="cancellationPolicy"
            name="cancellationPolicy"
            value={formData.cancellationPolicy}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cancellationPolicy ? 'border-red-500' : 'border-gray-300'
            }`}
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
          {errors.cancellationPolicy && <p className="text-red-500 text-sm mt-1">{errors.cancellationPolicy}</p>}
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

      {/* Location */}
      <LocationPicker
        onLocationSelect={handleLocationChange}
        initialLocation={formData.location}
      />
      {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}

      {/* Media */}
      <ImageManager
        media={formData.media}
        onMediaChange={handleMediaChange}
        errors={errors}
        onErrorChange={handleMediaErrorChange}
        variant={mode}
      />

      {/* Form Validation Errors - Show at bottom where user submits */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : submitText}
        </button>
      </div>
    </form>
  );
};

export default VenueForm; 