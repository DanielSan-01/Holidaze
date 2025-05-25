import { sanitizeInput, isValidUrl, isValidPrice, isValidGuestCount } from './security.js';

/**
 * Comprehensive venue form validation with security checks
 */
export const validateForm = (formData) => {
  const errors = {};

  // Validate venue name
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Venue name is required';
  } else if (formData.name.length < 2) {
    errors.name = 'Venue name must be at least 2 characters';
  } else if (formData.name.length > 100) {
    errors.name = 'Venue name must be less than 100 characters';
  }

  // Validate description
  if (!formData.description || !formData.description.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (formData.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  // Validate price
  if (!isValidPrice(formData.price)) {
    errors.price = 'Price must be a valid number between 0 and 10,000';
  }

  // Validate max guests
  if (!isValidGuestCount(formData.maxGuests)) {
    errors.maxGuests = 'Maximum guests must be between 1 and 50';
  }

  // Validate media URLs
  if (formData.media && Array.isArray(formData.media)) {
    formData.media.forEach((item, index) => {
      if (item.url && item.url.trim()) {
        if (!isValidUrl(item.url)) {
          errors[`media.${index}.url`] = 'Please enter a valid HTTP/HTTPS URL';
        }
      }
    });
  }

  // Validate location
  if (!formData.location || !formData.location.city || !formData.location.country) {
    errors.location = 'Please select a valid location';
  }

  return errors;
};

/**
 * Sanitize venue data before submission
 */
export const sanitizeVenueData = (formData) => {
  return {
    ...formData,
    name: sanitizeInput(formData.name),
    description: sanitizeInput(formData.description),
    media: formData.media?.map(item => ({
      url: sanitizeInput(item.url),
      alt: sanitizeInput(item.alt)
    })) || [],
    location: {
      ...formData.location,
      address: sanitizeInput(formData.location?.address || ''),
      city: sanitizeInput(formData.location?.city || ''),
      country: sanitizeInput(formData.location?.country || '')
    }
  };
}; 