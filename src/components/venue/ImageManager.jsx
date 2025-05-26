import React, { useState } from 'react';
import { isValidUrl } from '../../utils/security.js';

// Image Preview Component
const ImagePreview = ({ url, alt, index, showLoadingState = true }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {
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
      {showLoadingState && loading && (
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
      
      {loaded && showLoadingState && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          ✓ Loaded
        </div>
      )}
    </div>
  );
};

const ImageManager = ({ 
  media = [], 
  onMediaChange, 
  errors = {},
  onErrorChange,
  variant = 'create' // 'create' or 'edit'
}) => {
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaAlt, setNewMediaAlt] = useState('');

  const validateUrl = (url) => {
    if (!url.trim()) {
      return 'Image URL is required';
    }
    
    if (!isValidUrl(url)) {
      return 'Please enter a valid HTTP/HTTPS URL';
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
    
    if (dangerousPatterns.some(pattern => pattern.test(url))) {
      return 'URL contains potentially dangerous content';
    }
    
    return null;
  };

  const addMedia = () => {
    const trimmedUrl = newMediaUrl.trim();
    const validationError = validateUrl(trimmedUrl);
    
    if (validationError) {
      onErrorChange({ ...errors, mediaUrl: validationError });
      return;
    }
    
    const newMedia = {
      url: trimmedUrl,
      alt: newMediaAlt.trim() || 'Venue image'
    };
    
    onMediaChange([...media, newMedia]);
    
    setNewMediaUrl('');
    setNewMediaAlt('');
    
    // Clear any previous errors
    const newErrors = { ...errors };
    delete newErrors.mediaUrl;
    onErrorChange(newErrors);
  };

  const removeMedia = (index) => {
    onMediaChange(media.filter((_, i) => i !== index));
  };

  const clearMediaError = () => {
    if (errors.mediaUrl) {
      const newErrors = { ...errors };
      delete newErrors.mediaUrl;
      onErrorChange(newErrors);
    }
  };

  if (variant === 'create') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Images
        </label>
        {media.map((item, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
            {/* Input fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={item.url}
                  onChange={(e) => {
                    const newMedia = [...media];
                    newMedia[index] = { ...newMedia[index], url: e.target.value };
                    onMediaChange(newMedia);
                  }}
                  placeholder="Paste image URL here (e.g., https://example.com/image.jpg)"
                  className={`w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors[`media.${index}.url`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={2048}
                  autoComplete="off"
                  spellCheck="false"
                />
                {errors[`media.${index}.url`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`media.${index}.url`]}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={item.alt}
                    onChange={(e) => {
                      const newMedia = [...media];
                      newMedia[index] = { ...newMedia[index], alt: e.target.value };
                      onMediaChange(newMedia);
                    }}
                    placeholder="Describe the image"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {media.length > 1 && (
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
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
          onClick={() => onMediaChange([...media, { url: '', alt: '' }])}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
        >
          <span className="mr-2">+</span>
          Add Another Image
        </button>
      </div>
    );
  }

  // Edit variant
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Images</label>
      
      {/* Existing Media */}
      {media.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {media.map((item, index) => (
            <div key={index} className="relative border rounded-lg p-3">
              <div className="relative w-full h-32 rounded overflow-hidden mb-2">
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                  onLoad={(e) => {
                    e.target.style.display = 'block';
                    e.target.nextSibling.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gray-100 border border-gray-200 flex items-center justify-center" style={{display: 'none'}}>
                  <div className="text-center text-gray-500">
                    <div className="text-xl mb-1">🖼️</div>
                    <p className="text-xs">Image not available</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{item.alt || 'No description'}</p>
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Media */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Image</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <input
              type="url"
              value={newMediaUrl}
              onChange={(e) => {
                setNewMediaUrl(e.target.value);
                clearMediaError();
              }}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                errors.mediaUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.mediaUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.mediaUrl}</p>
            )}
          </div>
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Image
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Paste a valid image URL (must start with http:// or https://)
        </p>
        
        {/* Preview new image URL */}
        {newMediaUrl.trim() && isValidUrl(newMediaUrl.trim()) && (
          <div className="mt-3">
            <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
            <ImagePreview 
              url={newMediaUrl.trim()} 
              alt="Preview" 
              index={0} 
              showLoadingState={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageManager; 