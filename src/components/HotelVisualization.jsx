import React from 'react';
import Floor from './Floor';

const HotelVisualization = ({ hotel, bookedRooms }) => {
  return (
    <div className="hotel-visualization">
      <h2>🏨 Hotel Room Layout</h2>
      <p className="visualization-subtitle">Stairs/Lift on left side. Rooms arranged left to right.</p>
      
      <div className="floors-container">
        {hotel.map((floor, index) => (
          <Floor
            key={floor.floorNumber}
            floor={floor}
            bookedRooms={bookedRooms}
            isTopFloor={index === hotel.length - 1}
          />
        ))}
      </div>
      
      <div className="legend">
        <h4>Legend:</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="room available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="room booked"></div>
            <span>Booked/Occupied</span>
          </div>
          <div className="legend-item">
            <div className="room selected"></div>
            <span>Currently Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelVisualization;