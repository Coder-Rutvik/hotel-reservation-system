 
import React from 'react';
import Room from './Room';

const Floor = ({ floor, bookedRooms, isTopFloor }) => {
  return (
    <div className="floor">
      <div className="floor-header">
        <div className="lift-stairs">
          <div>🚪</div>
          <span>Lift/Stairs</span>
        </div>
        <div className="floor-number">{floor.floorNumber}</div>
        <div className="floor-title">
          Floor {floor.floorNumber} {isTopFloor ? '(Top Floor)' : ''}
        </div>
      </div>
      
      <div className="floor-content">
        <div className="rooms-container">
          {floor.rooms.map(room => (
            <Room
              key={room.number}
              room={room}
              isSelected={bookedRooms.includes(room.number)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Floor;