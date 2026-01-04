import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Filter, Plus, Trash2 } from 'lucide-react';
import HelmetCreateModal from '../components/HelmetCreateModal.jsx';

const API_BASE = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000/ws';

// Temp mock data
// const MOCK_HELMETS = [
//     { helmet_id: 1, status: 'active' },
//     { helmet_id: 2, status: 'inactive' },
//     { helmet_id: 3, status: 'maintenance' },
// ];

const HelmetPage = () => {
    const [helmets, setHelmets] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [openDropdown, setOpenDropdown] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const wsRef = useRef(null);

    // ---------------- FETCH ----------------
    const fetchHelmets = async () => {
        try {
            const res = await fetch(`${API_BASE}/helmets/`);
            if (!res.ok) throw new Error();
            setHelmets(await res.json());
        } catch {
            console.error('Failed to fetch helmets');
        }
    };

    // ---------------- ADD ----------------
    const handleAddHelmet = async () => {
    try {
        const res = await fetch(
            `${API_BASE}/helmets?status=inactive`,
            { method: 'POST' }
        );

        if (!res.ok) throw new Error();

        fetchHelmets(); // refresh list
    } catch {
        alert('Failed to add helmet');
    }
};

    // ---------------- DELETE ----------------
    const deleteHelmet = async (helmet_id) => {
        if (!window.confirm(`Delete helmet #${helmet_id}?`)) return;

        try {
            const res = await fetch(`${API_BASE}/helmets/${helmet_id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error();

            setHelmets((prev) =>
                prev.filter((h) => h.helmet_id !== helmet_id)
            );
        } catch {
            alert('Failed to delete helmet');
        }
    };

    // ---------------- STATUS UPDATE ----------------
    const handleStatusChange = async (helmet_id, status) => {
        setHelmets((prev) =>
            prev.map((h) =>
                h.helmet_id === helmet_id ? { ...h, status } : h
            )
        );

        try {
            await fetch(`${API_BASE}/helmets/${helmet_id}/status?status=${status}`, {
            method: 'PUT',
        });
        } catch {
            fetchHelmets(); // rollback
        }
    };

    // ---------------- WEBSOCKET ----------------
    useEffect(() => {
        // setHelmets(MOCK_HELMETS); // dev
        fetchHelmets();

        wsRef.current = new WebSocket(WS_URL);

        wsRef.current.onmessage = (e) => {
            if (e.data.toLowerCase().includes('helmet')) {
                fetchHelmets();
            }
        };

        return () => wsRef.current?.close();
    }, []);

    // ---------------- FILTER ----------------
    const filteredHelmets = useMemo(() => {
        let list = [...helmets].sort((a, b) => a.helmet_id - b.helmet_id);
        if (statusFilter !== 'All') {
            list = list.filter(
                (h) => h.status === statusFilter.toLowerCase()
            );
        }
        return list;
    }, [helmets, statusFilter]);

    const statuses = ['All', 'active', 'inactive', 'maintenance'];

    return (
        <main className="flex-1 p-6">
            {/* HEADER */}
            <header className="flex justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">
                    Helmet Management
                </h1>

                <div className="flex items-center gap-3">
                    {/* FILTER */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenDropdown(!openDropdown)}
                            className="flex items-center gap-2 h-10 px-4 rounded-lg
                       border border-slate-600
                       bg-slate-800 text-slate-200
                       hover:bg-slate-700
                       transition"
                        >
                            <Filter size={16} className="text-slate-400" />
                            <span className="capitalize text-sm">
                                {statusFilter}
                            </span>
                        </button>

                        {openDropdown && (
                            <div className="absolute right-0 mt-2 w-40
                            bg-slate-800 border border-slate-700
                            rounded-lg shadow-xl z-20 overflow-hidden">
                                {statuses.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            setStatusFilter(s);
                                            setOpenDropdown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm capitalize
                            hover:bg-slate-700 transition
                            ${statusFilter === s
                                                ? 'bg-slate-700 text-white'
                                                : 'text-slate-300'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ADD HELMET */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 h-10 px-5 rounded-lg
                   bg-blue-600 hover:bg-blue-700
                   text-white font-medium
                   shadow-md shadow-blue-600/30
                   transition"
                    >
                        <Plus size={16} />
                        <span className="text-sm">Add Helmet</span>
                    </button>
                </div>

            </header>

            {/* TABLE */}
            <div className="bg-slate-800 rounded-xl border border-slate-700">
                <table className="w-full text-slate-300">
                    <thead className="bg-slate-900">
                        <tr>
                            <th className="px-6 py-3">Helmet ID</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredHelmets.map((h) => (
                            <tr
                                key={h.helmet_id}
                                className="border-t border-slate-700"
                            >
                                <td className="px-6 py-4 text-center align-middle font-semibold">
                                    #{h.helmet_id}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex justify-center items-center gap-6">
                                        {['active', 'inactive', 'maintenance'].map((s) => (
                                            <label
                                                key={s}
                                                className="flex items-center gap-1 text-sm cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={h.status === s}
                                                    onChange={() =>
                                                        handleStatusChange(h.helmet_id, s)
                                                    }
                                                />
                                                <span className="capitalize">{s}</span>
                                            </label>
                                        ))}
                                    </div>
                                </td>


                                <td className="px-6 py-4 text-center align-middle">
                                    <button
                                        onClick={() => deleteHelmet(h.helmet_id)}
                                        className="inline-flex items-center justify-center text-red-400 hover:text-red-600 transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showCreateModal && (
                <HelmetCreateModal
                    onClose={() => setShowCreateModal(false)}
                    onAdd={handleAddHelmet}
                />
            )}
        </main>
    );
};

export default HelmetPage;
