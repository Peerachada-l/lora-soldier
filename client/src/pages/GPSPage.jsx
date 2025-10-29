import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [32, 32],
});

export default function GPSPage() {
    const soldiers = [
        { id: 1, name: "Alpha", lat: 25.0, lon: 45.0 },
        { id: 2, name: "Bravo", lat: 25.4, lon: 45.2 },
        { id: 3, name: "Charlie", lat: 25.8, lon: 45.3 },
    ];

    return (
        <div className="relative h-full w-full flex items-center justify-center p-6 bg-[#0a0b1a]">
            {/* Outer glow border */}
            <div className="rounded-3xl p-[6px] bg-gradient-to-r from-purple-500 to-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.6)]">
                {/* Map container */}
                <div className="rounded-2xl overflow-hidden h-[80vh] w-[90vw] bg-[#0d1022]">
                    <MapContainer
                        center={[25.5, 45.5]}
                        zoom={6}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {soldiers.map((s) => (
                            <Marker key={s.id} position={[s.lat, s.lon]} icon={icon}>
                                <Popup>
                                    <strong>{s.name}</strong>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
