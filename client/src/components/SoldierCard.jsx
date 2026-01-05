import React from 'react';
import { MoreVertical, Heart, Thermometer, Shield, AlertTriangle } from 'lucide-react';

const SoldierCard = ({ soldier, onEdit }) => {
    const {
        soldier_id,
        name,
        rank,
        unit,
        helmet,
        latest_sensor,
    } = soldier;

    const isHelmetWorn = helmet?.helmet_worn === true;

    const heart_rate = latest_sensor?.heart_rate ?? 0;
    const body_temp = latest_sensor?.body_temp ?? 0;
    const fall_detected = latest_sensor?.fall_detected ?? false;

    let borderColor = 'border-slate-600';
    let opacity = 'opacity-50';

    if (isHelmetWorn) {
        opacity = '';
        if (heart_rate === 0) borderColor = 'border-red-600 ring-red-600/30';
        else if (fall_detected) borderColor = 'border-yellow-400 ring-yellow-400/30';
        else borderColor = 'border-green-500 ring-green-500/30';
    }

    return (
        <div
            className={`relative p-4 md:p-6 bg-slate-900/70 border-2 rounded-xl shadow-lg transition ${borderColor} ${opacity}`}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(soldier);
                }}
                className="absolute top-3 right-3 text-slate-400 hover:text-white"
            >
                <MoreVertical size={20} />
            </button>

            <p className="text-sm font-semibold mb-1 text-blue-400">
                Soldier ID: {soldier_id}
            </p>

            <p className="text-sm font-semibold mb-1 text-blue-400">
                Unit {unit} — Helmet #{helmet?.helmet_id ?? 'N/A'}
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">
                {name}
                <span className="text-base font-normal text-slate-400 ml-2">({rank})</span>
            </h2>

            <div className="flex items-center mb-4 space-x-2">
                <Shield size={18} className="text-cyan-400" />
                <span className="text-slate-300">Helmet Status:</span>
                <span className="font-bold text-slate-300">
                    {isHelmetWorn ? helmet.status.toUpperCase() : 'NOT WORN'}
                </span>
            </div>

            {isHelmetWorn ? (
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
                </div>
            ) : (
                <div className="text-slate-400 italic text-center">
                    No helmet worn — sensor data unavailable
                </div>
            )}
        </div>
    );
};

export default SoldierCard;
