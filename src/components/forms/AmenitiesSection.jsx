export default function AmenitiesSection({ meta, onChange, className = "space-y-4" }) {
  const amenities = [
    { key: 'wifi', label: 'WiFi', icon: '📶' },
    { key: 'parking', label: 'Parking', icon: '🚗' },
    { key: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { key: 'pets', label: 'Pets Allowed', icon: '🐕' }
  ];

  const handleAmenityChange = (amenityKey, checked) => {
    onChange({
      ...meta,
      [amenityKey]: checked
    });
  };

  return (
    <div className={className}>
      <h3 className="text-lg font-medium text-gray-900 mb-3">Amenities</h3>
      <div className="grid grid-cols-2 gap-4">
        {amenities.map(({ key, label, icon }) => (
          <label key={key} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={meta[key] || false}
              onChange={(e) => handleAmenityChange(key, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              {icon} {label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
} 