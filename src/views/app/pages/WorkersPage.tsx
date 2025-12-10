import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Users, DollarSign, Activity, TrendingUp } from "lucide-react";
import { useWorkerContext } from "@/context/WorkerContext";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

export const WorkersPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
    const { records, addRecord, deleteRecord, stats } = useWorkerContext();

    // State for form inputs
    const [formData, setFormData] = useState({
        name: '',
        date: new Date().toISOString().split('T')[0],
        hours: '',
        cost: '',
        picked: ''
    });

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    // Handle Form Input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Add New Record
    const handleAddRecord = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.hours || !formData.cost || !formData.picked) return;

        addRecord({
            name: formData.name,
            date: formData.date,
            hours: parseFloat(formData.hours),
            cost: parseFloat(formData.cost),
            picked: parseFloat(formData.picked)
        });

        setFormData({ name: '', date: new Date().toISOString().split('T')[0], hours: '', cost: '', picked: '' });
    };

    // Remove Record
    const handleDelete = (id: number) => {
        deleteRecord(id);
    };



    // Data for Charts
    const barChartData = useMemo(() => {
        // Aggregate by person
        const agg: Record<string, { name: string, cost: number, hours: number, picked: number }> = {};
        records.forEach(r => {
            if (!agg[r.name]) agg[r.name] = { name: r.name, cost: 0, hours: 0, picked: 0 };
            agg[r.name].cost += r.cost;
            agg[r.name].hours += r.hours;
            agg[r.name].picked += r.picked;
        });
        return Object.values(agg);
    }, [records]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto pb-10"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-['Orbitron']">Worker Management</h1>
                    <p className="text-zinc-400 text-lg">Track hours, costs, and efficiency per worker.</p>
                </div>
                <button
                    onClick={() => onNavigate('dashboard')}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center gap-4">
                    <div className="p-4 bg-blue-500/20 rounded-xl text-blue-400">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-zinc-400 text-sm">Total Workers (Month)</div>
                        <div className="text-3xl font-bold text-white">{stats.totalWorkers}</div>
                    </div>
                </div>
                <div className="p-6 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center gap-4">
                    <div className="p-4 bg-emerald-500/20 rounded-xl text-emerald-400">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-zinc-400 text-sm">Total Salary Paid</div>
                        <div className="text-3xl font-bold text-white">₹{stats.totalCost.toLocaleString()}</div>
                    </div>
                </div>
                <div className="p-6 bg-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center gap-4">
                    <div className="p-4 bg-purple-500/20 rounded-xl text-purple-400">
                        <Activity className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-zinc-400 text-sm">Avg Efficiency (kg/hr)</div>
                        <div className="text-3xl font-bold text-white">{stats.avgEfficiency}</div>
                    </div>
                </div>
            </div>

            {/* Input Form */}
            <div className="p-6 bg-black/40 border border-white/10 rounded-2xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-400" /> Add Daily Entry
                </h3>
                <form onSubmit={handleAddRecord} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-zinc-400 text-xs mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-400 text-xs mb-1">Worker Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-400 text-xs mb-1">Hours Worked</label>
                        <input
                            type="number"
                            name="hours"
                            placeholder="e.g. 8"
                            value={formData.hours}
                            onChange={handleInputChange}
                            step="0.1"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-400 text-xs mb-1">Daily Cost (₹)</label>
                        <input
                            type="number"
                            name="cost"
                            placeholder="e.g. 500"
                            value={formData.cost}
                            onChange={handleInputChange}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-400 text-xs mb-1">Amount Picked (kg)</label>
                        <input
                            type="number"
                            name="picked"
                            placeholder="e.g. 120"
                            value={formData.picked}
                            onChange={handleInputChange}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div className="md:col-start-5">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Record
                        </button>
                    </div>
                </form>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Bar Chart: Worker Performance */}
                <div className="p-6 bg-black/40 border border-white/10 rounded-2xl min-h-[400px]">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" /> Worker Performance
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" label={{ value: 'Cost (₹)', angle: -90, position: 'insideLeft', fill: '#3b82f6' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#10b981" label={{ value: 'Picked (kg)', angle: 90, position: 'insideRight', fill: '#10b981' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="cost" name="Total Cost (₹)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="picked" name="Total Picked (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart: Cost Distribution */}
                <div className="p-6 bg-black/40 border border-white/10 rounded-2xl min-h-[400px]">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-purple-400" /> Salary Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={barChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="cost"
                            >
                                {barChartData.map((_entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Input Log Table */}
            <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">Daily Entry Logs</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-zinc-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold text-right">Hours</th>
                                <th className="p-4 font-semibold text-right">Picked (kg)</th>
                                <th className="p-4 font-semibold text-right">Cost (₹)</th>
                                <th className="p-4 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-zinc-500">
                                        No entries yet. Add a record above.
                                    </td>
                                </tr>
                            ) : (
                                records.slice().reverse().map((record) => (
                                    <tr key={record.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-zinc-300">{record.date}</td>
                                        <td className="p-4 text-white font-medium">{record.name}</td>
                                        <td className="p-4 text-zinc-300 text-right">{record.hours}</td>
                                        <td className="p-4 text-zinc-300 text-right">{record.picked}</td>
                                        <td className="p-4 text-emerald-400 font-bold text-right">₹{record.cost}</td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDelete(record.id)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};
