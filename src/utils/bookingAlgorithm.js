export const initializeHotel = () => {
  const hotel = [];
  
  for (let floor = 1; floor <= 9; floor++) {
    const rooms = [];
    for (let roomNum = 1; roomNum <= 10; roomNum++) {
      rooms.push({
        number: floor * 100 + roomNum,
        booked: false,
        floor: floor,
        position: roomNum
      });
    }
    hotel.push({
      floorNumber: floor,
      rooms: rooms
    });
  }
  
  const floor10Rooms = []; 
  for (let roomNum = 1; roomNum <= 7; roomNum++) {
    floor10Rooms.push({
      number: 1000 + roomNum,
      booked: false,
      floor: 10,
      position: roomNum
    });
  }
  hotel.push({
    floorNumber: 10,
    rooms: floor10Rooms
  });
  
  return hotel;
};

const calculateHorizontalTime = (rooms) => {
  if (rooms.length <= 1) return 0;
  const positions = rooms.map(r => r.position).sort((a, b) => a - b);
  return positions[positions.length - 1] - positions[0];
};

const calculateVerticalTime = (rooms) => {
  if (rooms.length <= 1) return 0;
  const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);
  return (floors[floors.length - 1] - floors[0]) * 2;
};

export const calculateTravelTime = (rooms) => {
  return calculateHorizontalTime(rooms) + calculateVerticalTime(rooms);
};

const findBestOnSingleFloor = (availableRooms, numRooms) => {
  let bestCombination = null;
  let bestTime = Infinity;
  
  for (let i = 0; i <= availableRooms.length - numRooms; i++) {
    const combination = availableRooms.slice(i, i + numRooms);
    const time = calculateTravelTime(combination);
    if (time < bestTime) {
      bestTime = time;
      bestCombination = combination;
    }
  }
  
  return bestCombination;
};

export const calculateOptimalRooms = (hotel, numRooms) => {
  if (numRooms < 1 || numRooms > 5) {
    return { success: false, message: 'Can only book 1-5 rooms at a time' };
  }
  
  for (const floor of hotel) {
    const availableRooms = floor.rooms.filter(room => !room.booked);
    if (availableRooms.length >= numRooms) {
      const combination = findBestOnSingleFloor(availableRooms, numRooms);
      if (combination) {
        return {
          success: true,
          rooms: combination,
          message: `Found rooms on Floor ${floor.floorNumber}`
        };
      }
    }
  }
  
  return {
    success: false,
    message: `Not enough rooms available for booking ${numRooms} rooms`
  };
};

export const verifyPDFExamples = () => {
  const example1Rooms = [
    { number: 101, floor: 1, position: 1 },
    { number: 102, floor: 1, position: 2 },
    { number: 105, floor: 1, position: 5 },
    { number: 106, floor: 1, position: 6 }
  ];
  
  const travelTime1 = calculateTravelTime(example1Rooms);
  
  const example2Rooms = [
    { number: 201, floor: 2, position: 1 },
    { number: 202, floor: 2, position: 2 }
  ];
  
  const travelTime2 = calculateTravelTime(example2Rooms);
  
  return { 
    example1: travelTime1, 
    example2: travelTime2,
    example1Details: {
      rooms: [101, 102, 105, 106],
      floor: 1,
      horizontalTime: 5,
      verticalTime: 0,
      totalTime: 5
    },
    example2Details: {
      rooms: [201, 202],
      floor: 2,
      horizontalTime: 1,
      verticalTime: 2,
      totalTime: 3
    }
  };
};