const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://hotel-reservation-system-backend-6nf6.onrender.com/api');

// Debug: Log API URL
console.log('📱 Frontend Environment:', process.env.NODE_ENV);
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌍 Hostname:', window.location.hostname);

export const apiRequest = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error ${response.status}:`, errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `API request failed (${response.status})` };
      }

      throw new Error(errorData.message || errorData.error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('🔥 API Error Details:', error.message);

    // User-friendly error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to server at ${API_BASE_URL}. If you are developing locally, ensure your backend is running on port 5000.`);
    }

    if (error.message.includes('CORS')) {
      throw new Error('Connection blocked by security policy (CORS). Please ensure the backend allows this origin.');
    }

    throw error;
  }
};

// Test backend connection
export const testBackendConnection = async () => {
  try {
    console.log('Testing connection to:', API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: 'Backend connected successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: `Backend connection failed: ${error.message}`,
      error: error.message
    };
  }
};

// ✅ COMPLETE hotelApi OBJECT
export const hotelApi = {
  // Test connection
  testConnection: testBackendConnection,

  // Health Check
  checkHealth: () => apiRequest('/health'),

  // Test Database Connection
  testDatabase: () => apiRequest('/db-test'),

  // Authentication Endpoints REMOVED
  // register, login, getProfile, updateProfile, changePassword - ALL REMOVED

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

  getBookings: () => apiRequest('/bookings'), // Changed from getMyBookings

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