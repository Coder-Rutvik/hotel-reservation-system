import React from 'react';

const Controls = ({ 
  numRooms, 
  setNumRooms, 
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  onBook, 
  onRandom, 
  onReset, 
  travelTime, 
  bookedRooms,
  loading 
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  const minCheckOut = checkInDate ? new Date(new Date(checkInDate).getTime() + 86400000).toISOString().split('T')[0] : today;

  return (
    <div className="controls">
      <div className="pdf-layout">
        <div className="pdf-control-row">
          <div className="pdf-control-group">
            <label className="pdf-label">No of Rooms</label>
            <input
              type="number"
              min="1"
              max="5"
              value={numRooms}
              onChange={(e) => setNumRooms(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
              className="pdf-input"
              disabled={loading}
            />
          </div>
          
          <div className="pdf-control-group">
            <label className="pdf-label">Check-in Date</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={today}
              className="pdf-input"
              disabled={loading}
            />
          </div>
          
          <div className="pdf-control-group">
            <label className="pdf-label">Check-out Date</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={minCheckOut}
              className="pdf-input"
              disabled={loading}
            />
          </div>
          
          <div className="pdf-buttons">
            <button 
              onClick={onBook} 
              className="pdf-btn book-btn"
              disabled={loading || !checkInDate || !checkOutDate}
            >
              {loading ? 'Booking...' : 'Book'}
            </button>
            <button onClick={onReset} className="pdf-btn reset-btn" disabled={loading}>
              Reset
            </button>
            <button onClick={onRandom} className="pdf-btn random-btn" disabled={loading}>
              Random
            </button>
          </div>
        </div>
      </div>

      <div className="booking-info">
        <h3>📊 Booking Information:</h3>
        {travelTime > 0 && (
          <p><strong>Travel Time:</strong> <span className="travel-time">{travelTime} minutes</span></p>
        )}
        {bookedRooms.length > 0 && (
          <>
            <p><strong>Booked Rooms:</strong> <span className="booked-rooms">{bookedRooms.join(', ')}</span></p>
            <p className="selection-note">Selected rooms highlight for 3 seconds</p>
          </>
        )}
        {checkInDate && checkOutDate && (
          <p><strong>Stay Duration:</strong> {
            Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))
          } night(s)</p>
        )}
      </div>
    </div>
  );
};

export default Controls;