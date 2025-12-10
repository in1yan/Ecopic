import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to generate JWT token
const generateToken = (userId, email) => {
    return jwt.sign(
        { userId, email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Helper function to verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Check if user already exists
        const existingUser = db.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = db.createUser(fullName, email, hashedPassword);

        // Generate token
        const token = generateToken(user.id, email);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = db.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        db.updateUserLastLogin(user.id);

        // Generate token with extended expiry if remember me is checked
        const tokenExpiry = rememberMe ? '30d' : '7d';
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: tokenExpiry }
        );

        // If remember me, store session in database
        if (rememberMe) {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);
            db.createSession(user.id, token, expiresAt.toISOString());
        }

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// Verify token endpoint
app.post('/api/auth/verify', (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required'
            });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Get user data
        const user = db.findUserById(decoded.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during token verification'
        });
    }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
    try {
        const { token } = req.body;

        if (token) {
            // Remove session from database if it exists
            db.deleteSession(token);
        }

        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'EcoPick API is running',
        timestamp: new Date().toISOString()
    });
});


// Clean up expired sessions periodically (every hour)
setInterval(() => {
    db.cleanExpiredSessions();
}, 60 * 60 * 1000);

// Weather endpoint
import axios from 'axios';

app.get('/api/weather', async (req, res) => {
    try {
        const { city = 'Coimbatore' } = req.query;
        // User provided key
        const apiKey = process.env.WEATHER_API_KEY || '46c4e80216734cf86a46ba34b33f7944';

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error: API key missing'
            });
        }

        // Fetch current weather and forecast in parallel
        const [currentWeatherRes, forecastRes] = await Promise.all([
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`),
            axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        ]);

        const current = currentWeatherRes.data;
        const forecastList = forecastRes.data.list;

        // Group forecast by date
        const dailyGroups = {};

        forecastList.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!dailyGroups[date]) {
                dailyGroups[date] = [];
            }
            dailyGroups[date].push(item);
        });

        const dailyForecast = Object.keys(dailyGroups).map(date => {
            const dayItems = dailyGroups[date];

            // Find max temp for the day
            const maxTemp = Math.max(...dayItems.map(i => i.main.temp));
            const minTemp = Math.min(...dayItems.map(i => i.main.temp));

            // Pick the weather condition that occurs most frequently or usually at noon
            // Simplified: pick the one at noon (12:00:00) or the middle item
            const noonItem = dayItems.find(i => i.dt_txt.includes('12:00:00')) || dayItems[Math.floor(dayItems.length / 2)];

            return {
                date: date,
                day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                temp: Math.round(maxTemp),
                minTemp: Math.round(minTemp),
                condition: noonItem.weather[0].main.toLowerCase(),
                description: noonItem.weather[0].description,
                icon: noonItem.weather[0].icon
            };
        });

        // Current OWM Free API only gives 5 days. 
        // We will return whatever unique days we found (usually 5 or 6 including today).
        // To strictly respect "from current day, for next days", 
        // we usually skip today in forecast if shown in "Current Conditions", 
        // but user asked for "next 7 days". We will return all available future days.

        const todayStr = new Date().toISOString().split('T')[0];
        const futureForecast = dailyForecast.filter(d => d.date > todayStr);

        const weatherData = {
            current: {
                temp: Math.round(current.main.temp),
                condition: current.weather[0].main,
                description: current.weather[0].description,
                humidity: current.main.humidity,
                windSpeed: current.wind.speed,
                icon: current.weather[0].icon,
                city: current.name,
                cloudiness: current.clouds.all,
                pressure: current.main.pressure,
                visibility: current.visibility,
                sunrise: current.sys.sunrise,
                sunset: current.sys.sunset,
                windDeg: current.wind.deg,
                rain: current.rain
            },
            // Limit to 7 if we magically got more, but usually it's 5.
            forecast: futureForecast.slice(0, 7)
        };

        res.json({
            success: true,
            data: weatherData
        });

    } catch (error) {
        console.error('Weather API error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch weather data',
            error: error.response?.data?.message || error.message
        });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`🚀 EcoPick Backend Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: JSON file (database.json)`);
    console.log(`🔐 JWT Authentication enabled`);
});
