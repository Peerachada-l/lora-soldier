import React, { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
// FIX: Explicitly add .jsx extension for robust path resolution
import SoldierCard from '../components/SoldierCard.jsx';

/**
 * StatusPage Component
 * Displays the main grid of soldier status cards with filtering.
 */
const StatusPage = ({ soldiers }) => {
    const [filter, setFilter] = useState('All');

    const filteredSoldiers = useMemo(() => {
        if (filter === 'Critical') {
            return soldiers.filter(s => s.status === 'Critical');
        }
        return soldiers;
    }, [soldiers, filter]);

    return (
        <main className="flex-1 overflow-auto p-4 md:p-8">
            {/* Header/Filter Bar */}
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-white">Unit Status Overview</h1>

                <div className="relative flex items-center space-x-4">
                    <span className="text-slate-400 text-sm">{filter === 'Critical' ? 'Showing Critical' : 'Showing All'}</span>
                    <Filter
                        size={24}
                        className="text-slate-400 hover:text-white cursor-pointer transition"
                        onClick={() => setFilter(filter === 'All' ? 'Critical' : 'All')}
                        aria-label="Toggle Critical Filter"
                    />
                    {filter !== 'All' && (
                        <span className="absolute -top-1 right-0 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                </div>
            </header>

            {/* Status Grid */}
            <div className="
        grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3
        max-w-6xl mx-auto
      ">
                {filteredSoldiers.length > 0 ? (
                    filteredSoldiers.map(soldier => (
                        <SoldierCard key={soldier.id} soldier={soldier} />
                    ))
                ) : (
                    <div className="md:col-span-2 lg:col-span-3 text-center p-10 bg-slate-800/50 rounded-xl text-slate-400">
                        No units currently matching filter criteria.
                    </div>
                )}
            </div>
        </main>
    );
};

export default StatusPage;
