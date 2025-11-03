import React, { useState } from 'react';

const HelmetCreateModal = ({ onClose, onAdd }) => {
    const [status, setStatus] = useState('active');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ status, soldier_id: null });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-xl shadow-xl w-96 border border-slate-600">
                <h2 className="text-xl font-bold text-white mb-4">Add New Helmet</h2>

                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-slate-300">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 mb-6"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="damaged">Damaged</option>
                        <option value="unassigned">Unassigned</option>
                    </select>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Add Helmet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HelmetCreateModal;
