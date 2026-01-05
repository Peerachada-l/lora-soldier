import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const API_BASE = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000/ws/locations';

const GPSPage = () => {
    const [soldiers, setSoldiers] = useState([]);
    const [activeSoldier, setActiveSoldier] = useState(null);

    /* ===============================
       1️⃣ LOAD SOLDIER METADATA ONCE
       =============================== */
    useEffect(() => {
        const fetchSoldiers = async () => {
            try {
                const res = await fetch(`${API_BASE}/soldiers`);
                if (!res.ok) throw new Error('Failed to fetch soldiers');

                const data = await res.json();

                setSoldiers(
                    data.map(s => ({
                        soldier_id: s.soldier_id,
                        name: s.name,
                        unit: s.unit,
                        latitude: null,
                        longitude: null,
                        heart_rate: null,
                        fall_detected: false,
                    }))
                );
            } catch (err) {
                console.error('❌ Failed to load soldiers:', err);
            }
        };

        fetchSoldiers();
    }, []);

    /* ===============================
       2️⃣ REAL-TIME LOCATION UPDATES
       =============================== */
    useEffect(() => {
        console.log('🌐 Connecting to WebSocket...');
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => console.log('🟢 WebSocket connected');

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type !== 'location_update') return;

                const {
                    soldier_id,
                    latitude,
                    longitude,
                    heart_rate,
                    fall_detected,
                } = data;

                if (latitude == null || longitude == null) return;

                setSoldiers(prev =>
                    prev.map(s =>
                        s.soldier_id === soldier_id
                            ? {
                                  ...s,
                                  latitude: Number(latitude),
                                  longitude: Number(longitude),
                                  heart_rate,
                                  fall_detected,
                              }
                            : s
                    )
                );
            } catch (err) {
                console.error('❌ WebSocket parse error:', err);
            }
        };

        ws.onerror = err => console.error('❌ WebSocket error:', err);
        ws.onclose = () => console.log('🔴 WebSocket disconnected');

        return () => ws.close();
    }, []);

    return (
        <MapContainer
            center={[13.7563, 100.5018]}
            zoom={14}
            style={{ width: '100%', height: '90vh' }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {soldiers.map(soldier => {
                const {
                    soldier_id,
                    latitude,
                    longitude,
                    heart_rate,
                    fall_detected,
                } = soldier;

                if (
                    latitude === null ||
                    longitude === null ||
                    isNaN(latitude) ||
                    isNaN(longitude)
                )
                    return null;

                let color = 'green';
                if (heart_rate === 0) color = 'red';
                else if (fall_detected) color = 'yellow';

                return (
                    <CircleMarker
                        key={soldier_id}
                        center={[latitude, longitude]}
                        radius={10}
                        pathOptions={{ color }}
                        eventHandlers={{
                            click: () => setActiveSoldier(soldier),
                        }}
                    />
                );
            })}

            {activeSoldier && (
                <Popup
                    position={[
                        activeSoldier.latitude,
                        activeSoldier.longitude,
                    ]}
                    onClose={() => setActiveSoldier(null)}
                >
                    <div>
                        <strong>{activeSoldier.name}</strong>
                        <br />
                        Unit: {activeSoldier.unit}
                        <br />
                        Heart Rate:{' '}
                        {activeSoldier.heart_rate ?? 'N/A'}
                        <br />
                        Fall Detected:{' '}
                        {activeSoldier.fall_detected ? 'YES' : 'NO'}
                        <br />
                        Lat:{' '}
                        {activeSoldier.latitude.toFixed(5)}
                        <br />
                        Lng:{' '}
                        {activeSoldier.longitude.toFixed(5)}
                    </div>
                </Popup>
            )}
        </MapContainer>
    );
};

export default GPSPage;
