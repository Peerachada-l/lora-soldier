import React, { useState, useMemo } from 'react';
import { Filter, Plus, MoreVertical } from 'lucide-react';
import HelmetConnectModal from '../components/HelmetConnectModal.jsx';
import HelmetCreateModal from '../components/HelmetCreateModal.jsx';

/**
 * HelmetPage Component
 * Displays all helmets with filtering and connection controls.
 */
const HelmetPage = ({ helmets, soldiers, onAddHelmet, onConnectHelmet }) => {
    const [statusFilter, setStatusFilter] = useState('All');
    const [openDropdown, setOpenDropdown] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedHelmet, setSelectedHelmet] = useState(null);

    // --- Filtered helmets ---
    const filteredHelmets = useMemo(() => {
        let list = [...helmets];
        if (statusFilter !== 'All') {
            list = list.filter(h => h.status === statusFilter.toLowerCase());
        }
        return list;
    }, [helmets, statusFilter]);

    const statuses = ['All', 'Active', 'Inactive', 'Damaged', 'Unassigned'];

    return (
        <main className="flex-1 overflow-auto p-4 md:p-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                <h1 className="text-3xl font-extrabold text-white">Helmet Management</h1>

                {/* Filter + Add */}
                <div className="flex gap-3">
                    {/* Filter Button */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenDropdown(!openDropdown)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800 transition"
                        >
                            <Filter size={18} />
                            <span>{statusFilter}</span>
                        </button>
                        {openDropdown && (
                            <div className="absolute right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg w-40 z-20">
                                {statuses.map((option) => (
                                    <div
                                        key={option}
                                        onClick={() => {
                                            setStatusFilter(option);
                                            setOpenDropdown(false);
                                        }}
                                        className={`px-4 py-2 cursor-pointer hover:bg-slate-700 transition ${statusFilter === option
                                                ? 'bg-slate-700 text-blue-400 font-semibold'
                                                : 'text-slate-300'
                                            }`}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add Helmet Button */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
                    >
                        <Plus size={18} />
                        <span>Add Helmet</span>
                    </button>
                </div>
            </header>

            {/* Helmet Table */}
            <div className="bg-slate-800/60 rounded-xl shadow-xl overflow-hidden border border-slate-700">
                <table className="w-full text-left text-slate-300">
                    <thead className="bg-slate-900/70 text-slate-200 text-sm uppercase tracking-wide">
                        <tr>
                            <th className="px-6 py-3">Helmet ID</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Assigned Soldier</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHelmets.length > 0 ? (
                            filteredHelmets.map((helmet) => (
                                <tr
                                    key={helmet.helmet_id}
                                    className="border-t border-slate-700 hover:bg-slate-700/30 transition"
                                >
                                    <td className="px-6 py-4 font-semibold">{helmet.helmet_id}</td>
                                    <td className="px-6 py-4 capitalize">
                                        {helmet.status || 'unassigned'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {helmet.soldier_id ? `#${helmet.soldier_id}` : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedHelmet(helmet)}
                                            className="p-2 rounded-lg hover:bg-slate-600 transition"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center py-8 text-slate-500 italic"
                                >
                                    No helmets match the current filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <HelmetCreateModal
                    onClose={() => setShowCreateModal(false)}
                    onAdd={onAddHelmet}
                />
            )}

            {selectedHelmet && (
                <HelmetConnectModal
                    helmet={selectedHelmet}
                    soldiers={soldiers}
                    onClose={() => setSelectedHelmet(null)}
                    onConnect={onConnectHelmet}
                />
            )}
        </main>
    );
};

export default HelmetPage;
