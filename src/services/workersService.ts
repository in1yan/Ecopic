const API_BASE_URL = 'http://localhost:3001/api';

interface Worker {
    id: number;
    name: string;
    date: string;
    hours: number;
    cost: number;
    picked: number;
}

interface WorkerStats {
    totalWorkers: number;
    totalCost: number;
    totalHours: number;
    totalPicked: number;
    avgEfficiency: string;
}

export const workersService = {
    // Get all worker records
    async getAllWorkers(): Promise<Worker[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/workers`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch workers');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching workers:', error);
            throw error;
        }
    },

    // Get worker statistics
    async getWorkerStats(): Promise<WorkerStats> {
        try {
            const response = await fetch(`${API_BASE_URL}/workers/stats`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch worker stats');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching worker stats:', error);
            throw error;
        }
    },

    // Get worker by ID
    async getWorkerById(id: number): Promise<Worker> {
        try {
            const response = await fetch(`${API_BASE_URL}/workers/${id}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch worker');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching worker:', error);
            throw error;
        }
    },

    // Add new worker record
    async addWorker(workerData: Omit<Worker, 'id'>): Promise<Worker> {
        try {
            const response = await fetch(`${API_BASE_URL}/workers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workerData),
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to add worker');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error adding worker:', error);
            throw error;
        }
    },

    // Delete worker record
    async deleteWorker(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/workers/${id}`, {
                method: 'DELETE',
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to delete worker');
            }
        } catch (error) {
            console.error('Error deleting worker:', error);
            throw error;
        }
    }
};
