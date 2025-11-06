import React, { useState, useEffect } from 'react';
import { GoogleMap, Circle, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '90vh',
};

const center = { lat: 13.7563, lng: 100.5018 };

const GPSPage = ({ soldiers: initialSoldiers, onSelectSoldier }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    const [soldiers, setSoldiers] = useState(initialSoldiers || []);
    const [activeSoldier, setActiveSoldier] = useState(null);

    // WebSocket connection
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/locations'); // adjust path to your backend WS

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const helmetId = data.helmet_id;

            // Update or insert soldier
            setSoldiers((prev) => {
                const exists = prev.find((s) => s.soldier_id === helmetId);
                if (exists) {
                    return prev.map((s) =>
                        s.soldier_id === helmetId
                            ? { ...s, latitude: data.latitude, longitude: data.longitude }
                            : s
                    );
                } else {
                    return [...prev, data];
                }
            });
        };

        return () => ws.close();
    }, []);

    const getCircleIcon = (soldier) => {
        if (soldier.heart_rate === 0) return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
        if (soldier.fall_detected) return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
        return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    };

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
            {soldiers.map((soldier) => (
                <Circle
                    key={soldier.soldier_id}
                    position={{ lat: soldier.latitude, lng: soldier.longitude }}
                    icon={getCircleIcon(soldier)}
                    onClick={() => setActiveSoldier(soldier)}
                />
            ))}

            {activeSoldier && (
                <InfoWindow
                    position={{ lat: activeSoldier.latitude, lng: activeSoldier.longitude }}
                    onCloseClick={() => setActiveSoldier(null)}
                >
                    <div>
                        <strong>{activeSoldier.name}</strong>
                        <br />
                        Unit: {activeSoldier.unit}
                        <br />
                        Status: {activeSoldier.status}
                        <br />
                        HR: {activeSoldier.heart_rate || 'N/A'}
                        <br />
                        <button
                            className="mt-2 px-2 py-1 bg-blue-600 text-white rounded"
                            onClick={() => onSelectSoldier(activeSoldier.soldier_id)}
                        >
                            View Status
                        </button>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default GPSPage;
