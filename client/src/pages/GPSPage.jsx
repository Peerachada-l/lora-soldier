import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const GPSPage = () => {
    const [soldiers, setSoldiers] = useState([]);
    const [activeSoldier, setActiveSoldier] = useState(null);

    // --- WebSocket connection ---
    useEffect(() => {
        console.log("🌐 Connecting WebSocket...");

        const ws = new WebSocket('ws://localhost:8000/ws/locations'); // Adjust path

        ws.onopen = () => console.log("🟢 WebSocket connected!");

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("📦 Received WebSocket Data:", data);

                if (!data.latitude || !data.longitude) {
                    console.warn("⚠️ Missing lat/lng:", data);
                    return;
                }

                const lat = Number(data.latitude);
                const lng = Number(data.longitude);
                if (isNaN(lat) || isNaN(lng)) {
                    console.warn("⚠️ Invalid lat/lng:", data);
                    return;
                }

                setSoldiers(prev => {
                    const exists = prev.find(s => s.soldier_id === data.soldier_id);
                    if (exists) {
                        return prev.map(s =>
                            s.soldier_id === data.soldier_id ? { ...s, ...data, latitude: lat, longitude: lng } : s
                        );
                    } else {
                        return [...prev, { ...data, latitude: lat, longitude: lng }];
                    }
                });

            } catch (err) {
                console.error("❌ Error parsing WebSocket message:", err);
            }
        };

        ws.onerror = (err) => console.error("❌ WebSocket error:", err);
        ws.onclose = () => console.log("🔴 WebSocket disconnected");

        return () => ws.close();
    }, []);

    // --- Fallback test data if no WebSocket ---
    useEffect(() => {
        if (soldiers.length === 0) {
            setSoldiers([
                { soldier_id: 1, latitude: 13.7563, longitude: 100.5018, heart_rate: 80, fall_detected: false, name: "John Doe", unit: "Alpha", status: "Active" },
                { soldier_id: 2, latitude: 13.7575, longitude: 100.5020, heart_rate: 0, fall_detected: false, name: "Jane Smith", unit: "Bravo", status: "Inactive" },
                { soldier_id: 3, latitude: 13.7550, longitude: 100.5000, heart_rate: 70, fall_detected: true, name: "Bob Lee", unit: "Charlie", status: "Alert" }
            ]);
        }
    }, [soldiers.length]);

    return (
        <MapContainer
            center={[13.7563, 100.5018]}
            zoom={14}
            style={{ width: '100%', height: '90vh' }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {soldiers.map(soldier => {
                const lat = Number(soldier.latitude);
                const lng = Number(soldier.longitude);
                if (isNaN(lat) || isNaN(lng)) return null; // Skip invalid

                let color = "green";
                if (soldier.heart_rate === 0) color = "red";
                else if (soldier.fall_detected) color = "yellow";

                return (
                    <CircleMarker
                        key={soldier.soldier_id}
                        center={[lat, lng]}
                        radius={10}
                        pathOptions={{ color }}
                        eventHandlers={{
                            click: () => setActiveSoldier(soldier)
                        }}
                    />
                );
            })}

            {activeSoldier && (
                <Popup
                    position={[activeSoldier.latitude, activeSoldier.longitude]}
                    onClose={() => setActiveSoldier(null)}
                >
                    <div>
                        <strong>{activeSoldier.name}</strong><br />
                        Unit: {activeSoldier.unit}<br />
                        Status: {activeSoldier.status}<br />
                        HR: {activeSoldier.heart_rate || 'N/A'}<br />
                        Lat: {activeSoldier.latitude.toFixed(5)}<br />
                        Lng: {activeSoldier.longitude.toFixed(5)}
                    </div>
                </Popup>
            )}
        </MapContainer>
    );
};

export default GPSPage;