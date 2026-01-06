export const PDF_REQUIREMENTS = {
  hotel: {
    totalRooms: 97,
    floors: 10,
    roomsPerFloor: [10, 10, 10, 10, 10, 10, 10, 10, 10, 7],
    floor10Rooms: [1001, 1002, 1003, 1004, 1005, 1006, 1007]
  },
  travelTime: {
    horizontalPerRoom: 1,
    verticalPerFloor: 2
  },
  booking: {
    maxRooms: 5,
    prioritySameFloor: true,
    minimizeTravelTime: true
  },
  deliverables: [
    "Interface to enter no of rooms and book them",
    "Visualization of booking",
    "Button to generate random occupancy",
    "Button to reset entire booking"
  ]
};

export const PDF_EXAMPLES = [
  {
    scenario: "Example 1",
    availableRooms: {
      floor1: [101, 102, 105, 106],
      floor2: [201, 202, 203, 210],
      floor3: [301, 302]
    },
    bookRooms: 4,
    expectedResult: [101, 102, 105, 106],
    reason: "Rooms on Floor 1 minimize total travel time"
  },
  {
    scenario: "Example 2",
    availableRooms: {
      floor1: [101, 102],
      floor2: [201, 202, 203, 210],
      floor3: [301, 302]
    },
    bookRooms: 2,
    expectedResult: [201, 202],
    reason: "Minimizes vertical (2 minutes) and horizontal travel times"
  }
];