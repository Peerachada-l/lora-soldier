import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import SoldierCard from '../components/SoldierCard.jsx';

/**
 * StatusPage Component
 * Displays the main grid of soldier status cards with search and multi-filter (unit + rank).
 */
const StatusPage = ({ soldiers }) => {
    const [search, setSearch] = useState('');
    const [unitFilter, setUnitFilter] = useState('All Units');
    const [rankFilter, setRankFilter] = useState('All Ranks');
    const [openDropdown, setOpenDropdown] = useState(null); // "unit" | "rank" | null

    // --- Combined search + filter logic ---
    const filteredSoldiers = useMemo(() => {
        let list = [...soldiers];

        if (unitFilter !== 'All Units') {
            list = list.filter((s) => s.unit === unitFilter);
        }

        if (rankFilter !== 'All Ranks') {
            list = list.filter((s) => s.rank === rankFilter);
        }

        if (search.trim()) {
            const query = search.toLowerCase();
            list = list.filter(
                (s) =>
                    s.name.toLowerCase().includes(query) ||
                    s.soldier_id.toString().includes(query)
            );
        }

        return list;
    }, [soldiers, unitFilter, rankFilter, search]);

    // --- Accent color logic based on filters ---
    const accentColor = (() => {
        if (unitFilter !== 'All Units') {
            switch (unitFilter) {
                case 'Alpha': return 'text-green-400 border-green-500';
                case 'Bravo': return 'text-yellow-400 border-yellow-500';
                case 'Charlie': return 'text-blue-400 border-blue-500';
                default: return 'text-slate-300 border-slate-600';
            }
        }
        if (rankFilter !== 'All Ranks') {
            return 'text-purple-400 border-purple-500';
        }
        return 'text-slate-300 border-slate-600';
    })();

    const units = ['All Units', 'Alpha', 'Bravo', 'Charlie'];
    const ranks = ['All Ranks', 'Captain', 'Sergeant', 'Corporal', 'Private'];

    return (
        <main className="flex-1 overflow-auto p-4 md:p-8">
            {/* Header / Filters */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                <h1 className="text-3xl font-extrabold text-white">Unit Status Overview</h1>

                {/* Search + Filter Controls */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 relative">
                    {/* 🔍 Search Bar */}
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

                    {/* 🧭 Unit Filter */}
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
                                {units.map((option) => (
                                    <div
                                        key={option}
                                        onClick={() => {
                                            setUnitFilter(option);
                                            setOpenDropdown(null);
                                        }}
                                        className={`px-4 py-2 cursor-pointer hover:bg-slate-700 transition ${unitFilter === option
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

                    {/* 🧢 Rank Filter */}
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
                                {ranks.map((option) => (
                                    <div
                                        key={option}
                                        onClick={() => {
                                            setRankFilter(option);
                                            setOpenDropdown(null);
                                        }}
                                        className={`px-4 py-2 cursor-pointer hover:bg-slate-700 transition ${rankFilter === option
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
                </div>
            </header>

            {/* 🪖 Soldier Cards Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {filteredSoldiers.length > 0 ? (
                    filteredSoldiers.map((soldier) => (
                        <SoldierCard key={soldier.soldier_id} soldier={soldier} />
                    ))
                ) : (
                    <div className="md:col-span-2 lg:col-span-3 text-center p-10 bg-slate-800/50 rounded-xl text-slate-400">
                        No soldiers match the current filter criteria.
                    </div>
                )}
            </div>
        </main>
    );
};

export default StatusPage;