import React, { useEffect, useMemo, useState } from 'react';
import { Plus, MoreVertical, Filter } from 'lucide-react';
import CreateSoldierModal from '../components/CreateSoldierModal.jsx';
import EditSoldierModal from '../components/EditSoldierModal.jsx';

const API_BASE = 'http://localhost:8000';

const SoldierPage = () => {
    const [soldiers, setSoldiers] = useState([]);
    const [selectedSoldier, setSelectedSoldier] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [unitFilter, setUnitFilter] = useState('All');

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
        const res = await fetch(`${API_BASE}/soldiers/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (res.ok) fetchSoldiers();
        setShowCreateModal(false);
    };

    const handleEdit = async (id, data) => {
        await fetch(`${API_BASE}/soldiers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        fetchSoldiers();
        setSelectedSoldier(null);
    };

    const handleRemove = async (id) => {
        await fetch(`${API_BASE}/soldiers/${id}`, { method: 'DELETE' });
        fetchSoldiers();
        setSelectedSoldier(null);
    };

    const filteredSoldiers = useMemo(() => {
        if (unitFilter === 'All') return soldiers;
        return soldiers.filter((s) => s.unit === unitFilter);
    }, [soldiers, unitFilter]);

    return (
        <main className="flex-1 overflow-auto p-4 md:p-8">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-white">
                    Soldier Management
                </h1>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                    <Plus size={18} />
                    Add Soldier
                </button>
            </header>

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

            {showCreateModal && (
                <CreateSoldierModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreate}
                />
            )}

            {selectedSoldier && (
                <EditSoldierModal
                    soldier={selectedSoldier}
                    onClose={() => setSelectedSoldier(null)}
                    onSave={handleEdit}
                    onRemove={handleRemove}
                />
            )}
        </main>
    );
};

export default SoldierPage;
