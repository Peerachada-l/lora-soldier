import React from 'react';
import { MoreVertical, BatteryCharging, Shield, Heart } from 'lucide-react';

/**
 * SoldierCard Component
 * Displays the status and vitals of an individual soldier.
 */
const SoldierCard = ({ soldier }) => {
    const { id, name, rank, status, health, battery } = soldier;

    // Determine border color based on the status
    const borderColor = status === 'Critical'
        ? 'border-red-600 ring-red-600/30'
        : 'border-green-500 ring-green-500/30';

    const healthColor = health > 75 ? 'text-green-400' : health > 50 ? 'text-yellow-400' : 'text-red-400';
    const batteryColor = battery > 75 ? 'text-green-400' : battery > 50 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className={`
      relative p-4 md:p-6 bg-slate-900/70 border-2 rounded-xl shadow-lg transition duration-300
      hover:shadow-red-500/10 hover:shadow-2xl
      ${borderColor}
    `}>
            {/* Options Menu Icon */}
            <button
                className="absolute top-3 right-3 text-slate-400 hover:text-white transition"
                aria-label="Options"
            >
                <MoreVertical size={20} />
            </button>

            <div className="flex flex-col">
                {/* Header/ID */}
                <p className={`text-sm font-semibold mb-1 tracking-wider ${status === 'Critical' ? 'text-red-500' : 'text-green-400'}`}>
                    UNIT ID: {id}
                </p>

                {/* Name and Rank */}
                <h2 className="text-2xl font-bold text-white mb-4">
                    {name}
                    <span className="text-base font-normal text-slate-400 ml-2">({rank})</span>
                </h2>

                {/* Vitals/Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                        <Heart size={20} className={healthColor} />
                        <span className="text-slate-300">Health:</span>
                        <span className={`font-bold ${healthColor}`}>{health}%</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <BatteryCharging size={20} className={batteryColor} />
                        <span className="text-slate-300">Battery:</span>
                        <span className={`font-bold ${batteryColor}`}>{battery}%</span>
                    </div>

                    <div className="flex items-center space-x-2 col-span-2">
                        <Shield size={20} className="text-blue-400" />
                        <span className="text-slate-300">Mission Status:</span>
                        <span className={`font-bold ${status === 'Critical' ? 'text-red-500' : 'text-green-400'}`}>
                            {status.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoldierCard;
