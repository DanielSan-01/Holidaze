import { useState, useEffect } from 'react';
import LocationPicker from './LocationPicker.jsx';

export default function EditVenueForm({ venue, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    media: [],
    price: 0,
    maxGuests: 0,
    rating: 0,
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
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaAlt, setNewMediaAlt] = useState('');

  // Pre-fill form with venue data
  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name || '',
        description: venue.description || '',
        media: venue.media || [],
        price: venue.price || 0,
        maxGuests: venue.maxGuests || 0,
        rating: venue.rating || 0,
        meta: {
          wifi: venue.meta?.wifi || false,
          parking: venue.meta?.parking || false,
          breakfast: venue.meta?.breakfast || false,
          pets: venue.meta?.pets || false,
        },
        location: {
          address: venue.location?.address || '',
          city: venue.location?.city || '',
          zip: venue.location?.zip || '',
          country: venue.location?.country || '',
          continent: venue.location?.continent || '',
          lat: venue.location?.lat || 0,
          lng: venue.location?.lng || 0,
        },
      });
    }
  }, [venue]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
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
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLocationChange = (location) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  };

  const addMedia = () => {
    if (newMediaUrl.trim()) {
      const newMedia = {
        url: newMediaUrl.trim(),
        alt: newMediaAlt.trim() || 'Venue image'
      };
      
      setFormData(prev => ({
        ...prev,
        media: [...prev.media, newMedia]
      }));
      
      setNewMediaUrl('');
      setNewMediaAlt('');
    }
  };

  const removeMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
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

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
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
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-1">
          Maximum Guests
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
        />
        {errors.maxGuests && <p className="text-red-500 text-sm mt-1">{errors.maxGuests}</p>}
      </div>

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

      {/* Location */}
      <LocationPicker
        onLocationSelect={handleLocationChange}
        initialLocation={formData.location}
      />

      {/* Media */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Images</label>
        
        {/* Existing Media */}
        {formData.media.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {formData.media.map((item, index) => (
              <div key={index} className="relative border rounded-lg p-3">
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-32 object-cover rounded mb-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <p className="text-sm text-gray-600 mb-2">{item.alt}</p>
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Media */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="url"
              value={newMediaUrl}
              onChange={(e) => setNewMediaUrl(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Image URL"
            />
            <input
              type="text"
              value={newMediaAlt}
              onChange={(e) => setNewMediaAlt(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Image description"
            />
            <button
              type="button"
              onClick={addMedia}
              disabled={!newMediaUrl.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Image
            </button>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
} 