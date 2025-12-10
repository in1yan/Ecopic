import express from 'express';
import {
    getAllWorkers,
    getWorkerStats,
    addWorkerRecord,
    deleteWorkerRecord,
    getWorkerById
} from '../controllers/workers.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Worker routes
router.get('/', getAllWorkers);
router.get('/stats', getWorkerStats);
router.get('/:id', getWorkerById);
router.post('/', addWorkerRecord);
router.delete('/:id', deleteWorkerRecord);

export default router;
