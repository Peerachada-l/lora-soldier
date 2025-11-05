import React, { useState } from 'react';
import { X } from 'lucide-react';

const EditSoldierModal = ({ soldier, onClose, onSave, onRemove }) => {
    const [form, setForm] = useState({
        name: soldier.name,
        rank: soldier.rank,
        unit: soldier.unit,
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = () => onSave(soldier.soldier_id, form);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="relative bg-slate-900 p-6 rounded-xl w-full max-w-md border border-slate-700 shadow-2xl">
                {/* ✖ Top-right close button */}
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
                    <div>
                        <label className="block text-slate-300 text-sm mb-1">Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm mb-1">Rank</label>
                        <input
                            name="rank"
                            value={form.rank}
                            onChange={handleChange}
                            className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm mb-1">Unit</label>
                        <input
                            name="unit"
                            value={form.unit}
                            onChange={handleChange}
                            className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => onRemove(soldier.soldier_id)}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                        Remove Soldier
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditSoldierModal;