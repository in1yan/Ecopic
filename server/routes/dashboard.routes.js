import express from 'express';
import {
    getDashboardStats,
    getInventory,
    getDeliveries,
    getRecentActivity,
    scheduleDelivery
} from '../controllers/dashboard.controller.js';

const router = express.Router();

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/inventory', getInventory);
router.get('/deliveries', getDeliveries);
router.get('/activity', getRecentActivity);
router.post('/deliveries', scheduleDelivery);

export default router;
