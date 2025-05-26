import { useState, useEffect } from 'react';

export default function ImageUrlField({ 
  label, 
  value, 
  onChange, 
  placeholder = "Enter image URL...",
  error,
  required = false 
}) {
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);

  useEffect(() => {
    if (value?.url && value.url.trim()) {
      setPreviewLoading(true);
      setPreviewError(false);
      setPreviewLoaded(false);
    } else {
      setPreviewLoading(false);
      setPreviewError(false);
      setPreviewLoaded(false);
    }
  }, [value?.url]);

  const handleImageLoad = () => {
    setPreviewLoading(false);
    setPreviewError(false);
    setPreviewLoaded(true);
  };

  const handleImageError = () => {
    setPreviewLoading(false);
    setPreviewError(true);
    setPreviewLoaded(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="space-y-3">
        {/* URL Input */}
        <input
          type="url"
          value={value?.url || ''}
          onChange={(e) => onChange({ ...value, url: e.target.value })}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        
        {/* Alt Text Input */}
        <input
          type="text"
          value={value?.alt || ''}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
          placeholder="Alt text (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        
        {/* Image Preview */}
        <div className="relative w-full h-32 rounded border overflow-hidden">
          {!value?.url || !value.url.trim() ? (
            <div className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-2xl mb-2">🖼️</div>
                <p className="text-sm">Enter URL above to see preview</p>
              </div>
            </div>
          ) : (
            <>
              {previewLoading && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Loading preview...</span>
                  </div>
                </div>
              )}
              
              {previewError && (
                <div className="absolute inset-0 bg-red-50 border border-red-200 flex items-center justify-center">
                  <div className="text-center text-red-600">
                    <div className="text-xl mb-1">❌</div>
                    <p className="text-xs">Failed to load image</p>
                    <p className="text-xs">Check URL validity</p>
                  </div>
                </div>
              )}
              
              <img
                src={value.url}
                alt={value.alt || 'Preview'}
                className={`w-full h-full object-cover ${previewLoaded ? 'block' : 'hidden'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              
              {previewLoaded && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  ✓ Loaded
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 