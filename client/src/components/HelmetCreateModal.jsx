import React from 'react';

const HelmetCreateModal = ({ onClose, onAdd }) => {
    const handleConfirm = () => {
        onAdd();   // backend already defaults to inactive
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-xl shadow-xl w-80 border border-slate-600 text-center">
                <h2 className="text-xl font-bold text-white mb-4">
                    Add New Helmet?
                </h2>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelmetCreateModal;
