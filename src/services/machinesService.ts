const API_BASE_URL = 'http://localhost:3001/api';

interface Machine {
    id: number;
    field: string;
    battery: number;
    temp: number;
    trash: number;
    bags: number;
    status: 'online' | 'offline' | 'maintenance';
    location?: {
        lat: number;
        lng: number;
    };
    lastUpdated: string;
}

interface MachineStats {
    total: number;
    online: number;
    offline: number;
    maintenance: number;
    totalBags: number;
    avgBattery: string;
    efficiency: string;
}

interface IssueReport {
    id: number;
    machineId: number;
    machineName: string;
    field: string;
    issueType: string;
    description: string;
    priority: string;
    status: string;
    reportedAt: string;
    resolvedAt: string | null;
}

export const machinesService = {
    // Get all machines
    async getAllMachines(): Promise<Machine[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/machines`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch machines');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching machines:', error);
            throw error;
        }
    },

    // Get machine statistics
    async getMachineStats(): Promise<MachineStats> {
        try {
            const response = await fetch(`${API_BASE_URL}/machines/stats`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch machine stats');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching machine stats:', error);
            throw error;
        }
    },

    // Get machine by ID
    async getMachineById(id: number): Promise<Machine> {
        try {
            const response = await fetch(`${API_BASE_URL}/machines/${id}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch machine');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching machine:', error);
            throw error;
        }
    },

    // Update machine status
    async updateMachineStatus(id: number, updates: Partial<Omit<Machine, 'id' | 'field' | 'location'>>): Promise<Machine> {
        try {
            const response = await fetch(`${API_BASE_URL}/machines/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to update machine status');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error updating machine status:', error);
            throw error;
        }
    },

    // Report machine issue
    async reportIssue(machineId: number, issueData: {
        issueType: string;
        description: string;
        priority?: string;
    }): Promise<IssueReport> {
        try {
            const response = await fetch(`${API_BASE_URL}/machines/${machineId}/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(issueData),
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to report issue');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error reporting issue:', error);
            throw error;
        }
    }
};
