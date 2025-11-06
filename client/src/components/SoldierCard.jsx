import React from 'react';
import { MoreVertical, Heart, Thermometer, Shield, Activity, MapPin, AlertTriangle } from 'lucide-react';

/**
 * SoldierCard Component
 * Displays soldier vitals, unit, and helmet status.
 */
const SoldierCard = ({ soldier, onEdit }) => {
    const {
        soldier_id,
        name,
        rank,
        unit,
        helmet,
        sensor,
        location,
    } = soldier;

    // Safe optional chaining
    const helmetId = helmet?.helmet_id ?? 'N/A';
    const status = helmet?.status ?? 'UNKNOWN';
    const heart_rate = sensor?.heart_rate ?? 0;
    const body_temp = sensor?.body_temp ?? 0;
    const fall_detected = sensor?.fall_detected ?? false;
    // const latitude = location?.latitude ?? null;
    // const longitude = location?.longitude ?? null;

    // Border color logic
    let borderColor;
    if (heart_rate === 0) borderColor = 'border-red-600 ring-red-600/30';
    else if (fall_detected) borderColor = 'border-yellow-400 ring-yellow-400/30';
    else borderColor = 'border-green-500 ring-green-500/30';

    return (
        <div
            className={`relative p-4 md:p-6 bg-slate-900/70 border-2 rounded-xl shadow-lg transition duration-300 hover:shadow-2xl hover:shadow-red-500/10 ${borderColor}`}
        >
            {/* Edit button (top-right) */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (onEdit) onEdit(soldier);
                }}
                className="absolute top-3 right-3 text-slate-400 hover:text-white transition"
                aria-label="Edit Soldier"
            >
                <MoreVertical size={20} />
            </button>

            <div className="flex flex-col">
                <p className="text-sm font-semibold mb-1 tracking-wider text-blue-400">
                    Soldier ID: {soldier_id}
                </p>
                <p className="text-sm font-semibold mb-1 tracking-wider text-blue-400">
                    Unit {unit} — Helmet #{helmetId}
                </p>

                <h2 className="text-2xl font-bold text-white mb-4">
                    {name}
                    <span className="text-base font-normal text-slate-400 ml-2">({rank})</span>
                </h2>

                <div className="flex items-center mb-2 space-x-2">
                    <Shield size={18} className="text-cyan-400" />
                    <span className="text-slate-300">Helmet Status:</span>
                    <span className="font-bold text-slate-300">{status.toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-1 gap-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                        <Heart size={20} className={heart_rate === 0 ? 'text-red-400' : 'text-green-400'} />
                        <span className="text-slate-300">Heart Rate:</span>
                        <span className={`font-bold ${heart_rate === 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {heart_rate} bpm
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Thermometer size={20} className="text-orange-400" />
                        <span className="text-slate-300">Body Temp:</span>
                        <span className="font-bold text-orange-400">{body_temp}°C</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <AlertTriangle size={20} className={fall_detected ? 'text-yellow-400' : 'text-green-400'} />
                        <span className="text-slate-300">Fall Detection:</span>
                        <span className={`font-bold ${fall_detected ? 'text-yellow-400' : 'text-green-400'}`}>
                            {fall_detected ? 'FALL DETECTED' : 'Stable'}
                        </span>
                    </div>

                    {/* {latitude !== null && longitude !== null && (
                        <div className="flex items-center space-x-2">
                            <MapPin size={20} className="text-purple-400" />
                            <span className="text-slate-300">Location:</span>
                            <span className="text-slate-400 text-xs">
                                {latitude.toFixed(5)}, {longitude.toFixed(5)}
                            </span>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default SoldierCard;