// Dashboard Controller with Dummy Data

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const stats = {
            totalWorkers: {
                count: 24,
                change: '+12%',
                description: 'from last week'
            },
            activeMachines: {
                count: 8,
                change: '+61.2%',
                description: 'efficiency'
            },
            todaysYield: {
                count: 1234,
                unit: 'kg',
                description: 'Total today'
            },
            cottonBags: {
                count: 45,
                change: '+8%',
                description: 'sealed today'
            }
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        });
    }
};

// Get inventory data
export const getInventory = async (req, res) => {
    try {
        const inventory = {
            currentStock: 850,
            maxCapacity: 1000,
            percentageFull: 85,
            totalHarvested: 2450,
            pendingDelivery: 150,
            unit: 'quintals'
        };

        res.json({
            success: true,
            data: inventory
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inventory data'
        });
    }
};

// Get deliveries/logistics data
export const getDeliveries = async (req, res) => {
    try {
        const deliveries = [
            {
                id: 1,
                name: 'Ramesh Traders',
                quantity: '200q',
                date: 'Tomorrow, 10 AM',
                status: 'Scheduled',
                statusColor: 'blue'
            },
            {
                id: 2,
                name: 'Global Cottons',
                quantity: '450q',
                date: 'Dec 02, 2024',
                status: 'Completed',
                statusColor: 'green'
            },
            {
                id: 3,
                name: 'Local Mandi Agent',
                quantity: '150q',
                date: 'Dec 05, 2024',
                status: 'In-Transit',
                statusColor: 'orange'
            },
            {
                id: 4,
                name: 'Cotton Hub Exports',
                quantity: '300q',
                date: 'Dec 12, 2024',
                status: 'Scheduled',
                statusColor: 'blue'
            },
            {
                id: 5,
                name: 'Maharashtra Traders',
                quantity: '175q',
                date: 'Dec 08, 2024',
                status: 'In-Transit',
                statusColor: 'orange'
            }
        ];

        res.json({
            success: true,
            data: deliveries
        });
    } catch (error) {
        console.error('Error fetching deliveries:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch deliveries data'
        });
    }
};

// Get recent activity
export const getRecentActivity = async (req, res) => {
    try {
        const activities = [
            {
                id: 1,
                time: '10:30 AM',
                activity: 'Machine #3 completed Field B',
                status: 'success'
            },
            {
                id: 2,
                time: '09:45 AM',
                activity: 'Worker shift started - 12 workers',
                status: 'info'
            },
            {
                id: 3,
                time: '08:20 AM',
                activity: 'Quality check passed - Batch #45',
                status: 'success'
            },
            {
                id: 4,
                time: '07:15 AM',
                activity: 'Machine #1 maintenance scheduled',
                status: 'warning'
            },
            {
                id: 5,
                time: '06:00 AM',
                activity: 'Daily operations started',
                status: 'info'
            }
        ];

        res.json({
            success: true,
            data: activities
        });
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent activity'
        });
    }
};

// Schedule a new delivery
export const scheduleDelivery = async (req, res) => {
    try {
        const { name, quantity, date } = req.body;

        // Validation
        if (!name || !quantity || !date) {
            return res.status(400).json({
                success: false,
                message: 'All fields (name, quantity, date) are required'
            });
        }

        // In a real app, this would save to database
        const newDelivery = {
            id: Date.now(),
            name,
            quantity,
            date,
            status: 'Scheduled',
            statusColor: 'blue',
            createdAt: new Date().toISOString()
        };

        res.status(201).json({
            success: true,
            message: 'Delivery scheduled successfully',
            data: newDelivery
        });
    } catch (error) {
        console.error('Error scheduling delivery:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to schedule delivery'
        });
    }
};
