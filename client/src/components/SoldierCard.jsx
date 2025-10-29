export default function SoldierCard({ soldier }) {
    const { name, heartRate, temp, gyro, status } = soldier;

    const borderColor =
        status === "critical"
            ? "border-red-500"
            : status === "warning"
                ? "border-yellow-400"
                : "border-green-500";

    return (
        <div
            className={`rounded-xl border-2 ${borderColor} bg-[#0f1123] p-6 flex flex-col justify-between transition-transform hover:scale-[1.02]`}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{name}</h2>
                <span className="text-gray-400 text-lg cursor-pointer">⋮</span>
            </div>

            {/* Sensor Info */}
            <div className="space-y-2 text-sm">
                <p>❤️ <span className="font-medium">{heartRate} bpm</span></p>
                <p>🌡️ <span className="font-medium">{temp} °C</span></p>
                <p>🌀 <span className="font-medium">{gyro}</span></p>
            </div>

            {/* Footer */}
            <div className="mt-4 text-xs text-gray-400 uppercase tracking-wide">
                {status === "critical" ? "Critical" : "Normal"}
            </div>
        </div>
    );
}
