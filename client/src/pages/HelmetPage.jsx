import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Filter, Plus, Trash2, Search } from 'lucide-react';
import HelmetCreateModal from '../components/HelmetCreateModal.jsx';

const API_BASE = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000/ws';

const HelmetPage = () => {
    const [helmets, setHelmets] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [searchId, setSearchId] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const wsRef = useRef(null);

    const statuses = ['All Status', 'active', 'inactive', 'maintenance'];

    const fetchHelmets = async () => {
        try {
            const res = await fetch(`${API_BASE}/helmets/`);
            if (!res.ok) throw new Error();
            setHelmets(await res.json());
        } catch {
            console.error('Failed to fetch helmets');
        }
    };

    const handleAddHelmet = async () => {
        try {
            const res = await fetch(
                `${API_BASE}/helmets?status=inactive`,
                { method: 'POST' }
            );

            if (!res.ok) throw new Error();

            fetchHelmets();
        } catch {
            alert('Failed to add helmet');
        }
    };

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

    const handleStatusChange = async (helmet_id, status) => {
        setHelmets((prev) =>
            prev.map((h) =>
                h.helmet_id === helmet_id ? { ...h, status } : h
            )
        );

        try {
            await fetch(
                `${API_BASE}/helmets/${helmet_id}/status?status=${status}`,
                { method: 'PUT' }
            );
        } catch {
            fetchHelmets();
        }
    };

    useEffect(() => {
        fetchHelmets();

        wsRef.current = new WebSocket(WS_URL);

        wsRef.current.onmessage = (e) => {
            if (e.data.toLowerCase().includes('helmet')) {
                fetchHelmets();
            }
        };

        return () => wsRef.current?.close();
    }, []);

    const filteredHelmets = useMemo(() => {
        let list = [...helmets].sort((a, b) => a.helmet_id - b.helmet_id);

        if (statusFilter !== 'All Status') {
            list = list.filter((h) => h.status === statusFilter);
        }

        if (searchId.trim()) {
            list = list.filter((h) =>
                h.helmet_id.toString().includes(searchId.trim())
            );
        }

        return list;
    }, [helmets, statusFilter, searchId]);

    const accentColor =
        statusFilter !== 'All Status'
            ? 'text-blue-400 border-blue-500'
            : 'text-slate-300 border-slate-600';

    return (
        <main className="flex-1 p-6">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white">
                    Helmet Management
                </h1>

                <div className="flex flex-wrap gap-3 relative">
                    {/* SEARCH */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-2.5 text-slate-400"
                        />
                        <input
                            value={searchId}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (/^\d*$/.test(val)) setSearchId(val);
                            }}
                            placeholder="Search helmet ID..."
                            className="bg-slate-800 text-slate-200 pl-9 pr-4 py-2 rounded-lg border border-slate-700 w-56"
                        />
                    </div>

                    {/* FILTER */}
                    <div className="relative">
                        <button
                            onClick={() =>
                                setOpenDropdown(openDropdown === 'status' ? null : 'status')
                            }
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${accentColor}`}
                        >
                            <Filter size={18} />
                            <span className="capitalize">{statusFilter}</span>
                        </button>

                        {openDropdown === 'status' && (
                            <div className="absolute right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg w-40 z-20">
                                {statuses.map((s) => (
                                    <div
                                        key={s}
                                        onClick={() => {
                                            setStatusFilter(s);
                                            setOpenDropdown(null);
                                        }}
                                        className={`px-4 py-2 cursor-pointer hover:bg-slate-700 ${statusFilter === s
                                                ? 'bg-slate-700 text-blue-400 font-semibold'
                                                : 'text-slate-300'
                                            }`}
                                    >
                                        {s}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ADD */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        <Plus size={18} />
                        Add Helmet
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
                            <tr key={h.helmet_id} className="border-t border-slate-700">
                                <td className="px-6 py-4 text-center font-semibold">
                                    #{h.helmet_id}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-6">
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

                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => deleteHelmet(h.helmet_id)}
                                        className="text-red-400 hover:text-red-600 transition"
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