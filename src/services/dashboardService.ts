import { API_BASE_URL, getAuthHeaders } from '@/config/api';

interface DashboardStats {
    totalWorkers: {
        count: number;
        change: string;
        description: string;
    };
    activeMachines: {
        count: number;
        change: string;
        description: string;
    };
    todaysYield: {
        count: number;
        unit: string;
        description: string;
    };
    cottonBags: {
        count: number;
        change: string;
        description: string;
    };
    monthlyRevenue?: {
        amount: string;
        change: string;
        raw: number;
    };
    netProfit?: {
        amount: string;
        change: string;
        raw: number;
    };
}

interface Inventory {
    currentStock: number;
    maxCapacity: number;
    percentageFull: number;
    totalHarvested: number;
    pendingDelivery: number;
    unit: string;
}

interface Delivery {
    id: number;
    name: string;
    quantity: string;
    date: string;
    status: string;
    statusColor: string;
}

interface Activity {
    id: number;
    time: string;
    activity: string;
    status: string;
}

export const dashboardService = {
    // Get dashboard statistics
    async getStats(): Promise<DashboardStats> {
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
                headers: getAuthHeaders()
            });
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch stats');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    // Get inventory data
    async getInventory(): Promise<Inventory> {
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard/inventory`, {
                headers: getAuthHeaders()
            });
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch inventory');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching inventory:', error);
            throw error;
        }
    },

    // Get deliveries
    async getDeliveries(): Promise<Delivery[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard/deliveries`, {
                headers: getAuthHeaders()
            });
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch deliveries');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            throw error;
        }
    },

    // Get recent activity
    async getActivity(): Promise<Activity[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard/activity`, {
                headers: getAuthHeaders()
            });
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch activity');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching activity:', error);
            throw error;
        }
    },

    // Schedule a new delivery
    async scheduleDelivery(deliveryData: { name: string; quantity: string; date: string }): Promise<Delivery> {
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard/deliveries`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(deliveryData),
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to schedule delivery');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error scheduling delivery:', error);
            throw error;
        }
    }
};
