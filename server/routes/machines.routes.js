import express from 'express';
import {
    getAllMachines,
    getMachineStats,
    getMachineById,
    updateMachineStatus,
    reportMachineIssue
} from '../controllers/machines.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Machine routes
router.get('/', getAllMachines);
router.get('/stats', getMachineStats);
router.get('/:id', getMachineById);
router.put('/:id/status', updateMachineStatus);
router.post('/:id/report', reportMachineIssue);

export default router;
