import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const API_BASE = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000/ws/locations';

const GPSPage = () => {
    const [soldiers, setSoldiers] = useState([]);
    const [activeSoldier, setActiveSoldier] = useState(null);
    const [mapCenter, setMapCenter] = useState([13.7563, 100.5018]);
    const [isLocationReady, setIsLocationReady] = useState(false);

    /* ===============================
       1️⃣ LOAD SOLDIER + HELMET DATA
       =============================== */
    useEffect(() => {
        const fetchSoldiers = async () => {
            try {
                const res = await fetch(`${API_BASE}/soldiers/detailed`);
                if (!res.ok) throw new Error('Failed to fetch soldiers');

                const data = await res.json();

                setSoldiers(
                    data.map(s => ({
                        soldier_id: s.soldier_id,
                        name: s.name,
                        unit: s.unit,

                        helmet_worn: s.helmet?.helmet_worn ?? false,
                        helmet_status: s.helmet?.status ?? null,

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

        return () => ws.close();
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            console.warn("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setMapCenter([latitude, longitude]);
                setIsLocationReady(true);
                console.log("New center:", latitude, longitude);
            },
            (error) => {
                console.error("Geolocation error:", error);
            },
            {
                enableHighAccuracy: true,
            }
        );
    }, []);

    const RecenterMap = ({ center }) => {
        const map = useMap();

        useEffect(() => {
            map.flyTo(center, map.getZoom());
        }, [center, map]);

        return null;
    };

    return (
        <MapContainer
            center={mapCenter}
            zoom={14}
            style={{ width: '100%', height: '90vh' }}
            
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <RecenterMap center = {mapCenter} />
            
            {isLocationReady && (
                <CircleMarker
                        key= "0"
                        center={mapCenter}
                        radius={10}
                        pathOptions= {{ color: "blue"}} 
                        
                />
            )}
            

            {soldiers.map(soldier => {
                const {
                    soldier_id,
                    latitude,
                    longitude,
                    heart_rate,
                    fall_detected,
                    helmet_worn,
                    helmet_status,
                } = soldier;

                /* ❌ FILTER: helmet rules */
                if (!helmet_worn) return null;
                if (helmet_status !== 'active') return null;

                if (
                    latitude == null ||
                    longitude == null ||
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
