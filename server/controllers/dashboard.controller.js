// Dashboard Controller with MongoDB Database
import Worker from '../models/Worker.js';
import Machine from '../models/Machine.js';
import { Delivery, Activity, Inventory } from '../models/Dashboard.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Calculate stats from real data
        const workers = await Worker.find({ userId });
        const machines = await Machine.find({ userId });
        const inventory = await Inventory.findOne({ userId });

        // Get today's date
        const today = new Date().toISOString().split('T')[0];
        
        // Workers stats
        const uniqueWorkerNames = new Set(workers.map(w => w.name));
        const totalWorkers = uniqueWorkerNames.size;
        
        // Calculate worker change (compare last 7 days to previous 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        
        const recentWorkers = workers.filter(w => new Date(w.date) >= sevenDaysAgo);
        const olderWorkers = workers.filter(w => new Date(w.date) >= fourteenDaysAgo && new Date(w.date) < sevenDaysAgo);
        
        const recentUniqueWorkers = new Set(recentWorkers.map(w => w.name)).size;
        const olderUniqueWorkers = new Set(olderWorkers.map(w => w.name)).size || 1;
        const workerChange = ((recentUniqueWorkers - olderUniqueWorkers) / olderUniqueWorkers * 100).toFixed(0);
        
        // Machine stats
        const activeMachines = machines.filter(m => m.status === 'online').length;
        const totalMachineHours = machines.reduce((sum, m) => sum + (m.bags * 0.5), 0); // Estimate
        const machineEfficiency = machines.length > 0 ? '+61.2%' : '0%'; // Mock efficiency for now
        
        // Today's yield from today's workers
        const todayWorkers = workers.filter(w => w.date === today);
        const todaysYield = todayWorkers.reduce((sum, w) => sum + w.picked, 0);
        
        // Cotton bags from machines
        const totalBags = machines.reduce((sum, m) => sum + m.bags, 0);
        const bagChange = machines.length > 0 ? '+8%' : '0%'; // Mock change

        // Calculate revenue and profit
        // Revenue calculation: Total harvested cotton * market price
        const totalHarvested = inventory ? inventory.totalHarvested : 0; // in quintals
        const cottonPricePerQuintal = 6200; // ₹6,200/q (can be dynamic from market API)
        const totalRevenue = totalHarvested * cottonPricePerQuintal;
        
        // Calculate monthly revenue (assuming current month data)
        const monthlyRevenue = totalRevenue; // For now, using total as monthly
        const monthlyRevenueFormatted = monthlyRevenue >= 100000 
            ? `₹${(monthlyRevenue / 100000).toFixed(1)}L` 
            : `₹${(monthlyRevenue / 1000).toFixed(0)}K`;
        
        // Calculate costs: worker wages + machine maintenance estimate
        const totalWorkerCost = workers.reduce((sum, w) => sum + w.cost, 0);
        const estimatedMachineCost = machines.length * 5000; // Estimate ₹5000 per machine for maintenance
        const totalCost = totalWorkerCost + estimatedMachineCost;
        
        // Net profit = Revenue - Costs
        const netProfit = totalRevenue - totalCost;
        const netProfitFormatted = netProfit >= 100000 
            ? `₹${(netProfit / 100000).toFixed(1)}L` 
            : `₹${(netProfit / 1000).toFixed(0)}K`;
        
        // Calculate percentage changes (mock for now, can be improved with historical data)
        const revenueChange = totalRevenue > 0 ? '+15%' : '0%';
        const profitChange = netProfit > 0 ? '+24%' : '0%';

        const stats = {
            totalWorkers: {
                count: totalWorkers,
                change: workerChange > 0 ? `+${workerChange}%` : `${workerChange}%`,
                description: 'from last week'
            },
            activeMachines: {
                count: activeMachines,
                change: machineEfficiency,
                description: 'efficiency'
            },
            todaysYield: {
                count: Math.round(todaysYield),
                unit: 'kg',
                description: 'Total today'
            },
            cottonBags: {
                count: totalBags,
                change: bagChange,
                description: 'sealed today'
            },
            monthlyRevenue: {
                amount: monthlyRevenueFormatted,
                change: revenueChange,
                raw: monthlyRevenue
            },
            netProfit: {
                amount: netProfitFormatted,
                change: profitChange,
                raw: netProfit
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
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        let inventory = await Inventory.findOne({ userId }).lean();

        // Create default inventory if none exists
        if (!inventory) {
            inventory = new Inventory({
                userId,
                currentStock: 850,
                maxCapacity: 1000,
                totalHarvested: 2450,
                pendingDelivery: 150,
                unit: 'quintals'
            });
            await inventory.save();
            inventory = inventory.toObject();
        }

        // Calculate percentage full
        const percentageFull = inventory.maxCapacity > 0 
            ? Math.round((inventory.currentStock / inventory.maxCapacity) * 100) 
            : 0;

        res.json({
            success: true,
            data: {
                currentStock: inventory.currentStock,
                maxCapacity: inventory.maxCapacity,
                percentageFull,
                totalHarvested: inventory.totalHarvested,
                pendingDelivery: inventory.pendingDelivery,
                unit: inventory.unit
            }
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
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const deliveries = await Delivery.find({ userId }).sort({ date: 1 }).lean();

        // Transform for frontend
        const transformedDeliveries = deliveries.map(delivery => ({
            id: delivery._id.toString(),
            name: delivery.name,
            quantity: delivery.quantity,
            date: delivery.date,
            status: delivery.status,
            statusColor: delivery.statusColor
        }));

        res.json({
            success: true,
            data: transformedDeliveries
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
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const activities = await Activity.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // Transform for frontend
        const transformedActivities = activities.map(activity => ({
            id: activity._id.toString(),
            time: activity.time,
            activity: activity.activity,
            status: activity.status
        }));

        res.json({
            success: true,
            data: transformedActivities
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
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Validation
        if (!name || !quantity || !date) {
            return res.status(400).json({
                success: false,
                message: 'All fields (name, quantity, date) are required'
            });
        }

        const newDelivery = new Delivery({
            userId,
            name,
            quantity,
            date,
            status: 'Scheduled',
            statusColor: 'blue'
        });

        await newDelivery.save();

        // Transform for frontend
        const transformedDelivery = {
            id: newDelivery._id.toString(),
            name: newDelivery.name,
            quantity: newDelivery.quantity,
            date: newDelivery.date,
            status: newDelivery.status,
            statusColor: newDelivery.statusColor,
            createdAt: newDelivery.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'Delivery scheduled successfully',
            data: transformedDelivery
        });
    } catch (error) {
        console.error('Error scheduling delivery:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to schedule delivery'
        });
    }
};
