import Sidebar from "../components/Sidebar";
import { Filter } from "lucide-react";
import SoldierCard from "../components/SoldierCard";

export default function StatusPage() {
    const soldiers = [
        { id: 1, name: "Alpha", heartRate: 82, temp: 36.7, gyro: "Stable", status: "normal" },
        { id: 2, name: "Bravo", heartRate: 89, temp: 37.1, gyro: "Stable", status: "normal" },
        { id: 3, name: "Charlie", heartRate: 76, temp: 36.5, gyro: "Stable", status: "normal" },
        { id: 4, name: "Delta", heartRate: 95, temp: 38.2, gyro: "Unstable", status: "critical" },
        { id: 5, name: "Echo", heartRate: 87, temp: 36.8, gyro: "Stable", status: "normal" },
        { id: 6, name: "Foxtrot", heartRate: 131, temp: 39.4, gyro: "Fallen", status: "critical" },
    ];

    return (
        <div className="flex h-screen bg-[#0b0c1a] text-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 p-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold">Status Overview</h1>
                    <Filter className="text-gray-400 hover:text-white cursor-pointer" />
                </div>

                {/* Grid of cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {soldiers.map((soldier) => (
                        <SoldierCard key={soldier.id} soldier={soldier} />
                    ))}
                </div>
            </div>
        </div>
    );
}
