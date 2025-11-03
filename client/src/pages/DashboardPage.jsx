import React, { useEffect, useMemo, useState } from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Activity, Heart, AlertTriangle, Users } from 'lucide-react';

const DashboardPage = ({ soldiers: initialSoldiers = [] }) => {
    const [soldiers, setSoldiers] = useState(initialSoldiers);

    // --- 🔗 Connect to WebSocket Backend (optional live updates) ---
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080'); // your Node WebSocket server

        ws.onopen = () => {
            ws.send(JSON.stringify({ action: 'get_all' }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (Array.isArray(data)) setSoldiers(data);
            } catch (err) {
                console.error('Invalid message from WebSocket:', event.data);
            }
        };

        ws.onerror = (err) => console.error('WebSocket error:', err);
        return () => ws.close();
    }, []);

    // --- 📊 Derived Statistics ---
    const stats = useMemo(() => {
        const total = soldiers.length || 1;
        const active = soldiers.filter((s) => s.status === 'active').length;
        const fall = soldiers.filter((s) => s.fall_detected).length;
        const critical = soldiers.filter((s) => s.heart_rate === 0).length;
        const avgHR = (soldiers.reduce((sum, s) => sum + (s.heart_rate || 0), 0) / total).toFixed(1);
        const avgTemp = (soldiers.reduce((sum, s) => sum + (s.body_temp || 0), 0) / total).toFixed(1);
        return { total, active, fall, critical, avgHR, avgTemp };
    }, [soldiers]);

    const unitData = useMemo(() => {
        const unitGroups = {};
        soldiers.forEach((s) => {
            unitGroups[s.unit] = (unitGroups[s.unit] || 0) + 1;
        });
        return Object.entries(unitGroups).map(([unit, count]) => ({ unit, count }));
    }, [soldiers]);

    const statusData = [
        { name: 'Active', value: stats.active },
        { name: 'Fall Detected', value: stats.fall },
        { name: 'No Heart Rate', value: stats.critical },
    ];

    const COLORS = ['#10b981', '#facc15', '#ef4444'];

    // --- 💻 UI ---
    return (
        <main className="flex-1 overflow-auto p-6 md:p-8 text-white">
            <h1 className="text-3xl font-extrabold mb-8">📊 Mission Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Total Soldiers */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow">
                    <div className="flex items-center gap-3 mb-2 text-slate-300">
                        <Users className="text-blue-400" />
                        <span className="text-lg font-semibold">Total Soldiers</span>
                    </div>
                    <p className="text-4xl font-extrabold">{stats.total}</p>
                </div>

                {/* Active Soldiers */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow">
                    <div className="flex items-center gap-3 mb-2 text-slate-300">
                        <Activity className="text-green-400" />
                        <span className="text-lg font-semibold">Active Soldiers</span>
                    </div>
                    <p className="text-4xl font-extrabold text-green-400">{stats.active}</p>
                </div>

                {/* Fall Detected */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow">
                    <div className="flex items-center gap-3 mb-2 text-slate-300">
                        <AlertTriangle className="text-yellow-400" />
                        <span className="text-lg font-semibold">Fall Detected</span>
                    </div>
                    <p className="text-4xl font-extrabold text-yellow-400">{stats.fall}</p>
                </div>

                {/* No Heart Rate */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow">
                    <div className="flex items-center gap-3 mb-2 text-slate-300">
                        <Heart className="text-red-400" />
                        <span className="text-lg font-semibold">No Heart Rate</span>
                    </div>
                    <p className="text-4xl font-extrabold text-red-400">{stats.critical}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Unit Distribution */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow">
                    <h2 className="text-xl font-bold mb-4">Unit Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={unitData}>
                            <XAxis dataKey="unit" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Overview */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow">
                    <h2 className="text-xl font-bold mb-4">Status Overview</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Average Stats */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow">
                    <h2 className="text-lg font-semibold text-slate-300 mb-2">Average Heart Rate</h2>
                    <p className="text-3xl font-extrabold text-pink-400">{stats.avgHR} bpm</p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow">
                    <h2 className="text-lg font-semibold text-slate-300 mb-2">
                        Average Body Temperature
                    </h2>
                    <p className="text-3xl font-extrabold text-orange-400">{stats.avgTemp} °C</p>
                </div>
            </div>
        </main>
    );
};

export default DashboardPage;
