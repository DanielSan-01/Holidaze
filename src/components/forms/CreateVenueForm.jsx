import React, { useState } from 'react';
import { useVenues } from '../../hooks/venues/useVenues';
import { useNavigate } from 'react-router-dom';
import SimpleLocationPicker from './SimpleLocationPicker';

const CreateVenueForm = () => {
  const { createVenue, loading, error } = useVenues();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    media: [{ url: '', alt: '' }],
    price: 0,
    maxGuests: 1,
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('meta.')) {
      const metaField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaField]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('media.')) {
      const [, index, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        media: prev.media.map((item, i) => 
          i === parseInt(index) ? { ...item, [field]: value } : item
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
      }));
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

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Venue name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (formData.maxGuests <= 0) {
      errors.maxGuests = 'Max guests must be at least 1';
    }

    if (!formData.location.lat || !formData.location.lng) {
      errors.location = 'Please select a location on the map';
    }

    // Validate media URLs
    formData.media.forEach((item, index) => {
      if (item.url && !isValidUrl(item.url)) {
        errors[`media.${index}.url`] = 'Please enter a valid image URL';
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Filter out empty media entries
      const cleanedMedia = formData.media.filter(item => item.url.trim() !== '');
      
      const venueData = {
        ...formData,
        media: cleanedMedia.length > 0 ? cleanedMedia : undefined
      };

      const result = await createVenue(venueData);
      if (result) {
        navigate(`/venue/${result.id}`);
      }
    } catch (err) {
      console.error('Failed to create venue:', err);
    }
  };

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
            min="1"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {formErrors.maxGuests && (
            <p className="mt-1 text-sm text-red-600">{formErrors.maxGuests}</p>
          )}
        </div>

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

        {/* Media */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Images
          </label>
          {formData.media.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-gray-200 rounded">
              <div className="md:col-span-2">
                <input
                  type="url"
                  name={`media.${index}.url`}
                  value={item.url}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {formErrors[`media.${index}.url`] && (
                  <p className="mt-1 text-sm text-red-600">{formErrors[`media.${index}.url`]}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name={`media.${index}.alt`}
                  value={item.alt}
                  onChange={handleInputChange}
                  placeholder="Alt text"
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.media.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMediaField(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addMediaField}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            + Add Image
          </button>
        </div>

        {/* Location Picker */}
        <div>
          <SimpleLocationPicker 
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