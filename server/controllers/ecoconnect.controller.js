// EcoConnect Controller with MongoDB Database
import { SupportTicket, NewsArticle, Helpline } from '../models/EcoConnect.js';

// ========== SUPPORT TICKETS ENDPOINTS ==========

// Get all support tickets
export const getAllTickets = async (req, res) => {
    try {
        const { status, category, priority } = req.query;
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        let query = { userId };

        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;

        const tickets = await SupportTicket.find(query)
            .sort({ createdAt: -1 })
            .lean();

        // Transform for frontend
        const transformedTickets = tickets.map(ticket => ({
            id: ticket._id.toString(),
            farmerName: ticket.farmerName,
            farmerId: ticket.userId.toString(),
            category: ticket.category,
            subcategory: ticket.subcategory,
            subject: ticket.subject,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status,
            assignedTo: ticket.assignedTo,
            contactPhone: ticket.contactPhone,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
            resolvedAt: ticket.resolvedAt,
            responses: ticket.responses
        }));

        res.json({
            success: true,
            data: transformedTickets
        });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch support tickets'
        });
    }
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const ticket = await SupportTicket.findOne({ _id: id, userId }).lean();

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        const transformedTicket = {
            id: ticket._id.toString(),
            farmerName: ticket.farmerName,
            farmerId: ticket.userId.toString(),
            category: ticket.category,
            subcategory: ticket.subcategory,
            subject: ticket.subject,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status,
            assignedTo: ticket.assignedTo,
            contactPhone: ticket.contactPhone,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
            resolvedAt: ticket.resolvedAt,
            responses: ticket.responses
        };

        res.json({
            success: true,
            data: transformedTicket
        });
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch ticket'
        });
    }
};

// Create new support ticket
export const createTicket = async (req, res) => {
    try {
        const { farmerName, category, subcategory, subject, description, priority, contactPhone } = req.body;
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Validation
        if (!farmerName || !category || !subject || !description || !contactPhone) {
            return res.status(400).json({
                success: false,
                message: 'Required fields: farmerName, category, subject, description, contactPhone'
            });
        }

        const newTicket = new SupportTicket({
            userId,
            farmerName,
            category,
            subcategory: subcategory || 'General',
            subject,
            description,
            priority: priority || 'medium',
            status: 'open',
            assignedTo: assignDepartment(category),
            contactPhone,
            responses: []
        });

        await newTicket.save();

        const transformedTicket = {
            id: newTicket._id.toString(),
            farmerName: newTicket.farmerName,
            farmerId: newTicket.userId.toString(),
            category: newTicket.category,
            subcategory: newTicket.subcategory,
            subject: newTicket.subject,
            description: newTicket.description,
            priority: newTicket.priority,
            status: newTicket.status,
            assignedTo: newTicket.assignedTo,
            contactPhone: newTicket.contactPhone,
            createdAt: newTicket.createdAt,
            updatedAt: newTicket.updatedAt,
            resolvedAt: newTicket.resolvedAt,
            responses: newTicket.responses
        };

        res.status(201).json({
            success: true,
            message: 'Support ticket created successfully',
            data: transformedTicket
        });
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create support ticket'
        });
    }
};

// Update ticket status
export const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignedTo, response } = req.body;
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const ticket = await SupportTicket.findOne({ _id: id, userId });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        // Update ticket
        if (status) ticket.status = status;
        if (assignedTo) ticket.assignedTo = assignedTo;

        if (status === 'resolved' || status === 'closed') {
            ticket.resolvedAt = new Date();
        }

        // Add response if provided
        if (response && response.message) {
            ticket.responses.push({
                by: response.by || 'Support Team',
                message: response.message,
                timestamp: new Date()
            });
        }

        await ticket.save();

        const transformedTicket = {
            id: ticket._id.toString(),
            farmerName: ticket.farmerName,
            farmerId: ticket.userId.toString(),
            category: ticket.category,
            subcategory: ticket.subcategory,
            subject: ticket.subject,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status,
            assignedTo: ticket.assignedTo,
            contactPhone: ticket.contactPhone,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
            resolvedAt: ticket.resolvedAt,
            responses: ticket.responses
        };

        res.json({
            success: true,
            message: 'Ticket updated successfully',
            data: transformedTicket
        });
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update ticket'
        });
    }
};

// Get ticket statistics
export const getTicketStats = async (req, res) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const tickets = await SupportTicket.find({ userId }).lean();

        const stats = {
            total: tickets.length,
            open: tickets.filter(t => t.status === 'open').length,
            inProgress: tickets.filter(t => t.status === 'in-progress').length,
            resolved: tickets.filter(t => t.status === 'resolved').length,
            closed: tickets.filter(t => t.status === 'closed').length,
            byCategory: {
                emergency: tickets.filter(t => t.category === 'Emergency').length,
                expert: tickets.filter(t => t.category === 'Expert').length,
                technical: tickets.filter(t => t.category === 'Technical').length,
                general: tickets.filter(t => t.category === 'General').length
            },
            byPriority: {
                critical: tickets.filter(t => t.priority === 'critical').length,
                high: tickets.filter(t => t.priority === 'high').length,
                medium: tickets.filter(t => t.priority === 'medium').length,
                low: tickets.filter(t => t.priority === 'low').length
            }
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching ticket stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch ticket statistics'
        });
    }
};

// ========== NEWS & SCHEMES ENDPOINTS ==========

// Get all news articles
export const getAllNews = async (req, res) => {
    try {
        const { category, featured, limit } = req.query;
        
        let query = {};

        if (category) query.category = category;
        if (featured === 'true') query.isFeatured = true;

        let newsQuery = NewsArticle.find(query).sort({ publishDate: -1 });

        // Apply limit if specified
        if (limit) {
            newsQuery = newsQuery.limit(parseInt(limit));
        }

        const news = await newsQuery.lean();

        // Transform for frontend
        const transformedNews = news.map(article => ({
            id: article._id.toString(),
            category: article.category,
            title: article.title,
            preview: article.preview,
            content: article.content,
            publishDate: article.publishDate,
            expiryDate: article.expiryDate,
            isFeatured: article.isFeatured,
            link: article.link,
            tags: article.tags,
            views: article.views
        }));

        res.json({
            success: true,
            data: transformedNews
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch news articles'
        });
    }
};

// Get news by ID
export const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await NewsArticle.findById(id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News article not found'
            });
        }

        // Increment views
        news.views += 1;
        await news.save();

        const transformedNews = {
            id: news._id.toString(),
            category: news.category,
            title: news.title,
            preview: news.preview,
            content: news.content,
            publishDate: news.publishDate,
            expiryDate: news.expiryDate,
            isFeatured: news.isFeatured,
            link: news.link,
            tags: news.tags,
            views: news.views
        };

        res.json({
            success: true,
            data: transformedNews
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch news article'
        });
    }
};

// ========== HELPLINES ENDPOINTS ==========

// Get all helplines
export const getAllHelplines = async (req, res) => {
    try {
        const { category, active } = req.query;
        
        let query = {};

        if (category) query.category = category;
        if (active === 'true') query.isActive = true;

        const helplines = await Helpline.find(query).sort({ priority: 1 }).lean();

        // Transform for frontend
        const transformedHelplines = helplines.map(helpline => ({
            id: helpline._id.toString(),
            category: helpline.category,
            title: helpline.title,
            description: helpline.description,
            phone: helpline.phone,
            whatsapp: helpline.whatsapp,
            email: helpline.email,
            availability: helpline.availability,
            isActive: helpline.isActive,
            priority: helpline.priority,
            color: helpline.color
        }));

        res.json({
            success: true,
            data: transformedHelplines
        });
    } catch (error) {
        console.error('Error fetching helplines:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch helplines'
        });
    }
};

// ========== HELPER FUNCTIONS ==========

function assignDepartment(category) {
    const assignments = {
        'Emergency': 'Emergency Response Team',
        'Technical': 'Technical Support',
        'Expert': 'Expert Consultation Team',
        'General': 'Support Team'
    };
    return assignments[category] || 'Support Team';
}
