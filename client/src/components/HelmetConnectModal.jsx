import React, { useState } from 'react';
import { X } from 'lucide-react';

const HelmetConnectModal = ({ helmet, onClose, onConnect, onRemove }) => {
    const [soldierId, setSoldierId] = useState('');

    const handleAssign = () => {
        if (!soldierId) {
            alert('Please enter a Soldier ID to assign.');
            return;
        }

        // If already assigned, confirm reassign
        if (helmet.assigned_soldier_id && helmet.assigned_soldier_id !== parseInt(soldierId)) {
            if (
                !window.confirm(
                    `This helmet is currently assigned to Soldier #${helmet.assigned_soldier_id}. Reassign to Soldier #${soldierId}?`
                )
            ) {
                return;
            }
        }

        onConnect(helmet.helmet_id, parseInt(soldierId));
        onClose();
    };

    const handleUnassign = () => {
        if (!helmet.assigned_soldier_id) {
            alert('This helmet is not assigned to any soldier.');
            return;
        }
        if (window.confirm('Are you sure you want to unassign this helmet?')) {
            onConnect(helmet.helmet_id, null);
            onClose();
        }
    };

    const handleRemove = () => {
        if (window.confirm('Are you sure you want to delete this helmet?')) {
            onRemove(helmet.helmet_id);
            onClose();
        }
    };

    const isAssigned = Boolean(helmet.assigned_soldier_id);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-700 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-4">
                    Manage Helmet #{helmet.helmet_id}
                </h2>

                <div className="space-y-4 text-slate-300">
                    <p>
                        <strong>Status:</strong> {helmet.status}
                    </p>
                    <p>
                        <strong>Assigned Soldier:</strong>{' '}
                        {isAssigned ? (
                            <>#{helmet.assigned_soldier_id}</>
                        ) : (
                            'None'
                        )}
                    </p>

                    <div className="mt-4">
                        <label className="block text-sm mb-2">Assign to Soldier ID</label>
                        <input
                            type="number"
                            value={soldierId}
                            onChange={(e) => setSoldierId(e.target.value)}
                            className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
                            placeholder={
                                isAssigned
                                    ? `Currently #${helmet.assigned_soldier_id}`
                                    : 'Enter Soldier ID...'
                            }
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-between gap-3 mt-6">
                    {/* Assign / Reassign */}
                    <button
                        onClick={handleAssign}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        {isAssigned ? 'Reassign' : 'Assign'}
                    </button>

                    {/* Unassign */}
                    <button
                        onClick={handleUnassign}
                        disabled={!isAssigned}
                        className={`flex-1 px-4 py-2 rounded-lg transition ${
                            isAssigned
                                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Unassign
                    </button>

                    {/* Delete Helmet */}
                    <button
                        onClick={handleRemove}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        Delete Helmet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelmetConnectModal;
