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

const router = express.Router();

// ========== SUPPORT TICKETS ROUTES ==========
router.get('/tickets', getAllTickets);
router.get('/tickets/stats', getTicketStats);
router.get('/tickets/:id', getTicketById);
router.post('/tickets', createTicket);
router.put('/tickets/:id', updateTicket);

// ========== NEWS & SCHEMES ROUTES ==========
router.get('/news', getAllNews);
router.get('/news/:id', getNewsById);

// ========== HELPLINES ROUTES ==========
router.get('/helplines', getAllHelplines);

export default router;
