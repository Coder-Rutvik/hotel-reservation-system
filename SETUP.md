# Hotel Reservation System - Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- MongoDB (optional, for logging)

## Backend Setup

1. Navigate to backend directory:
```bash
cd ../hotel-reservation-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend root:
```env
NODE_ENV=development
PORT=5000

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=hotel_reservation

# MongoDB Configuration (optional)
MONGODB_URI=mongodb://localhost:27017/hotel_logs

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

4. Create MySQL database:
```sql
CREATE DATABASE hotel_reservation;
```

5. Seed the database (creates tables and initial data):
```bash
npm run seed
```

6. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to frontend directory (current directory):
```bash
# Already in hotel-reservation-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Testing the Integration

1. Start backend first (port 5000)
2. Start frontend (port 3000)
3. Open browser to `http://localhost:3000`
4. Click "Login / Register" to create an account
5. Book rooms using the interface

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/available` - Get available rooms
- `POST /api/bookings` - Book rooms (protected)
- `GET /api/bookings/my-bookings` - Get user bookings (protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)

## Default Users (after seeding)

- Admin: `admin@hotel.com` / `admin123`
- Test User: `test@user.com` / `test123`

## Troubleshooting

- **Backend won't start**: Check MySQL is running and database exists
- **CORS errors**: Ensure backend CORS allows `http://localhost:3000`
- **Authentication fails**: Check JWT_SECRET is set in backend .env
- **Rooms not loading**: Check backend is running on port 5000

