class HotelCard {
    constructor(hotelData) {
        this.hotelData = hotelData;
    }

    render() {
        return `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="relative">
                    <img src="${this.hotelData.image}" alt="${this.hotelData.name}" class="w-full h-48 object-cover">
                    <div class="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded">
                        ${this.hotelData.rating} ★
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="text-xl font-semibold text-gray-800">${this.hotelData.name}</h3>
                    <p class="text-gray-600 mt-1">${this.hotelData.location}</p>
                    <div class="mt-2">
                        <span class="text-green-600 font-semibold">$${this.hotelData.price}</span>
                        <span class="text-gray-500 text-sm"> / night</span>
                    </div>
                    <div class="mt-4 flex justify-between items-center">
                        <div class="flex space-x-1">
                            ${this.renderAmenities()}
                        </div>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderAmenities() {
        return this.hotelData.amenities.map(amenity => `
            <span class="text-gray-500 text-sm">${amenity}</span>
        `).join('');
    }
}

export default HotelCard; 