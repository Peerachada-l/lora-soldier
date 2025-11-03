import React, { useState } from 'react';

/**
 * CreateSoldierModal Component
 * Props:
 *  - onClose: function to close the modal
 *  - onCreate: function to handle soldier creation (receives soldier object)
 *  - ranks: array of rank strings
 *  - units: array of unit strings
 */
const CreateSoldierModal = ({ onClose, onCreate, ranks, units }) => {
    const [newSoldier, setNewSoldier] = useState({
        soldier_id: '',
        name: '',
        rank: ranks[1] || 'Private',
        unit: units[1] || 'Alpha',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSoldier(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, rank, unit } = newSoldier;
        if (!name || !rank || !unit) return;

        onCreate({ name, rank, unit });  // <- call StatusPage handler
    };


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-900 p-6 rounded-xl w-96 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-4">Create Soldier</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {/* <input
                        type="number"
                        name="soldier_id"
                        placeholder="Soldier ID"
                        value={newSoldier.soldier_id}
                        onChange={handleChange}
                        className="p-2 rounded-lg bg-slate-800 text-white border border-slate-700"
                        required
                    /> */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={newSoldier.name}
                        onChange={handleChange}
                        className="p-2 rounded-lg bg-slate-800 text-white border border-slate-700"
                        required
                    />
                    <select
                        name="rank"
                        value={newSoldier.rank}
                        onChange={handleChange}
                        className="p-2 rounded-lg bg-slate-800 text-white border border-slate-700"
                    >
                        {ranks.slice(1).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <select
                        name="unit"
                        value={newSoldier.unit}
                        onChange={handleChange}
                        className="p-2 rounded-lg bg-slate-800 text-white border border-slate-700"
                    >
                        {units.slice(1).map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSoldierModal;
