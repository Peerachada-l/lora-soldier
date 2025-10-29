import React from 'react';
import { Map, BatteryCharging } from 'lucide-react';

/**
 * Sidebar Component
 * Displays navigation icons and layout elements.
 */
const Sidebar = ({ currentPage, onNavigate }) => {
    return (
        // Left Sidebar (using the same styles as the original aside element)
        <aside className="w-16 flex flex-col items-center py-6 space-y-8 bg-gray-950/50 shadow-2xl border-r border-slate-700/50">
            <div className="w-8 h-8 rounded-lg bg-red-600/70"></div> {/* Placeholder Logo */}

            {/* Map View Button */}
            <button
                className={`p-3 rounded-xl shadow-xl transition ${currentPage === 'gps'
                        ? 'bg-red-600/70 text-white'
                        : 'bg-slate-700/50 text-white hover:bg-slate-600'
                    }`}
                onClick={() => onNavigate('gps')}
                aria-label="Map View"
            >
                <Map size={24} />
            </button>

            {/* Status Page Button */}
            <button
                className={`p-3 rounded-xl shadow-xl transition ${currentPage === 'status'
                        ? 'bg-red-600/70 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                onClick={() => onNavigate('status')}
                aria-label="Status Dashboard"
            >
                <BatteryCharging size={24} />
            </button>
        </aside>
    );
};

export default Sidebar;
