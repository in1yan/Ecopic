import express from 'express';
import {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    getTicketStats,
    getAllNews,
    getNewsById,
    getAllHelplines
} from '../controllers/ecoconnect.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// ========== SUPPORT TICKETS ROUTES (Auth Required) ==========
router.get('/tickets', authenticateToken, getAllTickets);
router.get('/tickets/stats', authenticateToken, getTicketStats);
router.get('/tickets/:id', authenticateToken, getTicketById);
router.post('/tickets', authenticateToken, createTicket);
router.put('/tickets/:id', authenticateToken, updateTicket);

// ========== NEWS & SCHEMES ROUTES (Public) ==========
router.get('/news', getAllNews);
router.get('/news/:id', getNewsById);

// ========== HELPLINES ROUTES (Public) ==========
router.get('/helplines', getAllHelplines);

export default router;
