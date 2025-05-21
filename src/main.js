console.log('Hello from main.js!');

import HotelCard from './components/HotelCard.js';
import { fetchHotels } from './api/hotelApi.js';
import './components/NavMenu.js';
import './components/Footer.js';

document.addEventListener('DOMContentLoaded', async () => {
    const hotelsContainer = document.getElementById('hotels-container');
    if (hotelsContainer) {
        const hotels = await fetchHotels();
        hotels.forEach(hotel => {
            const hotelCard = new HotelCard(hotel);
            hotelsContainer.innerHTML += hotelCard.render();
        });
    }
}); 