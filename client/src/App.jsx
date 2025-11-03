import React from 'react';
import StatusPage from './pages/StatusPage.jsx';
import GPSPage from './pages/GPSPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import Sidebar from './components/Sidebar.jsx';

// --- MOCK DATA ---
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
    latitude: 13.758,
    longitude: 100.503,
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
    longitude: 100.509,
  },
];

const App = () => {
  const [currentPage, setCurrentPage] = React.useState('dashboard'); // default page
  const [soldiers, setSoldiers] = React.useState(initialSoldiers);
  const [filterSoldierId, setFilterSoldierId] = React.useState(null);

  // --- Navigation handlers ---
  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page !== 'status') setFilterSoldierId(null);
  };

  const handleSelectSoldier = (soldierId) => {
    setFilterSoldierId(soldierId);
    setCurrentPage('status');
  };

  // --- Add soldier handler ---
  const handleAddSoldier = (newSoldier) => {
    const nextId = soldiers.length ? Math.max(...soldiers.map(s => s.soldier_id)) + 1 : 1;
    setSoldiers([...soldiers, { soldier_id: nextId, ...newSoldier }]);
  };

  // --- Determine filtered soldiers ---
  const filteredSoldiers =
    filterSoldierId != null
      ? soldiers.filter(s => s.soldier_id === filterSoldierId)
      : soldiers;

  // --- Render the current page ---
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage soldiers={soldiers} />;
      case 'status':
        return <StatusPage soldiers={filteredSoldiers} onAddSoldier={handleAddSoldier} />;
      case 'gps':
        return <GPSPage soldiers={soldiers} onSelectSoldier={handleSelectSoldier} />;
      default:
        return <DashboardPage soldiers={soldiers} />;
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