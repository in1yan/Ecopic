# 🌾 EcoPick - Smart Cotton Harvesting Management System

EcoPick is a comprehensive digital platform designed to revolutionize cotton farming operations through intelligent automation, real-time monitoring, and data-driven insights. Built for the modern agricultural landscape, it bridges the gap between traditional farming practices and cutting-edge technology.

## 🎯 Problem Statement

Cotton farming faces several critical challenges:

- **Labor Management**: Difficulty in tracking worker performance, attendance, and productivity across large farms
- **Machine Monitoring**: Lack of real-time visibility into harvesting machine status and efficiency
- **Yield Tracking**: Manual, error-prone processes for recording and analyzing cotton yield data
- **Weather Impact**: Unpredictable weather conditions affecting harvest planning and operations
- **Resource Optimization**: Inefficient allocation of workers and machines leading to productivity loss
- **Data Fragmentation**: Scattered information across paper records and disconnected systems
- **Support Access**: Limited access to expert guidance and farming best practices

## 💡 Solution

EcoPick provides an integrated platform that:

- **Centralizes Operations**: Single dashboard for complete farm visibility and control
- **Real-Time Monitoring**: Live tracking of workers, machines, and yield metrics
- **Predictive Insights**: Weather integration and data analytics for informed decision-making
- **Automated Management**: Digital worker management with performance tracking
- **Machine Intelligence**: IoT-enabled monitoring of cotton picking machines with maintenance alerts
- **Knowledge Hub**: EcoConnect support system with expert advice and community resources
- **Mobile-First Design**: Responsive interface accessible from field to office

## ✨ Key Features

### 📊 Dashboard
- Real-time statistics overview (workers, machines, yield, inventory)
- Visual analytics with interactive charts and graphs
- Recent activity feed and delivery tracking
- Inventory management with capacity monitoring
- Quick action buttons for common tasks

### 🤖 Machine Monitoring
- Live status tracking of all cotton picking machines
- Performance metrics (bags picked, efficiency, uptime)
- Maintenance scheduling and issue reporting
- Machine health indicators and alerts
- Historical performance data

### 👥 Worker Management
- Digital worker profiles with photo and details
- Attendance tracking and performance metrics
- Yield recording per worker
- Worker assignment to machines/zones
- Communication system with workers

### 🌤️ Weather Station
- Real-time weather data integration
- Multi-day weather forecasts
- Weather-based harvest recommendations
- Historical weather trends
- Location-based weather alerts

### 🗺️ Cotton Mapping
- Interactive farm visualization
- Zone-wise harvest tracking
- Geographic yield analysis
- Field planning tools

### 💬 EcoConnect
- Expert advisory support
- Community forums and knowledge base
- Best practices and farming guides
- Issue resolution system
- Resource library

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router v7** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization and charts
- **Lucide React** - Beautiful icon system

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Axios** - HTTP client for API calls

### Additional Tools
- **OpenWeatherMap API** - Weather data integration
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before installation, ensure you have:

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **pnpm** package manager ([Install](https://pnpm.io/installation))
- **MongoDB** v4.4 or higher
  - Local: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ECOPICK
```

### 2. Install Frontend Dependencies

```bash
pnpm install
```

### 3. Install Backend Dependencies

```bash
cd server
pnpm install
cd ..
```

### 4. Configure Environment Variables

#### Frontend Environment Variables

Create `.env` file in the root directory:

```env
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:3001/api
```

#### Backend Environment Variables

Create `server/.env` file:

```env
# Server Configuration
PORT=3001
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/ecopick

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecopick?retryWrites=true&w=majority

# Weather API Configuration
WEATHER_API_KEY=your_openweathermap_api_key
```

**Important Notes:**
- Replace `JWT_SECRET` with a strong, unique secret key
- Get a free Weather API key from [OpenWeatherMap](https://openweathermap.org/api)
- For MongoDB Atlas, replace `<username>`, `<password>`, and `<cluster>` with your actual credentials

### 5. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Add database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string and update `MONGODB_URI` in `server/.env`

### 6. Start the Application

#### Option 1: Using the Batch Script (Windows)

```bash
# Starts both frontend and backend concurrently
start-app.bat
```

#### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd server
pnpm dev
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
pnpm dev
# App runs on http://localhost:5173
```

### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

Default login credentials will be created on first registration.

## 📁 Project Structure

```
ECOPICK/
├── src/                          # Frontend source code
│   ├── components/               # Reusable UI components
│   ├── views/                    # Page components
│   │   ├── app/                  # Application pages
│   │   │   ├── pages/            # Feature pages
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── MachinesPage.tsx
│   │   │   │   ├── WorkersPage.tsx
│   │   │   │   ├── WeatherPage.tsx
│   │   │   │   ├── EcoConnectPage.tsx
│   │   │   │   └── CottonMap.tsx
│   │   │   └── MainApp.tsx       # Feature scroll home
│   │   └── auth/                 # Authentication pages
│   ├── services/                 # API service layer
│   ├── context/                  # React context providers
│   ├── routes/                   # React Router configuration
│   ├── layouts/                  # Layout components
│   ├── lib/                      # Utility functions
│   ├── i18n/                     # Internationalization
│   ├── App.tsx                   # Root component
│   └── main.tsx                  # Entry point
├── server/                       # Backend source code
│   ├── config/                   # Configuration files
│   ├── models/                   # Mongoose models
│   ├── routes/                   # API routes
│   ├── controllers/              # Route controllers
│   ├── middleware/               # Express middleware
│   ├── index.js                  # Server entry point
│   └── database.js               # Database operations
├── public/                       # Static assets
├── dist/                         # Production build output
├── index.html                    # HTML entry point
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Frontend dependencies
└── README.md                     # This file
```

## 🔐 Authentication Flow

1. **Registration**: New users create account with full name, email, and password
2. **Login**: Credentials verified against MongoDB database
3. **JWT Token**: Secure token generated and stored in localStorage
4. **Protected Routes**: All app routes require valid authentication
5. **Auto-redirect**: Unauthenticated users redirected to login page
6. **Session Management**: Tokens expire after set duration for security
7. **Logout**: Clears authentication token and redirects to login

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - User logout

### Weather
- `GET /api/weather?city=<city_name>` - Get weather data

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/inventory` - Get inventory data
- `GET /api/dashboard/deliveries` - Get delivery information
- `GET /api/dashboard/activity` - Get recent activities

### Machines
- `GET /api/machines` - Get all machines
- `GET /api/machines/stats` - Get machine statistics
- `POST /api/machines/report` - Report machine issue

### Workers
- `GET /api/workers` - Get all workers
- `POST /api/workers` - Add new worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker

## 🧪 Development Scripts

### Frontend
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
```

### Backend
```bash
cd server
pnpm dev          # Start with auto-reload
pnpm start        # Start production server
```

## 🔧 Configuration

### Vite Configuration
Located in `vite.config.ts` - customize build settings, plugins, and dev server options.

### Tailwind Configuration
Located in `tailwind.config.js` - customize colors, fonts, and utility classes.

### TypeScript Configuration
Located in `tsconfig.json` - customize compiler options and type checking.

## 🚢 Deployment

### Frontend Deployment

1. **Build the application:**
```bash
pnpm build
```

2. **Deploy the `dist` folder** to:
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting service

3. **Update environment variables** in hosting platform

### Backend Deployment

1. **Deploy to:**
   - Heroku
   - Railway
   - DigitalOcean
   - AWS EC2
   - Any Node.js hosting

2. **Set environment variables** in hosting platform
3. **Update frontend** `VITE_API_BASE_URL` to production backend URL

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check connection string in `.env` file
- Verify network access for MongoDB Atlas

### Port Already in Use
```bash
# Kill process on port 3001 (backend)
npx kill-port 3001

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
pnpm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### Environment Variables Not Loading
- Ensure `.env` files exist in correct locations
- Restart dev servers after changing environment variables
- Check variable names start with `VITE_` for frontend

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ for Smart India Hackathon 2024

## 🙏 Acknowledgments

- OpenWeatherMap for weather API
- MongoDB for database solutions
- React and Vite communities
- All contributors and supporters

## 📧 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check documentation in `ROUTING_GUIDE.md`

---

**Note**: This is a hackathon project built for demonstration purposes. For production use, additional security hardening, testing, and optimization are recommended.
