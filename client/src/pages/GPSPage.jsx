import React from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '90vh',
};

const center = { lat: 13.7563, lng: 100.5018 };

const GPSPage = ({ soldiers, onSelectSoldier }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // <-- put your API key in .env
    });

    const [activeSoldier, setActiveSoldier] = React.useState(null);

    // Decide marker color
    const getMarkerIcon = (soldier) => {
        if (soldier.heart_rate === 0) return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
        if (soldier.fall_detected) return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
        return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    };

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
            {soldiers.map((soldier) => (
                <Marker
                    key={soldier.soldier_id}
                    position={{ lat: soldier.latitude, lng: soldier.longitude }}
                    icon={getMarkerIcon(soldier)}
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