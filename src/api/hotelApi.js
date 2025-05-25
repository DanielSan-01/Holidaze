const API_URL = "https://v2.api.noroff.dev/holidaze/venues";

export async function fetchHotels() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        // Adapt the data to match HotelCard's expected structure
        return json.data.map(hotel => ({
            id: hotel.id,
            name: hotel.name,
            description: hotel.description,
            location: hotel.location,
            price: hotel.price,
            rating: hotel.rating,
            maxGuests: hotel.maxGuests,
            image: hotel.media?.[0]?.url || "https://via.placeholder.com/400x300?text=No+Image",
            media: hotel.media,
            meta: hotel.meta,
            amenities: Object.keys(hotel.meta || {}).filter(key => hotel.meta[key])
        }));
    } catch (error) {
        console.error("Failed to fetch hotels:", error);
        return [];
    }
} 