import React from 'react';
import VenueCardMain from './VenueCardMain';
import VenueCardActions from './VenueCardActions';

const VenueCard = ({ 
  venue, 
  onClick, 
  showOwnerBadge = false, 
  showLastVisited = false, 
  onViewCalendar = null 
}) => {
  const handleCardClick = () => {
    onClick(venue.id);
  };

  return (
    <div 
      className="border rounded p-4 cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={handleCardClick}
    >
      <VenueCardMain 
        venue={venue} 
        showOwnerBadge={showOwnerBadge}
        showLastVisited={showLastVisited} 
      />

      <VenueCardActions 
        venue={venue} 
        onViewCalendar={onViewCalendar} 
      />
    </div>
  );
};

export default VenueCard; 