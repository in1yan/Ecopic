// Workers Controller with Dummy Data

// In-memory storage for workers (replace with database in production)
let workers = [
    { id: 1, name: 'Rajesh Kumar', date: '2024-12-10', hours: 8, cost: 400, picked: 120 },
    { id: 2, name: 'Priya Sharma', date: '2024-12-10', hours: 7.5, cost: 375, picked: 110 },
    { id: 3, name: 'Amit Patel', date: '2024-12-09', hours: 8, cost: 400, picked: 125 },
    { id: 4, name: 'Sunita Devi', date: '2024-12-09', hours: 6, cost: 300, picked: 95 },
    { id: 5, name: 'Rajesh Kumar', date: '2024-12-09', hours: 7, cost: 350, picked: 105 },
    { id: 6, name: 'Deepak Singh', date: '2024-12-08', hours: 8, cost: 400, picked: 130 },
    { id: 7, name: 'Priya Sharma', date: '2024-12-08', hours: 7, cost: 350, picked: 100 },
    { id: 8, name: 'Amit Patel', date: '2024-12-08', hours: 8.5, cost: 425, picked: 135 }
];

let nextId = 9;

// Get all worker records
export const getAllWorkers = async (req, res) => {
    try {
        res.json({
            success: true,
            data: workers
        });
    } catch (error) {
        console.error('Error fetching workers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch worker records'
        });
    }
};

// Get worker statistics
export const getWorkerStats = async (req, res) => {
    try {
        const totalWorkers = new Set(workers.map(w => w.name)).size;
        const totalCost = workers.reduce((sum, w) => sum + w.cost, 0);
        const totalHours = workers.reduce((sum, w) => sum + w.hours, 0);
        const totalPicked = workers.reduce((sum, w) => sum + w.picked, 0);
        const avgEfficiency = totalHours > 0 ? (totalPicked / totalHours).toFixed(1) : '0';

        const stats = {
            totalWorkers,
            totalCost,
            totalHours,
            totalPicked,
            avgEfficiency
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error calculating worker stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate worker statistics'
        });
    }
};

// Get worker by ID
export const getWorkerById = async (req, res) => {
    try {
        const { id } = req.params;
        const worker = workers.find(w => w.id === parseInt(id));

        if (!worker) {
            return res.status(404).json({
                success: false,
                message: 'Worker record not found'
            });
        }

        res.json({
            success: true,
            data: worker
        });
    } catch (error) {
        console.error('Error fetching worker:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch worker record'
        });
    }
};

// Add new worker record
export const addWorkerRecord = async (req, res) => {
    try {
        const { name, date, hours, cost, picked } = req.body;

        // Validation
        if (!name || !date || !hours || !cost || !picked) {
            return res.status(400).json({
                success: false,
                message: 'All fields (name, date, hours, cost, picked) are required'
            });
        }

        const newWorker = {
            id: nextId++,
            name,
            date,
            hours: parseFloat(hours),
            cost: parseFloat(cost),
            picked: parseFloat(picked)
        };

        workers.push(newWorker);

        res.status(201).json({
            success: true,
            message: 'Worker record added successfully',
            data: newWorker
        });
    } catch (error) {
        console.error('Error adding worker record:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add worker record'
        });
    }
};

// Delete worker record
export const deleteWorkerRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const index = workers.findIndex(w => w.id === parseInt(id));

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Worker record not found'
            });
        }

        workers.splice(index, 1);

        res.json({
            success: true,
            message: 'Worker record deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting worker record:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete worker record'
        });
    }
};
