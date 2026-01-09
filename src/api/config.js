// src/api/config.js
// Complete API Configuration for PostgreSQL Backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const hotelApi = {
  // Health Check
  checkHealth: () => apiRequest('/health'),

  // Test Database Connection
  testDatabase: () => apiRequest('/db-test'),

  // Authentication Endpoints
  register: (data) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  login: (data) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  getProfile: () => apiRequest('/auth/me'),

  updateProfile: (data) => apiRequest('/auth/update-profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  changePassword: (data) => apiRequest('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // Room Endpoints
  getAllRooms: () => apiRequest('/rooms'),

  getAvailableRooms: () => apiRequest('/rooms/available'),

  getRoomsByFloor: (floorNumber) => apiRequest(`/rooms/floor/${floorNumber}`),

  getRoomByNumber: (roomNumber) => apiRequest(`/rooms/number/${roomNumber}`),

  // Booking Endpoints
  bookRooms: (data) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  getMyBookings: () => apiRequest('/bookings/my-bookings'),

  getBookingById: (id) => apiRequest(`/bookings/${id}`),

  cancelBooking: (id) => apiRequest(`/bookings/${id}/cancel`, {
    method: 'PUT'
  }),

  // Admin/System Endpoints
  generateRandomOccupancy: () => apiRequest('/rooms/random-occupancy', {
    method: 'POST'
  }),

  resetAllBookings: () => apiRequest('/rooms/reset-all', {
    method: 'POST'
  })
};