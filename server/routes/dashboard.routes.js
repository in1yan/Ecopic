import express from 'express';
import {
    getDashboardStats,
    getInventory,
    getDeliveries,
    getRecentActivity,
    scheduleDelivery
} from '../controllers/dashboard.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/inventory', getInventory);
router.get('/deliveries', getDeliveries);
router.get('/activity', getRecentActivity);
router.post('/deliveries', scheduleDelivery);

export default router;
