import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import SoldierCard from '../components/SoldierCard.jsx';

const API_BASE = 'http://localhost:8000';

const StatusPage = () => {
    const [soldiers, setSoldiers] = useState([]);
    const [search, setSearch] = useState('');
    const [unitFilter, setUnitFilter] = useState('All Units');
    const [rankFilter, setRankFilter] = useState('All Ranks');
    const [openDropdown, setOpenDropdown] = useState(null);

    const units = ['All Units', 'Alpha', 'Bravo', 'Charlie'];
    const ranks = ['All Ranks', 'Captain', 'Sergeant', 'Corporal', 'Private'];

    /* 🔄 Fetch soldiers + latest helmet/sensor/location */
    const fetchAllData = async () => {
        try {
            const res = await fetch(`${API_BASE}/soldiers/`);
            const baseSoldiers = await res.json();

            const enriched = await Promise.all(
                baseSoldiers.map(async (s) => {
                    try {
                        // HELMET INFO
                        const helmetRes = await fetch(
                            `${API_BASE}/soldiers/${s.soldier_id}/helmet`
                        );
                        const helmetRaw = await helmetRes.json();

                        let helmet = null;

                        if (helmetRaw?.helmet_id) {
                            helmet = {
                                helmet_id: helmetRaw.helmet_id,
                                status: helmetRaw.helmet_status,
                            };
                        }

                        // SENSOR (LATEST)
                        let latest_sensor = null;
                        if (helmet?.helmet_id) {
                            const sensorRes = await fetch(
                                `${API_BASE}/sensors/${helmet.helmet_id}`
                            );
                            const sensors = await sensorRes.json();
                            latest_sensor = sensors.at(-1) ?? null;
                        }

                        return {
                            soldier_id: s.soldier_id,
                            name: s.name,
                            rank: s.rank,
                            unit: s.unit,
                            helmet,
                            latest_sensor,
                        };
                    } catch {
                        return {
                            soldier_id: s.soldier_id,
                            name: s.name,
                            rank: s.rank,
                            unit: s.unit,
                            helmet: null,
                            latest_sensor: null,
                        };
                    }
                })
            );

            setSoldiers(enriched);
        } catch (err) {
            console.error('❌ Failed to load soldiers:', err);
        }
    };

    /* Initial load */
    useEffect(() => {
        fetchAllData();
    }, []);

    /* 🌐 WebSocket updates */
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/locations');

        ws.onmessage = () => {
            fetchAllData(); // status refresh only
        };

        return () => ws.close();
    }, []);

    /* 🔍 Filters + Search */
    const filteredSoldiers = useMemo(() => {
        let list = [...soldiers];

        if (unitFilter !== 'All Units') {
            list = list.filter((s) => s.unit === unitFilter);
        }

        if (rankFilter !== 'All Ranks') {
            list = list.filter((s) => s.rank === rankFilter);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (s) =>
                    s.name.toLowerCase().includes(q) ||
                    s.soldier_id.toString().includes(q)
            );
        }

        return list;
    }, [soldiers, search, unitFilter, rankFilter]);

    const accentColor =
        unitFilter !== 'All Units'
            ? 'text-green-400 border-green-500'
            : rankFilter !== 'All Ranks'
                ? 'text-purple-400 border-purple-500'
                : 'text-slate-300 border-slate-600';

    return (
        <main className="flex-1 overflow-auto p-4 md:p-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h1 className="text-3xl font-extrabold text-white">
                    Live Soldier Status
                </h1>

                <div className="flex flex-wrap gap-3 relative">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-2.5 text-slate-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search soldier ID or name..."
                            className="bg-slate-800 text-slate-200 pl-9 pr-4 py-2 rounded-lg border border-slate-700 w-64"
                        />
                    </div>

                    {/* Unit Filter */}
                    <div className="relative">
                        <button
                            onClick={() =>
                                setOpenDropdown(openDropdown === 'unit' ? null : 'unit')
                            }
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${accentColor} hover:bg-slate-800 transition`}
                        >
                            <Filter size={18} />
                            <span>{unitFilter}</span>
                        </button>

                        {openDropdown === 'unit' && (
                            <div className="absolute right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg w-40 z-20">
                                {units.map((u) => (
                                    <div
                                        key={u}
                                        onClick={() => {
                                            setUnitFilter(u);
                                            setOpenDropdown(null);
                                        }}
                                        className={`px-4 py-2 cursor-pointer hover:bg-slate-700 ${unitFilter === u
                                                ? 'bg-slate-700 text-blue-400 font-semibold'
                                                : 'text-slate-300'
                                            }`}
                                    >
                                        {u}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Rank Filter */}
                    <div className="relative">
                        <button
                            onClick={() =>
                                setOpenDropdown(openDropdown === 'rank' ? null : 'rank')
                            }
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${accentColor} hover:bg-slate-800 transition`}
                        >
                            <Filter size={18} />
                            <span>{rankFilter}</span>
                        </button>

                        {openDropdown === 'rank' && (
                            <div className="absolute right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg w-40 z-20">
                                {ranks.map((r) => (
                                    <div
                                        key={r}
                                        onClick={() => {
                                            setRankFilter(r);
                                            setOpenDropdown(null);
                                        }}
                                        className={`px-4 py-2 cursor-pointer hover:bg-slate-700 ${rankFilter === r
                                                ? 'bg-slate-700 text-blue-400 font-semibold'
                                                : 'text-slate-300'
                                            }`}
                                    >
                                        {r}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Soldier Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {filteredSoldiers.length > 0 ? (
                    filteredSoldiers.map((s) => (
                        <SoldierCard key={s.soldier_id} soldier={s} />
                    ))
                ) : (
                    <div className="col-span-full text-center p-10 bg-slate-800/50 rounded-xl text-slate-400">
                        No matching soldiers.
                    </div>
                )}
            </div>
        </main>
    );
};

export default StatusPage;