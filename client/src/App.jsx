import React, { useState } from 'react';
import StatusPage from './pages/StatusPage.jsx';
import GPSPage from './pages/GPSPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import Sidebar from './components/Sidebar.jsx';
import HelmetPage from './pages/HelmetPage.jsx';

// --- MOCK DATA ---
const initialSoldiers = [
  { soldier_id: 1, name: 'Hawk Eye', rank: 'Sergeant', unit: 'Alpha' },
  { soldier_id: 2, name: 'Rattler', rank: 'Corporal', unit: 'Alpha' },
  { soldier_id: 3, name: 'Phoenix', rank: 'Private', unit: 'Bravo' },
  { soldier_id: 4, name: 'Wolverine', rank: 'Sergeant', unit: 'Bravo' },
  { soldier_id: 5, name: 'Viper', rank: 'Captain', unit: 'Charlie' },
  { soldier_id: 6, name: 'Ghost', rank: 'Private', unit: 'Charlie' },
];

const initialHelmets = [
  { helmet_id: 101, status: 'active', soldier_id: 1 },
  { helmet_id: 102, status: 'active', soldier_id: 2 },
  { helmet_id: 103, status: 'inactive', soldier_id: 3 },
  { helmet_id: 104, status: 'damaged', soldier_id: null },
  { helmet_id: 105, status: 'unassigned', soldier_id: null },
];

/**
 * Main App Component
 */
const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard'); // default page
  const [soldiers, setSoldiers] = useState(initialSoldiers);
  const [filterSoldierId, setFilterSoldierId] = useState(null);

  const [helmets, setHelmets] = useState(initialHelmets);

  // --- Add new soldier handler ---
  const handleAddSoldier = (newSoldier) => {
    const nextId = soldiers.length ? Math.max(...soldiers.map(s => s.soldier_id)) + 1 : 1;
    setSoldiers([...soldiers, { soldier_id: nextId, ...newSoldier }]);
  };

  // --- Add new helmet handler ---
  const handleAddHelmet = (newHelmet) => {
    const nextId = helmets.length ? Math.max(...helmets.map(h => h.helmet_id)) + 1 : 101;
    setHelmets([...helmets, { helmet_id: nextId, ...newHelmet }]);
  };

  // --- Connect/Disconnect helmet handler ---
  const handleConnectHelmet = (helmetId, soldierId) => {
    setHelmets(helmets.map(h =>
      h.helmet_id === helmetId ? { ...h, soldier_id: soldierId || null } : h
    ));
  };

  // --- Navigation handlers ---
  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page !== 'status') setFilterSoldierId(null);
  };

  const handleSelectSoldier = (soldierId) => {
    setFilterSoldierId(soldierId);
    setCurrentPage('status');
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
      case 'helmet':
        return (
          <HelmetPage
            helmets={helmets}
            soldiers={soldiers}
            onAddHelmet={handleAddHelmet}
            onConnectHelmet={handleConnectHelmet}
          />
        );
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
