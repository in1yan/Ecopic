import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WorkerRecord {
    id: number;
    name: string;
    date: string;
    hours: number;
    cost: number;
    picked: number;
}

interface WorkerContextType {
    records: WorkerRecord[];
    addRecord: (record: Omit<WorkerRecord, 'id'>) => void;
    deleteRecord: (id: number) => void;
    stats: {
        totalWorkers: number;
        totalCost: number;
        avgEfficiency: string;
    };
    topPerformers: { name: string; picked: number; cost: number }[];
}

const WorkerContext = createContext<WorkerContextType | undefined>(undefined);

export const WorkerProvider = ({ children }: { children: ReactNode }) => {
    // Initialize from localStorage if available, otherwise default array
    const [records, setRecords] = useState<WorkerRecord[]>(() => {
        const saved = localStorage.getItem('worker_records');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('worker_records', JSON.stringify(records));
    }, [records]);

    const addRecord = (record: Omit<WorkerRecord, 'id'>) => {
        const newRecord = { ...record, id: Date.now() };
        setRecords(prev => [...prev, newRecord]);
    };

    const deleteRecord = (id: number) => {
        setRecords(prev => prev.filter(r => r.id !== id));
    };

    // Calculate derived stats
    const stats = React.useMemo(() => {
        const uniqueWorkers = new Set(records.map(r => r.name)).size;
        const totalCost = records.reduce((sum, r) => sum + r.cost, 0);
        const totalHours = records.reduce((sum, r) => sum + r.hours, 0);
        const totalPicked = records.reduce((sum, r) => sum + r.picked, 0);
        // Avoid division by zero
        const avgEfficiency = totalHours > 0 ? (totalPicked / totalHours).toFixed(2) + ' kg/hr' : '0 kg/hr';

        return {
            totalWorkers: uniqueWorkers,
            totalCost,
            avgEfficiency
        };
    }, [records]);

    const topPerformers = React.useMemo(() => {
        const agg: Record<string, { name: string; picked: number; cost: number }> = {};
        records.forEach(r => {
            if (!agg[r.name]) {
                agg[r.name] = { name: r.name, picked: 0, cost: 0 };
            }
            agg[r.name].picked += r.picked;
            agg[r.name].cost += r.cost;
        });
        // Sort by picked amount descending and take top 3
        return Object.values(agg)
            .sort((a, b) => b.picked - a.picked)
            .slice(0, 3);
    }, [records]);

    return (
        <WorkerContext.Provider value={{ records, addRecord, deleteRecord, stats, topPerformers }}>
            {children}
        </WorkerContext.Provider>
    );
};

export const useWorkerContext = () => {
    const context = useContext(WorkerContext);
    if (context === undefined) {
        throw new Error('useWorkerContext must be used within a WorkerProvider');
    }
    return context;
};
