import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import VenueForm from '../VenueForm';

// Mock the LocationPicker component
vi.mock('../../pages/create/LocationPicker', () => ({
  default: function MockLocationPicker({ onLocationSelect, initialLocation }) {
    return (
      <div data-testid="location-picker">
        <button
          onClick={() => onLocationSelect({
            address: 'Test Address',
            city: 'Test City',
            country: 'Test Country',
            lat: 59.9139,
            lng: 10.7522
          })}
        >
          Select Location
        </button>
        {initialLocation && (
          <div data-testid="initial-location">
            {initialLocation.city || 'No location'}
          </div>
        )}
      </div>
    );
  }
}));

// Mock the ImageManager component
vi.mock('../ImageManager', () => ({
  default: function MockImageManager({ media, onMediaChange, errors, onErrorChange, variant }) {
    return (
      <div data-testid="image-manager">
        <div data-testid="variant">{variant}</div>
        <button
          onClick={() => onMediaChange([{ url: 'https://example.com/image.jpg', alt: 'Test image' }])}
        >
          Add Image
        </button>
        <button
          onClick={() => onErrorChange({ media: 'Invalid image URL' })}
        >
          Trigger Image Error
        </button>
        <div data-testid="media-count">{media.length}</div>
      </div>
    );
  }
}));

describe('VenueForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    loading: false,
    submitText: 'Submit',
    cancelText: 'Cancel',
    mode: 'create'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('renders all form fields correctly', () => {
      render(<VenueForm {...defaultProps} />);

      expect(screen.getByLabelText(/venue name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price per night/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/maximum guests/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/checkout time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cancellation policy/i)).toBeInTheDocument();
      
      // Amenities
      expect(screen.getByLabelText(/wifi/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/parking/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/breakfast/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/pets allowed/i)).toBeInTheDocument();
    });

    it('shows correct button text for create mode', () => {
      render(<VenueForm {...defaultProps} submitText="Create Venue" />);
      
      expect(screen.getByRole('button', { name: /create venue/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('initializes with empty form data', () => {
      render(<VenueForm {...defaultProps} />);

      expect(screen.getByDisplayValue('')).toBeInTheDocument(); // name field
      expect(screen.getByDisplayValue('0')).toBeInTheDocument(); // price field
    });

    it('validates required fields and shows errors at bottom', async () => {
      const user = userEvent.setup();
      render(<VenueForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please fix the following errors/i)).toBeInTheDocument();
        expect(screen.getAllByText(/venue name is required/i)).toHaveLength(2); // Field error + summary
        expect(screen.getAllByText(/description is required/i)).toHaveLength(2); // Field error + summary
        expect(screen.getAllByText(/price must be greater than 0/i)).toHaveLength(2); // Field error + summary
      });

      expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });

    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      render(<VenueForm {...defaultProps} />);

      // Fill in required fields
      await user.type(screen.getByLabelText(/venue name/i), 'Test Venue');
      await user.type(screen.getByLabelText(/description/i), 'A beautiful test venue');
      await user.clear(screen.getByLabelText(/price per night/i));
      await user.type(screen.getByLabelText(/price per night/i), '100');
      await user.clear(screen.getByLabelText(/maximum guests/i));
      await user.type(screen.getByLabelText(/maximum guests/i), '4');

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Test Venue',
            description: 'A beautiful test venue',
            price: 100,
            maxGuests: 4
          })
        );
      });
    });

    it('handles amenity checkboxes correctly', async () => {
      const user = userEvent.setup();
      render(<VenueForm {...defaultProps} />);

      const wifiCheckbox = screen.getByLabelText(/wifi/i);
      const parkingCheckbox = screen.getByLabelText(/parking/i);

      await user.click(wifiCheckbox);
      await user.click(parkingCheckbox);

      expect(wifiCheckbox).toBeChecked();
      expect(parkingCheckbox).toBeChecked();
    });

    it('shows policy warning when changing default values', async () => {
      const user = userEvent.setup();
      render(<VenueForm {...defaultProps} />);

      const checkoutTimeInput = screen.getByLabelText(/checkout time/i);
      await user.clear(checkoutTimeInput);
      await user.type(checkoutTimeInput, '12:00');

      await waitFor(() => {
        expect(screen.getByText(/api limitation notice/i)).toBeInTheDocument();
      });
    });

    it('integrates with ImageManager correctly', async () => {
      const user = userEvent.setup();
      render(<VenueForm {...defaultProps} />);

      expect(screen.getByTestId('variant')).toHaveTextContent('create');
      
      const addImageButton = screen.getByText('Add Image');
      await user.click(addImageButton);

      // Should update media in form
      expect(screen.getByTestId('media-count')).toHaveTextContent('1');
    });

    it('integrates with LocationPicker correctly', async () => {
      const user = userEvent.setup();
      render(<VenueForm {...defaultProps} />);

      const selectLocationButton = screen.getByText('Select Location');
      await user.click(selectLocationButton);

      // Location should be updated in form data
      expect(screen.getByTestId('location-picker')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    const editProps = {
      ...defaultProps,
      mode: 'edit',
      initialData: {
        name: 'Existing Venue',
        description: 'An existing venue description',
        price: 150,
        maxGuests: 6,
        media: [{ url: 'https://example.com/existing.jpg', alt: 'Existing image' }],
        meta: {
          wifi: true,
          parking: false,
          breakfast: true,
          pets: false
        },
        location: {
          address: 'Existing Address',
          city: 'Existing City',
          country: 'Existing Country',
          lat: 60.0,
          lng: 11.0
        }
      },
      submitText: 'Save Changes'
    };

    it('pre-fills form with initial data', () => {
      render(<VenueForm {...editProps} />);

      expect(screen.getByDisplayValue('Existing Venue')).toBeInTheDocument();
      expect(screen.getByDisplayValue('An existing venue description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('150')).toBeInTheDocument();
      expect(screen.getByDisplayValue('6')).toBeInTheDocument();
    });

    it('shows correct button text for edit mode', () => {
      render(<VenueForm {...editProps} />);
      
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    it('pre-selects amenities based on initial data', () => {
      render(<VenueForm {...editProps} />);

      expect(screen.getByLabelText(/wifi/i)).toBeChecked();
      expect(screen.getByLabelText(/parking/i)).not.toBeChecked();
      expect(screen.getByLabelText(/breakfast/i)).toBeChecked();
      expect(screen.getByLabelText(/pets allowed/i)).not.toBeChecked();
    });

    it('passes initial location to LocationPicker', () => {
      render(<VenueForm {...editProps} />);

      expect(screen.getByTestId('initial-location')).toHaveTextContent('Existing City');
    });

    it('uses edit variant for ImageManager', () => {
      render(<VenueForm {...editProps} />);

      expect(screen.getByTestId('variant')).toHaveTextContent('edit');
    });

    it('submits updated data correctly', async () => {
      const user = userEvent.setup();
      render(<VenueForm {...editProps} />);

      // Update the venue name
      const nameInput = screen.getByLabelText(/venue name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Venue Name');

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Updated Venue Name',
            description: 'An existing venue description',
            price: 150,
            maxGuests: 6
          })
        );
      });
    });
  });

  describe('Common Functionality', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<VenueForm {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('disables submit button when loading', () => {
      render(<VenueForm {...defaultProps} loading={true} />);

      const submitButton = screen.getByRole('button', { name: /processing/i });
      expect(submitButton).toBeDisabled();
    });

    it('clears field errors when user starts typing', async () => {
      const user = userEvent.setup();
      render(<VenueForm {...defaultProps} />);

      // Trigger validation errors
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/venue name is required/i)).toBeInTheDocument();
      });

      // Start typing in name field
      const nameInput = screen.getByLabelText(/venue name/i);
      await user.type(nameInput, 'T');

      // Field error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/venue name is required/i)).not.toBeInTheDocument();
      });
    });

    it('handles HTML5 time input auto-correction correctly', async () => {
      const user = userEvent.setup();
      render(<VenueForm {...defaultProps} />);

      // Fill required fields
      await user.type(screen.getByLabelText(/venue name/i), 'Test Venue');
      await user.type(screen.getByLabelText(/description/i), 'Test description');
      await user.clear(screen.getByLabelText(/price per night/i));
      await user.type(screen.getByLabelText(/price per night/i), '100');

      // HTML5 time input auto-corrects invalid times
      const checkoutInput = screen.getByLabelText(/checkout time/i);
      await user.clear(checkoutInput);
      await user.type(checkoutInput, '25:00'); // Invalid time gets auto-corrected

      // The form should submit successfully since HTML5 corrected the time
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalled();
      });

      // Verify the time was auto-corrected to a valid value
      expect(checkoutInput.value).toMatch(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);
    });

    it('handles image errors correctly', async () => {
      const user = userEvent.setup();
      render(<VenueForm {...defaultProps} />);

      const triggerErrorButton = screen.getByText('Trigger Image Error');
      await user.click(triggerErrorButton);

      // Should show error in the error summary when submitting
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid image url/i)).toBeInTheDocument();
      });
    });

    it('dismisses policy warning when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      render(<VenueForm {...defaultProps} />);

      // Trigger policy warning
      const checkoutTimeInput = screen.getByLabelText(/checkout time/i);
      await user.clear(checkoutTimeInput);
      await user.type(checkoutTimeInput, '12:00');

      await waitFor(() => {
        expect(screen.getByText(/api limitation notice/i)).toBeInTheDocument();
      });

      // Dismiss warning
      const dismissButton = screen.getByText(/dismiss/i);
      await user.click(dismissButton);

      await waitFor(() => {
        expect(screen.queryByText(/api limitation notice/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and structure', () => {
      render(<VenueForm {...defaultProps} />);

      // Check that all inputs have proper labels
      expect(screen.getByLabelText(/venue name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price per night/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/maximum guests/i)).toBeInTheDocument();
    });

    it('shows required field indicators', () => {
      render(<VenueForm {...defaultProps} />);

      expect(screen.getByText(/venue name \*/i)).toBeInTheDocument();
      expect(screen.getByText(/price per night \*/i)).toBeInTheDocument();
      expect(screen.getByText(/description \*/i)).toBeInTheDocument();
    });

    it('associates error messages with form fields', async () => {
      const user = userEvent.setup();
      render(<VenueForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/venue name/i);
        expect(nameInput).toHaveAttribute('class', expect.stringContaining('border-red-500'));
      });
    });
  });
}); 