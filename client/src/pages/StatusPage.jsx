import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import SoldierCard from '../components/SoldierCard.jsx';

const StatusPage = () => {
    const [soldiers, setSoldiers] = useState([]);
    const [search, setSearch] = useState('');
    const [unitFilter, setUnitFilter] = useState('All Units');
    const [rankFilter, setRankFilter] = useState('All Ranks');
    const [openDropdown, setOpenDropdown] = useState(null);

    const API_BASE = 'http://localhost:8000';

    // ✅ Fetch all soldiers and their related data
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // 1️⃣ Get all soldiers
                const res = await fetch(`${API_BASE}/soldiers/`);
                const soldiersData = await res.json();

                // 2️⃣ For each soldier, fetch helmet + latest sensor
                const enriched = await Promise.all(
                    soldiersData.map(async (soldier) => {
                        try {
                            // fetch assigned helmet
                            const helmetRes = await fetch(`${API_BASE}/soldiers/${soldier.soldier_id}/helmet`);
                            const helmetData = await helmetRes.json();

                            if (helmetData.helmet_id) {
                                // fetch latest sensor data
                                const sensorRes = await fetch(`${API_BASE}/sensors/${helmetData.helmet_id}`);
                                const sensorData = await sensorRes.json();
                                // console.log("sensor res" + sensorRes)
                                // console.log(sensorData)

                                const locationRes = await fetch(`${API_BASE}/locations/${helmetData.helmet_id}`);
                                const locationData = await locationRes.json();
                                // console.log("location res" + locationRes)
                                // console.log(locationData)

                                // take the latest reading (last item)
                                const latestSensor = sensorData[sensorData.length - 1] || null;
                                const latestLocation = locationData[locationData.length - 1] || null;
                                console.log(latestSensor)
                                console.log(latestLocation)

                                return {
                                    ...soldier,
                                    helmet: helmetData,
                                    sensor: latestSensor,
                                    location: latestLocation,
                                };
                            } else {
                                return { ...soldier, helmet: null, sensor: null, location: null };
                            }
                        } catch {
                            return { ...soldier, helmet: null, sensor: null, location: null };
                        }
                    })
                );

                setSoldiers(enriched);
                console.log('✅ Soldiers with helmet/sensor:', enriched);
            } catch (err) {
                console.error('❌ Failed to load soldiers:', err);
            }
        };

        fetchAllData();
    }, []);

    // 🔍 Filtering logic
    const filteredSoldiers = useMemo(() => {
        let list = [...soldiers];
        if (unitFilter !== 'All Units') list = list.filter(s => s.unit === unitFilter);
        if (rankFilter !== 'All Ranks') list = list.filter(s => s.rank === rankFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.soldier_id.toString().includes(q)
            );
        }
        return list;
    }, [soldiers, search, unitFilter, rankFilter]);

    const units = ['All Units', 'Alpha', 'Bravo', 'Charlie'];
    const ranks = ['All Ranks', 'Captain', 'Sergeant', 'Corporal', 'Private'];

    const accentColor =
        unitFilter !== 'All Units'
            ? 'text-green-400 border-green-500'
            : rankFilter !== 'All Ranks'
            ? 'text-purple-400 border-purple-500'
            : 'text-slate-300 border-slate-600';

    return (
        <main className="flex-1 overflow-auto p-4 md:p-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                <h1 className="text-3xl font-extrabold text-white">Unit Status Overview</h1>

                <div className="flex flex-col md:flex-row md:items-center gap-3 relative">
                    {/* 🔍 Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search soldier name or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-800 text-slate-200 pl-9 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </div>

                    {/* Unit Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenDropdown(openDropdown === 'unit' ? null : 'unit')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${accentColor} hover:bg-slate-800 transition`}
                        >
                            <Filter size={18} />
                            <span>{unitFilter}</span>
                        </button>

                        {openDropdown === 'unit' && (
                            <div className="absolute right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg w-40 z-20">
                                {units.map(option => (
                                    <div
                                        key={option}
                                        onClick={() => {
                                            setUnitFilter(option);
                                            setOpenDropdown(null);
                                        }}
                                        className={`px-4 py-2 cursor-pointer hover:bg-slate-700 transition ${
                                            unitFilter === option
                                                ? 'bg-slate-700 text-blue-400 font-semibold'
                                                : 'text-slate-300'
                                        }`}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Rank Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenDropdown(openDropdown === 'rank' ? null : 'rank')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${accentColor} hover:bg-slate-800 transition`}
                        >
                            <Filter size={18} />
                            <span>{rankFilter}</span>
                        </button>

                        {openDropdown === 'rank' && (
                            <div className="absolute right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg w-40 z-20">
                                {ranks.map(option => (
                                    <div
                                        key={option}
                                        onClick={() => {
                                            setRankFilter(option);
                                            setOpenDropdown(null);
                                        }}
                                        className={`px-4 py-2 cursor-pointer hover:bg-slate-700 transition ${
                                            rankFilter === option
                                                ? 'bg-slate-700 text-blue-400 font-semibold'
                                                : 'text-slate-300'
                                        }`}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Create Soldier Button */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                    >
                        <Plus size={18} />
                        <span>Create Soldier</span>
                    </button>
                </div>
            </header>

            {/* Soldier Cards Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {filteredSoldiers.length > 0 ? (
                    filteredSoldiers.map(s => <SoldierCard key={s.soldier_id} soldier={s} />)
                ) : (
                    <div className="md:col-span-2 lg:col-span-3 text-center p-10 bg-slate-800/50 rounded-xl text-slate-400">
                        No soldiers found in the database.
                    </div>
                )}
            </div>

            {/* Create Soldier Modal */}
            {showModal && (
                <CreateSoldierModal
                    onClose={() => setShowModal(false)}
                    onCreate={onAddSoldier}
                    ranks={ranks}
                    units={units}
                />
            )}
        </main>
    );
};

export default StatusPage;
