// EcoConnect Controller with Dummy Data

// In-memory storage for support tickets
let supportTickets = [
    {
        id: 1,
        farmerName: 'Rajesh Kumar',
        farmerId: 'user1',
        category: 'Emergency',
        subcategory: 'Pesticide Emergency',
        subject: 'Urgent: Pest outbreak in Field A',
        description: 'Severe whitefly infestation affecting entire cotton crop in Field A. Need immediate expert guidance on pesticide application.',
        priority: 'critical',
        status: 'in-progress',
        assignedTo: 'Pesticide Control Center',
        contactPhone: '+91 98765 43210',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        resolvedAt: null,
        responses: [
            { by: 'Expert', message: 'Team dispatched to your location. ETA 30 minutes.', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() }
        ]
    },
    {
        id: 2,
        farmerName: 'Priya Sharma',
        farmerId: 'user2',
        category: 'Technical',
        subcategory: 'Machine Repair',
        subject: 'Machine #3 hydraulic system failure',
        description: 'Hydraulic system not responding. Machine stopped in middle of Field B.',
        priority: 'high',
        status: 'resolved',
        assignedTo: 'Technical Support',
        contactPhone: '+91 98765 12345',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        responses: [
            { by: 'Technician', message: 'Diagnosed issue - hydraulic pump replacement needed.', timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() },
            { by: 'Technician', message: 'Repair completed. Machine back in operation.', timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() }
        ]
    },
    {
        id: 3,
        farmerName: 'Amit Patel',
        farmerId: 'user3',
        category: 'Expert',
        subcategory: 'Market Advisory',
        subject: 'Best time to sell current harvest?',
        description: 'Have 850 quintals ready. Current price ₹6,200/q. Should I wait or sell now?',
        priority: 'medium',
        status: 'open',
        assignedTo: 'Market Advisor',
        contactPhone: '+91 98765 67890',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        resolvedAt: null,
        responses: []
    },
    {
        id: 4,
        farmerName: 'Sunita Devi',
        farmerId: 'user4',
        category: 'Expert',
        subcategory: 'Agronomy',
        subject: 'Soil nutrient deficiency in Field C',
        description: 'Yellowing of leaves observed. Soil test shows low nitrogen. Recommend fertilizer?',
        priority: 'medium',
        status: 'in-progress',
        assignedTo: 'Agronomy Expert',
        contactPhone: '+91 98765 11223',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        resolvedAt: null,
        responses: [
            { by: 'Agronomist', message: 'Reviewing your soil report. Will provide detailed plan shortly.', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() }
        ]
    },
    {
        id: 5,
        farmerName: 'Deepak Singh',
        farmerId: 'user5',
        category: 'General',
        subcategory: 'Subsidy Query',
        subject: 'PM-KISAN eligibility verification',
        description: 'Not received last installment. Need to verify eligibility status.',
        priority: 'low',
        status: 'open',
        assignedTo: 'Support Team',
        contactPhone: '+91 98765 55544',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        resolvedAt: null,
        responses: []
    }
];

let ticketIdCounter = 6;

// In-memory storage for news/schemes
let newsArticles = [
    {
        id: 1,
        category: 'Government Scheme',
        title: 'PM-KISAN 16th Installment Released',
        preview: 'New installment of ₹2000 released for eligible farmers. Check your status now.',
        content: 'The Government of India has released the 16th installment of PM-KISAN scheme. Eligible farmers will receive ₹2000 directly in their bank accounts. Verify your status on the official portal.',
        publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: null,
        isFeatured: true,
        link: 'https://pmkisan.gov.in',
        tags: ['PM-KISAN', 'Direct Benefit', 'Government'],
        views: 1250
    },
    {
        id: 2,
        category: 'Subsidy',
        title: '50% Subsidy on Solar Water Pumps',
        preview: 'Apply for the refined solar water pump subsidy scheme before Dec 31st.',
        content: 'Ministry of New and Renewable Energy announces 50% subsidy on solar water pumps for farmers. Application deadline: December 31, 2025. Documents required: Land records, Aadhaar, bank details.',
        publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date('2025-12-31').toISOString(),
        isFeatured: true,
        link: 'https://mnre.gov.in',
        tags: ['Solar', 'Subsidy', 'Irrigation'],
        views: 890
    },
    {
        id: 3,
        category: 'Grant',
        title: 'Organic Cotton Farming Grant Announced',
        preview: 'Support for simplified organic certification processes available.',
        content: 'National Centre for Organic Farming announces ₹50,000 grant per hectare for organic cotton farming. Certification support and training included. Apply through participating KVKs.',
        publishDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date('2026-03-31').toISOString(),
        isFeatured: false,
        link: 'https://ncof.gov.in',
        tags: ['Organic', 'Grant', 'Certification'],
        views: 445
    },
    {
        id: 4,
        category: 'Workshop',
        title: 'Sustainable Farming Practices Workshop',
        preview: 'Free workshop on water conservation and soil health management.',
        content: 'Join us for a comprehensive workshop on sustainable cotton farming. Topics: Drip irrigation, crop rotation, integrated pest management. Date: Dec 15, 2025. Venue: District Agriculture Office.',
        publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date('2025-12-15').toISOString(),
        isFeatured: true,
        link: null,
        tags: ['Workshop', 'Training', 'Sustainability'],
        views: 320
    },
    {
        id: 5,
        category: 'Alert',
        title: 'Heavy Rainfall Alert - Next 48 Hours',
        preview: 'IMD warns of heavy rainfall. Secure harvested cotton and delay spraying.',
        content: 'India Meteorological Department issues heavy rainfall warning for next 48 hours. Farmers advised to: 1) Secure harvested cotton in covered storage, 2) Delay pesticide application, 3) Ensure proper field drainage.',
        publishDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 42 * 60 * 60 * 1000).toISOString(),
        isFeatured: true,
        link: null,
        tags: ['Weather', 'Alert', 'Emergency'],
        views: 2100
    },
    {
        id: 6,
        category: 'Subsidy',
        title: 'Crop Insurance Premium Subsidy Extended',
        preview: 'PMFBY premium subsidy extended to Rabi season 2025-26.',
        content: 'Pradhan Mantri Fasal Bima Yojana extended with enhanced subsidy on premium. Cotton farmers get 1.5% premium rate with government subsidy. Enroll before sowing deadline.',
        publishDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date('2026-01-31').toISOString(),
        isFeatured: false,
        link: 'https://pmfby.gov.in',
        tags: ['Insurance', 'PMFBY', 'Risk Management'],
        views: 675
    },
    {
        id: 7,
        category: 'Government Scheme',
        title: 'Kisan Credit Card Interest Subvention',
        preview: 'Interest rate reduced to 4% for crop loans up to ₹3 lakh.',
        content: 'Government announces interest subvention on Kisan Credit Card loans. Farmers repaying on time get effective 4% interest rate on loans up to ₹3 lakh. Apply at nearest cooperative bank or commercial bank.',
        publishDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: null,
        isFeatured: false,
        link: 'https://kcc.gov.in',
        tags: ['Credit', 'KCC', 'Finance'],
        views: 520
    },
    {
        id: 8,
        category: 'Grant',
        title: 'Women Farmer Empowerment Grant',
        preview: 'Special grant of ₹1 lakh for women-led farming enterprises.',
        content: 'Ministry of Rural Development launches Women Farmer Empowerment Scheme. Women farmers and SHGs eligible for ₹1 lakh grant for farm mechanization, value addition, or market linkage projects.',
        publishDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date('2026-06-30').toISOString(),
        isFeatured: true,
        link: null,
        tags: ['Women', 'Empowerment', 'Grant'],
        views: 380
    }
];

let newsIdCounter = 9;

// In-memory storage for helplines
let helplines = [
    {
        id: 1,
        category: 'emergency',
        title: 'Pesticide Control Center',
        description: 'For urgent pest outbreaks and chemical safety',
        phone: '1800-425-1234',
        whatsapp: '+91 98765 00001',
        email: 'pesticide.emergency@agri.gov.in',
        availability: '24/7',
        isActive: true,
        priority: 1,
        color: 'red'
    },
    {
        id: 2,
        category: 'emergency',
        title: 'Machine Breakdown (24/7)',
        description: 'Urgent repair support for EcoPick machines',
        phone: '1800-555-0199',
        whatsapp: '+91 98765 00002',
        email: 'support@ecopick.in',
        availability: '24/7',
        isActive: true,
        priority: 2,
        color: 'orange'
    },
    {
        id: 3,
        category: 'expert',
        title: 'Agronomy Expert',
        description: 'Soil health & crop planning advice',
        phone: '+91 98765 43210',
        whatsapp: '+91 98765 43210',
        email: 'agronomy@ecopick.in',
        availability: 'Business Hours',
        isActive: true,
        priority: 3,
        color: 'blue'
    },
    {
        id: 4,
        category: 'expert',
        title: 'Market Advisor',
        description: 'Real-time pricing & selling strategy',
        phone: '+91 98765 12345',
        whatsapp: '+91 98765 12345',
        email: 'market@ecopick.in',
        availability: 'Business Hours',
        isActive: true,
        priority: 4,
        color: 'blue'
    },
    {
        id: 5,
        category: 'expert',
        title: 'Weather Analyst',
        description: 'Detailed local forecasts & risks',
        phone: '+91 98765 67890',
        whatsapp: '+91 98765 67890',
        email: 'weather@ecopick.in',
        availability: 'Business Hours',
        isActive: true,
        priority: 5,
        color: 'blue'
    },
    {
        id: 6,
        category: 'expert',
        title: 'Supply Chain Manager',
        description: 'Logistics & storage solutions',
        phone: '+91 98765 11223',
        whatsapp: '+91 98765 11223',
        email: 'logistics@ecopick.in',
        availability: 'Business Hours',
        isActive: true,
        priority: 6,
        color: 'blue'
    },
    {
        id: 7,
        category: 'support',
        title: 'General Helpdesk',
        description: 'For all general queries and information',
        phone: '1800-123-4567',
        whatsapp: '+91 98765 99999',
        email: 'help@ecopick.in',
        availability: 'Mon-Sat 9AM-6PM',
        isActive: true,
        priority: 7,
        color: 'green'
    },
    {
        id: 8,
        category: 'support',
        title: 'Subsidy Information Center',
        description: 'Government schemes and subsidy guidance',
        phone: '1800-180-1551',
        whatsapp: '+91 98765 88888',
        email: 'subsidy@agri.gov.in',
        availability: 'Business Hours',
        isActive: true,
        priority: 8,
        color: 'green'
    }
];

// ========== SUPPORT TICKETS ENDPOINTS ==========

// Get all support tickets
export const getAllTickets = async (req, res) => {
    try {
        const { status, category, priority } = req.query;
        
        let filtered = [...supportTickets];

        if (status) {
            filtered = filtered.filter(t => t.status === status);
        }
        if (category) {
            filtered = filtered.filter(t => t.category === category);
        }
        if (priority) {
            filtered = filtered.filter(t => t.priority === priority);
        }

        // Sort by createdAt descending (newest first)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            success: true,
            data: filtered
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
        const ticket = supportTickets.find(t => t.id === parseInt(id));

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        res.json({
            success: true,
            data: ticket
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

        // Validation
        if (!farmerName || !category || !subject || !description || !contactPhone) {
            return res.status(400).json({
                success: false,
                message: 'Required fields: farmerName, category, subject, description, contactPhone'
            });
        }

        const newTicket = {
            id: ticketIdCounter++,
            farmerName,
            farmerId: 'guest', // TODO: link to authenticated user
            category,
            subcategory: subcategory || 'General',
            subject,
            description,
            priority: priority || 'medium',
            status: 'open',
            assignedTo: assignDepartment(category),
            contactPhone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            resolvedAt: null,
            responses: []
        };

        supportTickets.push(newTicket);

        res.status(201).json({
            success: true,
            message: 'Support ticket created successfully',
            data: newTicket
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

        const ticketIndex = supportTickets.findIndex(t => t.id === parseInt(id));

        if (ticketIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        // Update ticket
        if (status) supportTickets[ticketIndex].status = status;
        if (assignedTo) supportTickets[ticketIndex].assignedTo = assignedTo;
        supportTickets[ticketIndex].updatedAt = new Date().toISOString();

        if (status === 'resolved' || status === 'closed') {
            supportTickets[ticketIndex].resolvedAt = new Date().toISOString();
        }

        // Add response if provided
        if (response) {
            supportTickets[ticketIndex].responses.push({
                by: response.by || 'Support Team',
                message: response.message,
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            message: 'Ticket updated successfully',
            data: supportTickets[ticketIndex]
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
        const stats = {
            total: supportTickets.length,
            open: supportTickets.filter(t => t.status === 'open').length,
            inProgress: supportTickets.filter(t => t.status === 'in-progress').length,
            resolved: supportTickets.filter(t => t.status === 'resolved').length,
            closed: supportTickets.filter(t => t.status === 'closed').length,
            byCategory: {
                emergency: supportTickets.filter(t => t.category === 'Emergency').length,
                expert: supportTickets.filter(t => t.category === 'Expert').length,
                technical: supportTickets.filter(t => t.category === 'Technical').length,
                general: supportTickets.filter(t => t.category === 'General').length
            },
            byPriority: {
                critical: supportTickets.filter(t => t.priority === 'critical').length,
                high: supportTickets.filter(t => t.priority === 'high').length,
                medium: supportTickets.filter(t => t.priority === 'medium').length,
                low: supportTickets.filter(t => t.priority === 'low').length
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
        
        let filtered = [...newsArticles];

        if (category) {
            filtered = filtered.filter(n => n.category === category);
        }
        if (featured === 'true') {
            filtered = filtered.filter(n => n.isFeatured);
        }

        // Sort by publishDate descending (newest first)
        filtered.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

        // Apply limit if specified
        if (limit) {
            filtered = filtered.slice(0, parseInt(limit));
        }

        res.json({
            success: true,
            data: filtered
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
        const news = newsArticles.find(n => n.id === parseInt(id));

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News article not found'
            });
        }

        // Increment views
        news.views++;

        res.json({
            success: true,
            data: news
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
        
        let filtered = [...helplines];

        if (category) {
            filtered = filtered.filter(h => h.category === category);
        }
        if (active === 'true') {
            filtered = filtered.filter(h => h.isActive);
        }

        // Sort by priority
        filtered.sort((a, b) => a.priority - b.priority);

        res.json({
            success: true,
            data: filtered
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
