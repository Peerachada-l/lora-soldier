import React, { useState } from 'react';
import { X } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const HelmetConnectModal = ({ helmet, onClose, onConnect, onRemove, onStatusChanged }) => {
    const [soldierId, setSoldierId] = useState('');
    const [newStatus, setNewStatus] = useState(helmet.status || 'inactive');

    if (!helmet) return null;

    // 🟢 Assign / Reassign
    const handleAssign = () => {
        if (!soldierId) {
            alert('Please enter Soldier ID');
            return;
        }
        onConnect(helmet.helmet_id, parseInt(soldierId));
        onClose();
    };

    // 🟡 Unassign
    const handleUnassign = () => {
        if (!helmet.assigned_soldier_id) return;
        onConnect(helmet.helmet_id, null);
        onClose();
    };

    // 🔴 Delete
    const handleRemove = () => {
        if (!window.confirm('Delete this helmet?')) return;
        onRemove(helmet.helmet_id);
        onClose();
    };

    // 🔵 Change Status
    const handleChangeStatus = async () => {
        try {
            const res = await fetch(
                `${API_BASE}/helmets/${helmet.helmet_id}/status?status=${newStatus}`,
                { method: 'PUT' }
            );

            if (!res.ok) throw new Error(await res.text());

            onStatusChanged(helmet.helmet_id, newStatus);
            onClose();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-md border border-slate-700 relative">
                {/* ❌ Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-4">
                    Manage Helmet #{helmet.helmet_id}
                </h2>

                <div className="space-y-3 text-slate-300">
                    <p><strong>Status:</strong> {helmet.status}</p>
                    <p>
                        <strong>Assigned Soldier:</strong>{' '}
                        {helmet.assigned_soldier_id ? `#${helmet.assigned_soldier_id}` : 'None'}
                    </p>

                    {/* Status */}
                    <label className="block text-sm mt-4">Change Status</label>
                    <select
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value)}
                        className="w-full p-2 bg-slate-700 rounded"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="maintenance">Maintenance</option>
                    </select>

                    <button
                        onClick={handleChangeStatus}
                        className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded mt-2"
                    >
                        Update Status
                    </button>

                    {/* Assign */}
                    <label className="block text-sm mt-4">Assign Soldier ID</label>
                    <input
                        type="number"
                        value={soldierId}
                        onChange={e => setSoldierId(e.target.value)}
                        className="w-full p-2 bg-slate-700 rounded"
                        placeholder="Enter soldier ID"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-6">
                    <button
                        onClick={handleAssign}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded"
                    >
                        Assign
                    </button>

                    <button
                        onClick={handleUnassign}
                        disabled={!helmet.assigned_soldier_id}
                        className={`flex-1 py-2 rounded ${helmet.assigned_soldier_id
                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                : 'bg-gray-600 cursor-not-allowed'
                            }`}
                    >
                        Unassign
                    </button>

                    <button
                        onClick={handleRemove}
                        className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelmetConnectModal;