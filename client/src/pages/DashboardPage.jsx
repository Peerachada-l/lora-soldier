import React, { useEffect, useMemo, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Users, AlertTriangle, Heart } from 'lucide-react';

const API_BASE = 'http://localhost:8000'; 

const DashboardPage = () => {
    const [soldiers, setSoldiers] = useState([]);

   
    const fetchSoldiers = async () => {
        try {
            const res = await fetch(`${API_BASE}/soldiers/detailed`);
            if (!res.ok) throw new Error('Failed to fetch soldiers');
            const data = await res.json();
            setSoldiers(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSoldiers();
        const interval = setInterval(fetchSoldiers, 10000);
        return () => clearInterval(interval);
    }, []);


    const stats = useMemo(() => {
        const total = soldiers.length || 1;
        let fall = 0;
        let dead = 0;
        let sumHR = 0;
        let sumTemp = 0;

        soldiers.forEach((s) => {
            const sensor = s.latest_sensor;
            if (!sensor) return;

            if (sensor.fall_detected) fall += 1;

            if (s.helmet_id && sensor.heart_rate === 0) dead += 1;

            sumHR += sensor.heart_rate || 0;
            sumTemp += sensor.body_temp || 0;
        });

        const avgHR = (sumHR / total).toFixed(1);
        const avgTemp = (sumTemp / total).toFixed(1);

        return { total, fall, dead, avgHR, avgTemp };
    }, [soldiers]);

  
    const unitData = useMemo(() => {
        const units = {};
        soldiers.forEach((s) => {
            units[s.unit] = (units[s.unit] || 0) + 1;
        });
        return Object.entries(units).map(([unit, count]) => ({ unit, count }));
    }, [soldiers]);

    return (
        <main className="flex-1 overflow-auto p-6 md:p-8 text-white">
            <h1 className="text-3xl font-extrabold mb-8">📊 Mission Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow">
                    <div className="flex items-center gap-3 mb-2 text-slate-300">
                        <Users className="text-blue-400" />
                        <span className="text-lg font-semibold">Total Soldiers</span>
                    </div>
                    <p className="text-4xl font-extrabold">{stats.total}</p>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow">
                    <div className="flex items-center gap-3 mb-2 text-slate-300">
                        <AlertTriangle className="text-yellow-400" />
                        <span className="text-lg font-semibold">Fall Detected</span>
                    </div>
                    <p className="text-4xl font-extrabold text-yellow-400">{stats.fall}</p>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow">
                    <div className="flex items-center gap-3 mb-2 text-slate-300">
                        <Heart className="text-red-400" />
                        <span className="text-lg font-semibold">Current Dead</span>
                    </div>
                    <p className="text-4xl font-extrabold text-red-400">{stats.dead}</p>
                </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow mb-10">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
