# EcoPick Backend Server

Backend server for EcoPick application using Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with registration, login, and session management
- **MongoDB Database**: Persistent storage using MongoDB instead of JSON files
- **Weather API**: Integration with OpenWeatherMap API
- **Security**: Password hashing with bcrypt, secure session management

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
  - **Local Installation**: [Download MongoDB](https://www.mongodb.com/try/download/community)
  - **Cloud Option**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and configure your settings
```

3. Configure MongoDB:

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Use default connection: `mongodb://localhost:27017/ecopick`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Get your connection string
- Update `MONGODB_URI` in `.env` file

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3001
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ecopick

# Weather API Configuration
WEATHER_API_KEY=your_openweathermap_api_key
```

## Running the Server

### Development Mode (with auto-reload)
```bash
pnpm dev
```

### Production Mode
```bash
pnpm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout user

### Weather

- `GET /api/weather?city=<city_name>` - Get weather data for a city

### Health Check

- `GET /api/health` - Check if API is running

## Database Schema

### User Model
```javascript
{
  fullName: String,
  email: String (unique, indexed),
  password: String (hashed),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Session Model
```javascript
{
  userId: ObjectId (ref: User),
  token: String (unique, indexed),
  expiresAt: Date (indexed),
  createdAt: Date,
  updatedAt: Date
}
```

## Migration from JSON to MongoDB

The backend has been migrated from a JSON file-based storage to MongoDB for better performance, scalability, and data integrity. Key changes include:

- ✅ **Mongoose Models**: Defined schemas for Users and Sessions
- ✅ **Async Operations**: All database operations are now asynchronous
- ✅ **Indexing**: Optimized queries with proper indexes
- ✅ **TTL Indexes**: Automatic cleanup of expired sessions
- ✅ **Connection Management**: Proper MongoDB connection handling with graceful shutdown

## Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection configuration
├── models/
│   ├── User.js            # User mongoose model
│   └── Session.js         # Session mongoose model
├── database.js            # Database operations layer
├── index.js               # Main server file with routes
├── package.json           # Dependencies
└── .env.example           # Environment variables template
```

## Troubleshooting

### MongoDB Connection Issues

1. **Local MongoDB not running**:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. **Connection refused**: Ensure MongoDB is running on the correct port (default: 27017)

3. **Authentication failed**: Check your MongoDB Atlas credentials in the connection string

### Common Errors

- **"Cannot find module"**: Run `pnpm install` to install dependencies
- **"JWT_SECRET not defined"**: Create a `.env` file with required variables
- **"MongoDB connection error"**: Verify MongoDB is running and connection string is correct

## Security Notes

- Always use strong JWT secrets in production
- Never commit `.env` file to version control
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Regularly update dependencies

## License

MIT
