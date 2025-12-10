import express from 'express';
import {
    getAllMachines,
    getMachineStats,
    getMachineById,
    updateMachineStatus,
    reportMachineIssue
} from '../controllers/machines.controller.js';

const router = express.Router();

// Machine routes
router.get('/', getAllMachines);
router.get('/stats', getMachineStats);
router.get('/:id', getMachineById);
router.put('/:id/status', updateMachineStatus);
router.post('/:id/report', reportMachineIssue);

export default router;
