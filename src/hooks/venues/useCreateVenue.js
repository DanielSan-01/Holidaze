import { useState } from 'react';

export const useCreateVenue = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createVenue = async (venueData) => {
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      const apiKey = localStorage.getItem('apiKey');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');

      console.log('🚀 Creating venue with data:', venueData);
      console.log('🔑 Auth data:', { 
        hasToken: !!accessToken, 
        hasApiKey: !!apiKey,
        userName: userData.name 
      });

      const res = await fetch('https://v2.api.noroff.dev/holidaze/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Noroff-API-Key': `${apiKey}`,
        },
        body: JSON.stringify(venueData)
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('❌ Failed to create venue', data);
        throw new Error(data.errors?.map(error => error.message).join(', ') || 'Failed to create venue');
      }

      console.log('✅ Successfully created venue:', data.data);
      console.log('🏠 Venue owner:', data.data.owner);
      console.log('🆔 Venue ID:', data.data.id);
      setLoading(false);
      return data.data;
    } catch (error) {
      console.error('❌ Failed to create venue', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = 'Venue name is required';
    }

    if (!formData.description?.trim()) {
      errors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (formData.maxGuests < 0) {
      errors.maxGuests = 'Max guests cannot be negative';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      errors.rating = 'Rating must be between 0 and 5';
    }

    // Validate checkout time
    if (!formData.checkoutTime) {
      errors.checkoutTime = 'Checkout time is required';
    } else {
      // Validate time format (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.checkoutTime)) {
        errors.checkoutTime = 'Please enter a valid time (HH:MM format)';
      }
    }

    // Validate cancellation policy
    if (!formData.cancellationPolicy) {
      errors.cancellationPolicy = 'Cancellation policy is required';
    } else {
      const validPolicies = [24, 48, 72, 168];
      if (!validPolicies.includes(parseInt(formData.cancellationPolicy))) {
        errors.cancellationPolicy = 'Please select a valid cancellation policy';
      }
    }

    // Validate media URLs
    if (formData.media) {
      formData.media.forEach((item, index) => {
        if (item.url && !isValidUrl(item.url)) {
          errors[`media.${index}.url`] = 'We really recommend you at least have 1 photo of your venue to attract customers.';
        }
      });
    }

    return errors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return {
    createVenue,
    validateForm,
    loading,
    error
  };
}; 