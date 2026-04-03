import React, { useEffect, useMemo, useState } from 'react';
import { Plus, MoreVertical, Search, Filter } from 'lucide-react';
import CreateSoldierModal from '../components/CreateSoldierModal.jsx';
import EditSoldierModal from '../components/EditSoldierModal.jsx';

const API_BASE = 'http://localhost:8000';

const units = ['All Units', 'Alpha', 'Bravo', 'Charlie'];
const ranks = ['All Ranks', 'Captain', 'Sergeant', 'Corporal', 'Private'];

const SoldierPage = () => {
    const [soldiers, setSoldiers] = useState([]);
    const [selectedSoldier, setSelectedSoldier] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [search, setSearch] = useState('');
    const [unitFilter, setUnitFilter] = useState('All Units');
    const [rankFilter, setRankFilter] = useState('All Ranks');
    const [openDropdown, setOpenDropdown] = useState(null);

    const fetchSoldiers = async () => {
        try {
            const res = await fetch(`${API_BASE}/soldiers/`);
            const data = await res.json();
            setSoldiers(data);
        } catch (err) {
            console.error('❌ Failed to fetch soldiers:', err);
        }
    };

    useEffect(() => {
        fetchSoldiers();
    }, []);

    const handleCreate = async (data) => {
        try {
            const res = await fetch(`${API_BASE}/soldiers/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error();

            await fetchSoldiers();
            setShowCreateModal(false);
        } catch (err) {
            console.error('❌ Failed to create soldier', err);
        }
    };

    const handleRemove = async (id) => {
        await fetch(`${API_BASE}/soldiers/${id}`, { method: 'DELETE' });
        fetchSoldiers();
        setSelectedSoldier(null);
    };

    // 🔍 FILTERING (same logic as StatusPage)
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

    // 🎨 Dynamic accent color (same behavior)
    const accentColor =
        unitFilter !== 'All Units'
            ? 'text-green-400 border-green-500'
            : rankFilter !== 'All Ranks'
                ? 'text-purple-400 border-purple-500'
                : 'text-slate-300 border-slate-600';

    return (
        <main className="flex-1 overflow-auto p-4 md:p-8">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h1 className="text-3xl font-extrabold text-white">
                    Soldier Management
                </h1>

                <div className="flex flex-wrap gap-3 relative">
                    {/* 🔍 SEARCH */}
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

                    {/* 🪖 UNIT FILTER */}
                    <div className="relative">
                        <button
                            onClick={() =>
                                setOpenDropdown(openDropdown === 'unit' ? null : 'unit')
                            }
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${accentColor}`}
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

                    {/* 🎖 RANK FILTER */}
                    <div className="relative">
                        <button
                            onClick={() =>
                                setOpenDropdown(openDropdown === 'rank' ? null : 'rank')
                            }
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${accentColor}`}
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

                    {/* ➕ ADD */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                        <Plus size={18} />
                        Add Soldier
                    </button>
                </div>
            </header>

            {/* TABLE */}
            <div className="bg-slate-800/60 rounded-xl overflow-hidden border border-slate-700">
                <table className="w-full text-left text-slate-300">
                    <thead className="bg-slate-900/70">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Rank</th>
                            <th className="px-6 py-3">Unit</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredSoldiers.map((s) => (
                            <tr key={s.soldier_id} className="border-t border-slate-700">
                                <td className="px-6 py-4">{s.soldier_id}</td>
                                <td className="px-6 py-4">{s.name}</td>
                                <td className="px-6 py-4">{s.rank}</td>
                                <td className="px-6 py-4">{s.unit}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setSelectedSoldier(s)}
                                        className="p-2 rounded-lg hover:bg-slate-600"
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODALS */}
            {showCreateModal && (
                <CreateSoldierModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreate}
                    ranks={ranks}
                    units={units}
                />
            )}

            {selectedSoldier && (
                <EditSoldierModal
                    soldier={selectedSoldier}
                    onClose={() => setSelectedSoldier(null)}
                    onReload={fetchSoldiers}
                />
            )}
        </main>
    );
};

export default SoldierPage;