import React, { useState } from 'react';

export default function ApiKeyModal({ isOpen, onClose, onSave }) {
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }

    localStorage.setItem('apiKey', apiKey.trim());
    if (onSave) onSave(apiKey.trim());
    onClose();
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">API Key Required</h2>
        
        <p className="text-gray-600 mb-4">
          To access profile features, you need to provide your Noroff API key. 
          You can get this from your Noroff API dashboard.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Noroff API key..."
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
            >
              Save API Key
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
          <strong>Note:</strong> Your API key will be stored locally in your browser. 
          You can update it anytime through your profile settings.
        </div>
      </div>
    </div>
  );
} 