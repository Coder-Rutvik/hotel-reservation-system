import React, { useState, useEffect } from 'react';
import HotelVisualization from './components/HotelVisualization';
import Controls from './components/Controls';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { hotelApi } from './api/config';
import { initializeHotel, generateRandomOccupancy } from './utils/bookingAlgorithm';
import './styles/App.css';

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const [hotel, setHotel] = useState([]);
  const [numRooms, setNumRooms] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [bookedRooms, setBookedRooms] = useState([]);
  const [travelTime, setTravelTime] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(true);

  useEffect(() => {
    const hotelData = initializeHotel();
    setHotel(hotelData);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated) {
        setRoomsLoading(false);
        return;
      }
      try {
        setRoomsLoading(true);
        const roomsResp = await hotelApi.getAllRooms();
        if (roomsResp.success) {
          setHotel(prevHotel => {
            const updatedHotel = [...prevHotel];
            roomsResp.data.forEach(backendRoom => {
              const floorIndex = backendRoom.floor - 1;
              if (updatedHotel[floorIndex]) {
                const roomIndex = updatedHotel[floorIndex].rooms.findIndex(
                  r => r.number === backendRoom.roomNumber
                );
                if (roomIndex !== -1) {
                  updatedHotel[floorIndex].rooms[roomIndex].booked = !backendRoom.isAvailable;
                }
              }
            });
            return updatedHotel;
          });
        }
        const bookingsResp = await hotelApi.getMyBookings();
        if (bookingsResp.success) {
          setMyBookings(bookingsResp.data);
        }
      } catch (error) {
        console.error('Error loading rooms/bookings:', error);
        setMessage('❌ Failed to fetch rooms from server');
      } finally {
        setRoomsLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    
    if (!checkInDate) {
      setCheckInDate(tomorrow.toISOString().split('T')[0]);
    }
    if (!checkOutDate) {
      setCheckOutDate(dayAfter.toISOString().split('T')[0]);
    }
  }, [checkInDate, checkOutDate]);

  const fetchRooms = async () => {
    try {
      setRoomsLoading(true);
      const response = await hotelApi.getAllRooms();
      if (response.success) {
        const updatedHotel = [...hotel];
        response.data.forEach(backendRoom => {
          const floorIndex = backendRoom.floor - 1;
          if (updatedHotel[floorIndex]) {
            const roomIndex = updatedHotel[floorIndex].rooms.findIndex(
              r => r.number === backendRoom.roomNumber
            );
            if (roomIndex !== -1) {
              updatedHotel[floorIndex].rooms[roomIndex].booked = !backendRoom.isAvailable;
            }
          }
        });
        setHotel(updatedHotel);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setMessage('❌ Failed to fetch rooms from server');
    } finally {
      setRoomsLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await hotelApi.getMyBookings();
      if (response.success) {
        setMyBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleBook = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (numRooms < 1 || numRooms > 5) {
      setMessage('❌ Please enter a number between 1 and 5');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setMessage('❌ Please select check-in and check-out dates');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await hotelApi.bookRooms({
        numRooms,
        checkInDate,
        checkOutDate
      });

      if (response.success) {
        const roomNumbers = response.data.rooms;
        setBookedRooms(roomNumbers);
        setTravelTime(response.data.travelTime);
        setMessage(`✅ Successfully booked rooms: ${roomNumbers.join(', ')} (Travel: ${response.data.travelTime} mins, Price: ₹${response.data.totalPrice})`);
        
        await fetchRooms();
        await fetchMyBookings();
        
        setTimeout(() => {
          setBookedRooms([]);
        }, 3000);
      }
    } catch (error) {
      setMessage(`❌ ${error.message || 'Booking failed'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRandom = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    const randomHotel = generateRandomOccupancy();
    setHotel(randomHotel);
    setBookedRooms([]);
    setTravelTime(0);
    const occupied = randomHotel.flatMap(f => f.rooms.filter(r => r.booked)).length;
    setMessage(`🎲 Random occupancy generated: ${occupied} rooms occupied (Local visualization only)`);
  };

  const handleReset = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    const freshHotel = initializeHotel();
    setHotel(freshHotel);
    setBookedRooms([]);
    setTravelTime(0);
    setMessage('🔄 Local visualization reset (Backend data unchanged)');
    
    await fetchRooms();
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await hotelApi.cancelBooking(bookingId);
      if (response.success) {
        setMessage('✅ Booking cancelled successfully');
        await fetchRooms();
        await fetchMyBookings();
      }
    } catch (error) {
      setMessage(`❌ ${error.message || 'Failed to cancel booking'}`);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>🏨 Hotel Room Reservation System</h1>
            <p className="subtitle">SDE 3 Assessment - Unstop (Backend Integrated)</p>
          </div>
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <span className="user-info">👤 {user?.name || user?.email}</span>
                <button onClick={() => setShowBookings(!showBookings)} className="header-btn">
                  📋 My Bookings
                </button>
                <button onClick={logout} className="header-btn logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="header-btn login-btn">
                Login / Register
              </button>
            )}
          </div>
        </div>
      </header>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      <div className="container">
        {!isAuthenticated && (
          <div className="auth-prompt">
            <p>🔐 Please <button onClick={() => setShowAuthModal(true)} className="link-btn">login or register</button> to book rooms</p>
          </div>
        )}

        {showBookings && isAuthenticated && (
          <div className="bookings-section">
            <h2>📋 My Bookings</h2>
            {myBookings.length === 0 ? (
              <p>No bookings yet. Book your first room!</p>
            ) : (
              <div className="bookings-list">
                {myBookings.map((booking) => (
                  <div key={booking.bookingId} className="booking-card">
                    <div className="booking-info">
                      <h3>Booking #{booking.bookingId.slice(0, 8)}</h3>
                      <p><strong>Rooms:</strong> {Array.isArray(booking.rooms) ? booking.rooms.join(', ') : 'N/A'}</p>
                      <p><strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                      <p><strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                      <p><strong>Travel Time:</strong> {booking.travelTime} minutes</p>
                      <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
                      <p><strong>Status:</strong> <span className={`status-${booking.status}`}>{booking.status}</span></p>
                    </div>
                    {booking.status === 'confirmed' && (
                      <button 
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        className="cancel-btn"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Controls
          numRooms={numRooms}
          setNumRooms={setNumRooms}
          checkInDate={checkInDate}
          setCheckInDate={setCheckInDate}
          checkOutDate={checkOutDate}
          setCheckOutDate={setCheckOutDate}
          onBook={handleBook}
          onRandom={handleRandom}
          onReset={handleReset}
          travelTime={travelTime}
          bookedRooms={bookedRooms}
          loading={loading || roomsLoading}
        />

        <div className="message-box">
          {message && <p className={`message ${message.includes('✅') ? 'success' : message.includes('❌') ? 'error' : 'info'}`}>{message}</p>}
        </div>

        {roomsLoading ? (
          <div className="loading">Loading rooms...</div>
        ) : (
          <HotelVisualization hotel={hotel} bookedRooms={bookedRooms} />
        )}
      </div>

      <footer className="footer">
        <p>Unstop SDE 3 Assessment Submission | Hotel Room Reservation System</p>
        <p className="footer-note">Frontend + Backend Integrated | MySQL + MongoDB</p>
      </footer>
    </div>
  );
}

export default App;
