// Machines Controller with MongoDB Database
import Machine from '../models/Machine.js';

// Get all machines
export const getAllMachines = async (req, res) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const machines = await Machine.find({ userId }).sort({ machineNumber: 1 }).lean();

        // Transform for frontend
        const transformedMachines = machines.map(machine => ({
            id: machine.machineNumber,
            field: machine.field,
            battery: machine.battery,
            temp: machine.temp,
            trash: machine.trash,
            bags: machine.bags,
            status: machine.status,
            location: machine.location,
            lastUpdated: machine.lastUpdated
        }));

        res.json({
            success: true,
            data: transformedMachines
        });
    } catch (error) {
        console.error('Error fetching machines:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch machines'
        });
    }
};

// Get machine statistics
export const getMachineStats = async (req, res) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const machines = await Machine.find({ userId }).lean();

        const total = machines.length;
        const online = machines.filter(m => m.status === 'online').length;
        const offline = machines.filter(m => m.status === 'offline').length;
        const maintenance = machines.filter(m => m.status === 'maintenance').length;
        const totalBags = machines.reduce((sum, m) => sum + m.bags, 0);
        const avgBattery = machines.length > 0 
            ? (machines.reduce((sum, m) => sum + m.battery, 0) / machines.length).toFixed(1)
            : 0;

        const stats = {
            total,
            online,
            offline,
            maintenance,
            totalBags,
            avgBattery,
            efficiency: '+61.2%' // Mock data for overall efficiency
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error calculating machine stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate machine statistics'
        });
    }
};

// Get machine by ID
export const getMachineById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const machine = await Machine.findOne({ 
            userId, 
            machineNumber: parseInt(id) 
        }).lean();

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        // Transform for frontend
        const transformedMachine = {
            id: machine.machineNumber,
            field: machine.field,
            battery: machine.battery,
            temp: machine.temp,
            trash: machine.trash,
            bags: machine.bags,
            status: machine.status,
            location: machine.location,
            lastUpdated: machine.lastUpdated,
            issues: machine.issues
        };

        res.json({
            success: true,
            data: transformedMachine
        });
    } catch (error) {
        console.error('Error fetching machine:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch machine'
        });
    }
};

// Update machine status
export const updateMachineStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, battery, temp, trash, bags } = req.body;
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const machine = await Machine.findOne({ 
            userId, 
            machineNumber: parseInt(id) 
        });

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        // Update machine data
        if (status) machine.status = status;
        if (battery !== undefined) machine.battery = battery;
        if (temp !== undefined) machine.temp = temp;
        if (trash !== undefined) machine.trash = trash;
        if (bags !== undefined) machine.bags = bags;
        machine.lastUpdated = new Date();

        await machine.save();

        // Transform for frontend
        const transformedMachine = {
            id: machine.machineNumber,
            field: machine.field,
            battery: machine.battery,
            temp: machine.temp,
            trash: machine.trash,
            bags: machine.bags,
            status: machine.status,
            location: machine.location,
            lastUpdated: machine.lastUpdated
        };

        res.json({
            success: true,
            message: 'Machine status updated successfully',
            data: transformedMachine
        });
    } catch (error) {
        console.error('Error updating machine status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update machine status'
        });
    }
};

// Report machine issue
export const reportMachineIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const { issueType, description, priority } = req.body;
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const machine = await Machine.findOne({ 
            userId, 
            machineNumber: parseInt(id) 
        });

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        // Validation
        if (!issueType || !description) {
            return res.status(400).json({
                success: false,
                message: 'Issue type and description are required'
            });
        }

        const newIssue = {
            issueType,
            description,
            priority: priority || 'medium',
            status: 'open',
            reportedAt: new Date(),
            resolvedAt: null
        };

        machine.issues.push(newIssue);

        // Update machine status to maintenance if critical
        if (priority === 'high' || priority === 'critical') {
            machine.status = 'maintenance';
        }

        await machine.save();

        // Get the newly added issue (last one)
        const addedIssue = machine.issues[machine.issues.length - 1];

        const transformedReport = {
            id: addedIssue._id.toString(),
            machineId: machine.machineNumber,
            machineName: `Machine #${machine.machineNumber}`,
            field: machine.field,
            issueType: addedIssue.issueType,
            description: addedIssue.description,
            priority: addedIssue.priority,
            status: addedIssue.status,
            reportedAt: addedIssue.reportedAt,
            resolvedAt: addedIssue.resolvedAt
        };

        res.status(201).json({
            success: true,
            message: 'Issue reported successfully',
            data: transformedReport
        });
    } catch (error) {
        console.error('Error reporting machine issue:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to report machine issue'
        });
    }
};
