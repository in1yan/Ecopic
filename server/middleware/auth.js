import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Middleware to verify JWT token and attach user to request
export const authenticateToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        // Verify token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or expired token'
                });
            }

            // Attach user info to request
            req.user = {
                userId: decoded.userId,
                email: decoded.email
            };

            next();
        });
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

// Optional: Middleware for routes that work with or without authentication
export const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (!err) {
                    req.user = {
                        userId: decoded.userId,
                        email: decoded.email
                    };
                }
            });
        }

        next();
    } catch (error) {
        console.error('Optional auth error:', error);
        next();
    }
};

export default authenticateToken;
