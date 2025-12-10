// Machines Controller with Dummy Data

// In-memory storage for machines
let machines = [
    { 
        id: 1, 
        field: 'Field A', 
        battery: 85, 
        temp: 42, 
        trash: 2.3, 
        bags: 12, 
        status: 'online',
        location: { lat: 11.0168, lng: 76.9558 },
        lastUpdated: new Date().toISOString()
    },
    { 
        id: 2, 
        field: 'Field B', 
        battery: 72, 
        temp: 45, 
        trash: 1.8, 
        bags: 10, 
        status: 'online',
        location: { lat: 11.0178, lng: 76.9568 },
        lastUpdated: new Date().toISOString()
    },
    { 
        id: 3, 
        field: 'Field A', 
        battery: 45, 
        temp: 38, 
        trash: 3.1, 
        bags: 8, 
        status: 'online',
        location: { lat: 11.0188, lng: 76.9578 },
        lastUpdated: new Date().toISOString()
    },
    { 
        id: 4, 
        field: 'Field C', 
        battery: 0, 
        temp: 0, 
        trash: 0, 
        bags: 0, 
        status: 'offline',
        location: { lat: 11.0198, lng: 76.9588 },
        lastUpdated: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    { 
        id: 5, 
        field: 'Field B', 
        battery: 92, 
        temp: 40, 
        trash: 1.5, 
        bags: 15, 
        status: 'online',
        location: { lat: 11.0208, lng: 76.9598 },
        lastUpdated: new Date().toISOString()
    },
    { 
        id: 6, 
        field: 'Field D', 
        battery: 35, 
        temp: 48, 
        trash: 2.8, 
        bags: 6, 
        status: 'maintenance',
        location: { lat: 11.0218, lng: 76.9608 },
        lastUpdated: new Date().toISOString()
    },
    { 
        id: 7, 
        field: 'Field C', 
        battery: 68, 
        temp: 43, 
        trash: 2.0, 
        bags: 11, 
        status: 'online',
        location: { lat: 11.0228, lng: 76.9618 },
        lastUpdated: new Date().toISOString()
    },
    { 
        id: 8, 
        field: 'Field A', 
        battery: 55, 
        temp: 41, 
        trash: 2.5, 
        bags: 9, 
        status: 'online',
        location: { lat: 11.0238, lng: 76.9628 },
        lastUpdated: new Date().toISOString()
    }
];

let issueReports = [];
let reportId = 1;

// Get all machines
export const getAllMachines = async (req, res) => {
    try {
        res.json({
            success: true,
            data: machines
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
        const machine = machines.find(m => m.id === parseInt(id));

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        res.json({
            success: true,
            data: machine
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

        const machineIndex = machines.findIndex(m => m.id === parseInt(id));

        if (machineIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        // Update machine data
        if (status) machines[machineIndex].status = status;
        if (battery !== undefined) machines[machineIndex].battery = battery;
        if (temp !== undefined) machines[machineIndex].temp = temp;
        if (trash !== undefined) machines[machineIndex].trash = trash;
        if (bags !== undefined) machines[machineIndex].bags = bags;
        machines[machineIndex].lastUpdated = new Date().toISOString();

        res.json({
            success: true,
            message: 'Machine status updated successfully',
            data: machines[machineIndex]
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

        const machine = machines.find(m => m.id === parseInt(id));

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

        const newReport = {
            id: reportId++,
            machineId: parseInt(id),
            machineName: `Machine #${id}`,
            field: machine.field,
            issueType,
            description,
            priority: priority || 'medium',
            status: 'open',
            reportedAt: new Date().toISOString(),
            resolvedAt: null
        };

        issueReports.push(newReport);

        // Update machine status to maintenance if critical
        if (priority === 'high' || priority === 'critical') {
            const machineIndex = machines.findIndex(m => m.id === parseInt(id));
            machines[machineIndex].status = 'maintenance';
        }

        res.status(201).json({
            success: true,
            message: 'Issue reported successfully',
            data: newReport
        });
    } catch (error) {
        console.error('Error reporting machine issue:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to report machine issue'
        });
    }
};
