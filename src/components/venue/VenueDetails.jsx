import { VenueMap } from './index';

export default function VenueDetails({ venue }) {
  return (
    <div className="lg:col-span-2 flex flex-col">
      {/* Location */}
      {venue.location && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <p className="text-gray-700">
            {[venue.location.address, venue.location.city, venue.location.country]
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>
      )}

      {/* Amenities */}
      {venue.meta && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {venue.meta.wifi && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">📶 WiFi</span>}
            {venue.meta.parking && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">🚗 Parking</span>}
            {venue.meta.breakfast && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">🍳 Breakfast</span>}
            {venue.meta.pets && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">🐾 Pets</span>}
          </div>
        </div>
      )}



      {/* Owner */}
      {venue.owner && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Hosted by</h2>
          <div className="flex items-center gap-3">
            {venue.owner.avatar?.url && (
              <img
                src={venue.owner.avatar.url}
                alt={venue.owner.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-medium">{venue.owner.name}</p>
              {venue.owner.bio && <p className="text-gray-600 text-sm">{venue.owner.bio}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Map Section - Flexible height that adapts to available space */}
      {venue.location && (
        <div className="flex-1 flex flex-col min-h-0">
          <h2 className="text-xl font-semibold mb-2">Map</h2>
          <VenueMap venue={venue} height="flex-1 min-h-80" />
        </div>
      )}
    </div>
  );
} 