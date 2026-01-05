import React, { useState } from 'react';
import { X } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const EditSoldierModal = ({ soldier, onClose, onReload }) => {
    const [form, setForm] = useState({
        name: soldier.name || '',
        rank: soldier.rank || '',
        unit: soldier.unit || '',
        helmet_id: soldier.helmet_id ?? '' // allow empty
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.rank.trim() || !form.unit.trim()) {
            alert('Please fill out name, rank, and unit.');
            return;
        }

        setLoading(true);

        try {
            // 1️⃣ Update basic soldier info
            const res = await fetch(`${API_BASE}/soldiers/${soldier.soldier_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name.trim(),
                    rank: form.rank.trim(),
                    unit: form.unit.trim(),
                }),
            });

            if (!res.ok) throw new Error('Failed to update soldier');

            // 2️⃣ Helmet logic
            if (form.helmet_id !== '') {
                // 🪖 Wear helmet
                const wearRes = await fetch(
                    `${API_BASE}/soldiers/${soldier.soldier_id}/wear/${Number(form.helmet_id)}`,
                    { method: 'PUT' }
                );

                if (!wearRes.ok) {
                    const err = await wearRes.json();
                    throw new Error(err.detail || 'Helmet assignment failed');
                }
            } else {
                // ❌ Remove helmet
                await fetch(
                    `${API_BASE}/soldiers/${soldier.soldier_id}/remove-helmet`,
                    { method: 'PUT' }
                );
            }

            alert(`✅ Soldier #${soldier.soldier_id} updated`);
            onClose();
            onReload?.();

        } catch (err) {
            console.error('❌ Error:', err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        if (!window.confirm(`Are you sure you want to remove Soldier #${soldier.soldier_id}?`)) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/soldiers/${soldier.soldier_id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete soldier');

            alert(`🗑️ Soldier #${soldier.soldier_id} removed successfully`);
            onClose();
            onReload?.();
        } catch (err) {
            console.error('❌ Error removing soldier:', err);
            alert('Error removing soldier.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="relative bg-slate-900 p-6 rounded-xl w-full max-w-md border border-slate-700 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white transition"
                    aria-label="Close Modal"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-4">
                    Edit Soldier #{soldier.soldier_id}
                </h2>

                <div className="space-y-3">
                    {/* Name */}
                    <div>
                        <label className="block text-slate-300 text-sm mb-1">Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring focus:ring-blue-500"
                        />
                    </div>

                    {/* Rank */}
                    <div>
                        <label className="block text-slate-300 text-sm mb-1">Rank</label>
                        <input
                            name="rank"
                            value={form.rank}
                            onChange={handleChange}
                            className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring focus:ring-blue-500"
                        />
                    </div>

                    {/* Unit */}
                    <div>
                        <label className="block text-slate-300 text-sm mb-1">Unit</label>
                        <input
                            name="unit"
                            value={form.unit}
                            onChange={handleChange}
                            className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring focus:ring-blue-500"
                        />
                    </div>

                    {/* Helmet ID */}
                    <div>
                        <label className="block text-slate-300 text-sm mb-1">
                            Helmet ID
                        </label>
                        <input
                            type="text"
                            name="helmet_id"
                            value={form.helmet_id}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || /^\d+$/.test(val)) {
                                    setForm({ ...form, helmet_id: val });
                                }
                            }}
                            placeholder="Enter helmet ID"
                            className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring focus:ring-purple-500"
                        />

                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleRemove}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg ${loading
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                    >
                        Remove Soldier
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg ${loading
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditSoldierModal;
