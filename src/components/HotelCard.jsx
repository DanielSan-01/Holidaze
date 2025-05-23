import React from 'react';

function HotelCard({ hotelData }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
                <img src={hotelData.image} alt={hotelData.name} className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded">
                    {hotelData.rating} ★
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{hotelData.name}</h3>
                <p className="text-gray-600 mt-1">{hotelData.location}</p>
                <div className="mt-2">
                    <span className="text-green-600 font-semibold">${hotelData.price}</span>
                    <span className="text-gray-500 text-sm"> / night</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-1">
                        {hotelData.amenities && hotelData.amenities.map((amenity, idx) => (
                            <span key={idx} className="text-gray-500 text-sm">{amenity}</span>
                        ))}
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HotelCard; 