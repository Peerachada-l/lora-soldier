import React, { useState } from 'react';
import StatusPage from './pages/StatusPage.jsx';
import GPSPage from './pages/GPSPage.jsx';
import Sidebar from './components/Sidebar.jsx';

// --- MOCK DATA ---
// Matches your actual DB schema: soldiers, helmets, sensor_data, location_data
const initialSoldiers = [
  {
    soldier_id: 1,
    name: 'Hawk Eye',
    rank: 'Sergeant',
    unit: 'Alpha',
    helmet_id: 101,
    status: 'active',
    heart_rate: 82,
    body_temp: 36.7,
    fall_detected: false,
    latitude: 13.7563,
    longitude: 100.5018,
  },
  {
    soldier_id: 2,
    name: 'Rattler',
    rank: 'Corporal',
    unit: 'Alpha',
    helmet_id: 102,
    status: 'active',
    heart_rate: 91,
    body_temp: 37.1,
    fall_detected: false,
    latitude: 13.7580,
    longitude: 100.5030,
  },
  {
    soldier_id: 3,
    name: 'Phoenix',
    rank: 'Private',
    unit: 'Bravo',
    helmet_id: 103,
    status: 'active',
    heart_rate: 77,
    body_temp: 36.5,
    fall_detected: false,
    latitude: 13.7572,
    longitude: 100.5045,
  },
  {
    soldier_id: 4,
    name: 'Wolverine',
    rank: 'Sergeant',
    unit: 'Bravo',
    helmet_id: 104,
    status: 'active',
    heart_rate: 80,
    body_temp: 36.9,
    fall_detected: false,
    latitude: 13.7591,
    longitude: 100.5067,
  },
  {
    soldier_id: 5,
    name: 'Viper',
    rank: 'Captain',
    unit: 'Charlie',
    helmet_id: 105,
    status: 'critical',
    heart_rate: 0,
    body_temp: 35.2,
    fall_detected: true,
    latitude: 13.7554,
    longitude: 100.5022,
  },
  {
    soldier_id: 6,
    name: 'Ghost',
    rank: 'Private',
    unit: 'Charlie',
    helmet_id: 106,
    status: 'active',
    heart_rate: 86,
    body_temp: 36.8,
    fall_detected: false,
    latitude: 13.7601,
    longitude: 100.5090,
  },
];

/**
 * Main App Component
 * Handles the main layout, state management, and simple routing.
 */
const App = () => {
  const [currentPage, setCurrentPage] = useState('status');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'status':
        return <StatusPage soldiers={initialSoldiers} />;
      case 'gps':
        return <GPSPage soldiers={initialSoldiers} />;
      default:
        return <StatusPage soldiers={initialSoldiers} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 font-inter">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      {renderPage()}
    </div>
  );
};

export default App;
