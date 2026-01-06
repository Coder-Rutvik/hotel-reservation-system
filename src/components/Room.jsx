import React, { useState, useEffect } from 'react';

const Room = ({ room, isSelected }) => {
  const [isCurrentlySelected, setIsCurrentlySelected] = useState(false);
  
  useEffect(() => {
    if (isSelected) {
      setIsCurrentlySelected(true);
      const timer = setTimeout(() => {
        setIsCurrentlySelected(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsCurrentlySelected(false);
    }
  }, [isSelected]);

  const getRoomClass = () => {
    if (isCurrentlySelected) {
      return 'room selected';
    } else if (room.booked) {
      return 'room booked';
    } else {
      return 'room available';
    }
  };

  const getRoomTitle = () => {
    if (isCurrentlySelected) {
      return `Room ${room.number} - Currently Selected`;
    } else if (room.booked) {
      return `Room ${room.number} - Booked`;
    } else {
      return `Room ${room.number} - Available`;
    }
  };

  return (
    <div className={getRoomClass()} title={getRoomTitle()}>
      {room.number}
      {isCurrentlySelected && (
        <div className="selected-badge">✓</div>
      )}
    </div>
  );
};

export default Room;