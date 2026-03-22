import React from 'react';
import {
    LayoutDashboard,
    Map,
    BatteryCharging,
    HardHat,
    Users,
    LogOut
} from 'lucide-react';

/**
 * Sidebar Component
 * Displays navigation icons for Dashboard, GPS, Status, Helmet, and Soldier pages.
 */
const Sidebar = ({ currentPage, onNavigate, onLogout }) => {
    const baseBtn = 'p-3 rounded-xl shadow-xl transition-all duration-200';
    const activeBtn = 'bg-red-600/70 text-white';
    const inactiveBtn =
        'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700/60';

    return (
        <aside className="w-16 flex flex-col items-center py-6 space-y-8 bg-gray-950/50 shadow-2xl border-r border-slate-700/50">
            {/* Logo Placeholder */}
            <div className="w-8 h-8 rounded-lg bg-red-600/70"></div>

            {/* Dashboard */}
            <button
                className={`${baseBtn} ${currentPage === 'dashboard' ? activeBtn : inactiveBtn}`}
                onClick={() => onNavigate('dashboard')}
                aria-label="Dashboard"
            >
                <LayoutDashboard size={24} />
            </button>

            {/* GPS */}
            <button
                className={`${baseBtn} ${currentPage === 'gps' ? activeBtn : inactiveBtn}`}
                onClick={() => onNavigate('gps')}
                aria-label="Map View"
            >
                <Map size={24} />
            </button>

            {/* Status */}
            <button
                className={`${baseBtn} ${currentPage === 'status' ? activeBtn : inactiveBtn}`}
                onClick={() => onNavigate('status')}
                aria-label="Status Dashboard"
            >
                <BatteryCharging size={24} />
            </button>

            {/* Soldier Management */}
            <button
                className={`${baseBtn} ${currentPage === 'soldier' ? activeBtn : inactiveBtn}`}
                onClick={() => onNavigate('soldier')}
                aria-label="Soldier Management"
            >
                <Users size={24} />
            </button>

            {/* Helmet */}
            <button
                className={`${baseBtn} ${currentPage === 'helmet' ? activeBtn : inactiveBtn}`}
                onClick={() => onNavigate('helmet')}
                aria-label="Helmet Management"
            >
                <HardHat size={24} />
            </button>

            {/* Logout */}
            <button
                className={`${baseBtn} ${inactiveBtn} mt-auto`}
                onClick={onLogout}
                aria-label="Logout"
            >
                <LogOut size={24} />
            </button>
            
        </aside>
    );
};

export default Sidebar;
