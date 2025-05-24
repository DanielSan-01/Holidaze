import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HotelCard({ hotelData }) {
    const [imgSrc, setImgSrc] = useState(hotelData.image);
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/venue/${hotelData.id}`);
    };

    return (
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleCardClick}
        >
            <div className="relative">
                <img
                    src={imgSrc}
                    alt={hotelData.name}
                    className="w-full h-48 object-cover"
                    onError={() => setImgSrc('https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')}
                />
                <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded">
                    {hotelData.rating} ★
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="group relative">
                    <h3 className="text-xl font-semibold text-gray-800 truncate">
                        {hotelData.name}
                    </h3>
                    <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white text-sm rounded py-1 px-2 -top-2 transform -translate-y-full">
                        {hotelData.name}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                    </div>
                </div>
                <p className="text-gray-600 mt-1 truncate">{hotelData.location}</p>
                <div className="mt-2">
                    <span className="text-green-600 font-semibold">${hotelData.price}</span>
                    <span className="text-gray-500 text-sm"> / night</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {hotelData.amenities && hotelData.amenities.map((amenity, idx) => (
                        <span key={idx} className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                            {amenity}
                        </span>
                    ))}
                </div>
                <div className="mt-auto pt-4">
                    <button 
                        className="w-full btn-primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/venue/${hotelData.id}`);
                        }}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HotelCard; 