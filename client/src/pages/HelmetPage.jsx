import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Filter, Plus, MoreVertical } from 'lucide-react';
import HelmetConnectModal from '../components/HelmetConnectModal.jsx';
import HelmetCreateModal from '../components/HelmetCreateModal.jsx';

const API_BASE = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000/ws'; // WebSocket endpoint

const HelmetPage = ({ soldiers }) => {
    const [helmets, setHelmets] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [openDropdown, setOpenDropdown] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedHelmet, setSelectedHelmet] = useState(null);
    const wsRef = useRef(null);

    // --- Fetch helmets ---
    const fetchHelmets = async () => {
        try {
            const res = await fetch(`${API_BASE}/helmets/`);
            if (!res.ok) throw new Error('Failed to fetch helmets');
            const data = await res.json();
            setHelmets(data);
        } catch (err) {
            console.error('❌ Failed to load helmets:', err);
        }
    };

    // --- WebSocket Setup ---
    useEffect(() => {
        fetchHelmets(); // initial load
        wsRef.current = new WebSocket(WS_URL);

        wsRef.current.onopen = () => console.log('📡 WebSocket connected (HelmetPage)');
        wsRef.current.onclose = () => console.log('🔌 WebSocket disconnected');
        wsRef.current.onerror = (err) => console.error('⚠️ WebSocket error:', err);

        wsRef.current.onmessage = (event) => {
            console.log('📨 WebSocket message:', event.data);

            // Reload helmets only if event mentions "helmet"
            const msg = event.data.toLowerCase();
            if (msg.includes('helmet')) {
                console.log('🔁 Updating helmets (WebSocket event detected)');
                fetchHelmets();
            }
        };

        return () => wsRef.current?.close();
    }, []);

    // --- Add Helmet ---
    const handleAddHelmet = async (newHelmet) => {
        try {
            const res = await fetch(`${API_BASE}/helmets/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newHelmet.status }),
            });
            if (!res.ok) throw new Error('Failed to add helmet');
            const added = await res.json();
            setHelmets((prev) => [...prev, added]);
        } catch (err) {
            console.error('❌ Error adding helmet:', err);
        }
    };

    // --- Remove Helmet ---
    const handleRemoveHelmet = async (helmet_id) => {
        try {
            const res = await fetch(`${API_BASE}/helmets/${helmet_id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to remove helmet');
            setHelmets((prev) => prev.filter((h) => h.helmet_id !== helmet_id));
        } catch (err) {
            console.error('❌ Error removing helmet:', err);
        }
    };

    // --- Assign / Unassign / Reassign Helmet ---
    const handleConnectHelmet = async (helmet_id, soldier_id) => {
        try {
            let url;

            if (!soldier_id) {
                url = `${API_BASE}/helmets/${helmet_id}/unassign`;
            } else {
                const currentHelmet = helmets.find((h) => h.helmet_id === helmet_id);
                if (currentHelmet?.assigned_soldier_id) {
                    if (currentHelmet.assigned_soldier_id === soldier_id) {
                        alert(`⚠️ Helmet #${helmet_id} is already assigned to Soldier #${soldier_id}.`);
                        return;
                    }
                    if (
                        !window.confirm(
                            `⚠️ Helmet #${helmet_id} is currently assigned to Soldier #${currentHelmet.assigned_soldier_id}. Reassign to Soldier #${soldier_id}?`
                        )
                    ) {
                        return;
                    }
                    url = `${API_BASE}/helmets/${helmet_id}/reassign/${soldier_id}`;
                } else {
                    url = `${API_BASE}/helmets/${helmet_id}/assign/${soldier_id}`;
                }
            }

            const res = await fetch(url, { method: 'PUT' });
            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg);
            }

            const updated = await res.json();
            console.log('✅ Helmet updated:', updated);
            await fetchHelmets();
        } catch (err) {
            console.error('❌ Error connecting helmet:', err);
            alert(`Error: ${err.message}`);
        }
    };

    // --- Filtered Helmets ---
    const filteredHelmets = useMemo(() => {
        let list = [...helmets];
        list.sort((a, b) => a.helmet_id - b.helmet_id);
        if (statusFilter !== 'All') {
            list = list.filter((h) => h.status === statusFilter.toLowerCase());
        }
        return list;
    }, [helmets, statusFilter]);

    const statuses = ['All', 'active', 'inactive', 'maintenance'];

    return (
        <main className="flex-1 overflow-auto p-4 md:p-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                <h1 className="text-3xl font-extrabold text-white">Helmet Management</h1>

                <div className="flex gap-3">
                    {/* Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenDropdown(!openDropdown)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800 transition"
                        >
                            <Filter size={18} />
                            <span>{statusFilter}</span>
                        </button>
                        {openDropdown && (
                            <div className="absolute right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg w-40 z-20">
                                {statuses.map((option) => (
                                    <div
                                        key={option}
                                        onClick={() => {
                                            setStatusFilter(option);
                                            setOpenDropdown(false);
                                        }}
                                        className={`px-4 py-2 cursor-pointer hover:bg-slate-700 transition ${
                                            statusFilter === option
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

                    {/* Add Helmet */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
                    >
                        <Plus size={18} />
                        <span>Add Helmet</span>
                    </button>
                </div>
            </header>

            {/* Helmet Table */}
            <div className="bg-slate-800/60 rounded-xl shadow-xl overflow-hidden border border-slate-700">
                <table className="w-full text-left text-slate-300">
                    <thead className="bg-slate-900/70 text-slate-200 text-sm uppercase tracking-wide">
                        <tr>
                            <th className="px-6 py-3">Helmet ID</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Assigned Soldier</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHelmets.length > 0 ? (
                            filteredHelmets.map((h) => (
                                <tr
                                    key={h.helmet_id}
                                    className="border-t border-slate-700 hover:bg-slate-700/30 transition"
                                >
                                    <td className="px-6 py-4 font-semibold">{h.helmet_id}</td>
                                    <td className="px-6 py-4 capitalize">{h.status}</td>
                                    <td className="px-6 py-4">
                                        {h.assigned_soldier_id ? <>#{h.assigned_soldier_id}</> : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedHelmet(h)}
                                            className="p-2 rounded-lg hover:bg-slate-600 transition"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-slate-500 italic">
                                    No helmets match the current filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <HelmetCreateModal
                    onClose={() => setShowCreateModal(false)}
                    onAdd={handleAddHelmet}
                />
            )}

            {selectedHelmet && (
                <HelmetConnectModal
                    helmet={selectedHelmet}
                    onClose={() => setSelectedHelmet(null)}
                    onConnect={handleConnectHelmet}
                    onRemove={handleRemoveHelmet}
                />
            )}
        </main>
    );
};

export default HelmetPage;
