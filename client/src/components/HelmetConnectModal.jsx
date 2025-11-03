import React, { useState } from 'react';

const HelmetConnectModal = ({ helmet, soldiers, onClose, onConnect }) => {
    const [selectedSoldierId, setSelectedSoldierId] = useState(helmet.soldier_id || '');

    const handleConnect = () => {
        onConnect(helmet.helmet_id, selectedSoldierId);
        onClose();
    };

    const handleRemove = () => {
        onConnect(helmet.helmet_id, null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-xl shadow-xl w-96 border border-slate-600">
                <h2 className="text-xl font-bold text-white mb-4">Connect Helmet #{helmet.helmet_id}</h2>

                <label className="block mb-3 text-slate-300">Assign to Soldier:</label>
                <select
                    value={selectedSoldierId}
                    onChange={(e) => setSelectedSoldierId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 mb-4"
                >
                    <option value="">Unassigned</option>
                    {soldiers.map((s) => (
                        <option key={s.soldier_id} value={s.soldier_id}>
                            #{s.soldier_id} — {s.name}
                        </option>
                    ))}
                </select>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleRemove}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                        Remove
                    </button>
                    <button
                        onClick={handleConnect}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Connect
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelmetConnectModal;
