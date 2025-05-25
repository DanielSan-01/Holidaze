import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/auth';
import { useProfile } from '../hooks/profile';
import { useNavigate, Link } from 'react-router-dom';
import { PlaneLoader } from '../components/loader';

export default function EditProfile() {
  const { user } = useAuth();
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bio: '',
    venueManager: false,
    avatar: {
      url: '',
      alt: ''
    },
    banner: {
      url: '',
      alt: ''
    }
  });
  
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.name) {
      fetchProfile(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        venueManager: profile.venueManager || false,
        avatar: {
          url: profile.avatar?.url || '',
          alt: profile.avatar?.alt || ''
        },
        banner: {
          url: profile.banner?.url || '',
          alt: profile.banner?.alt || ''
        }
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateUrls = () => {
    const urlPattern = /^https?:\/\/.+/;
    
    if (formData.avatar.url && !urlPattern.test(formData.avatar.url)) {
      return 'Avatar URL must be a valid HTTP/HTTPS URL';
    }
    
    if (formData.banner.url && !urlPattern.test(formData.banner.url)) {
      return 'Banner URL must be a valid HTTP/HTTPS URL';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validate URLs
    const urlError = validateUrls();
    if (urlError) {
      setFormError(urlError);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Only send fields that have values
      const updateData = {};
      
      if (formData.bio.trim()) {
        updateData.bio = formData.bio.trim();
      }
      
      updateData.venueManager = formData.venueManager;
      
      if (formData.avatar.url.trim()) {
        updateData.avatar = {
          url: formData.avatar.url.trim(),
          alt: formData.avatar.alt.trim() || ''
        };
      }
      
      if (formData.banner.url.trim()) {
        updateData.banner = {
          url: formData.banner.url.trim(),
          alt: formData.banner.alt.trim() || ''
        };
      }

      await updateProfile(user.name, updateData);
      navigate('/profile');
    } catch (err) {
      setFormError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <PlaneLoader 
          text="Loading profile editor..." 
          size={90}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-red-600 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <Link
            to="/profile"
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Profile
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Venue Manager */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="venueManager"
                checked={formData.venueManager}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                I am a venue manager
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Check this if you want to manage venues on the platform
            </p>
          </div>

          {/* Avatar */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Avatar</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="avatar.url" className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  id="avatar.url"
                  name="avatar.url"
                  value={formData.avatar.url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div>
                <label htmlFor="avatar.alt" className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar Alt Text
                </label>
                <input
                  type="text"
                  id="avatar.alt"
                  name="avatar.alt"
                  value={formData.avatar.alt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description of avatar image"
                />
              </div>
              {formData.avatar.url && (
                <div>
                  <p className="text-sm text-gray-700 mb-2">Preview:</p>
                  <img
                    src={formData.avatar.url}
                    alt={formData.avatar.alt}
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Banner */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Banner</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="banner.url" className="block text-sm font-medium text-gray-700 mb-1">
                  Banner URL
                </label>
                <input
                  type="url"
                  id="banner.url"
                  name="banner.url"
                  value={formData.banner.url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
              <div>
                <label htmlFor="banner.alt" className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Alt Text
                </label>
                <input
                  type="text"
                  id="banner.alt"
                  name="banner.alt"
                  value={formData.banner.alt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description of banner image"
                />
              </div>
              {formData.banner.url && (
                <div>
                  <p className="text-sm text-gray-700 mb-2">Preview:</p>
                  <img
                    src={formData.banner.url}
                    alt={formData.banner.alt}
                    className="w-full h-32 object-cover rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {formError && (
            <div className="text-red-600 text-sm">
              {formError}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </button>
            <Link
              to="/profile"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 