import React, { useState } from 'react';
// FIX: Explicitly add .jsx extension for robust path resolution
import StatusPage from './pages/StatusPage.jsx';
import GPSPage from './pages/GPSPage.jsx';
import Sidebar from './components/Sidebar.jsx';

// --- MOCK DATA ---
const initialSoldiers = [
  { id: 'A01', name: 'Hawk Eye', rank: 'Sgt', status: 'Active', health: 95, battery: 92 },
  { id: 'B02', name: 'Rattler', rank: 'Cpl', status: 'Active', health: 88, battery: 85 },
  { id: 'C03', name: 'Phoenix', rank: 'Pvt', status: 'Active', health: 70, battery: 99 },
  { id: 'D04', name: 'Wolverine', rank: 'Sgt', status: 'Active', health: 99, battery: 78 },
  { id: 'E05', name: 'Viper', rank: 'Capt', status: 'Critical', health: 30, battery: 45 }, // Critical unit
  { id: 'F06', name: 'Ghost', rank: 'Pvt', status: 'Active', health: 65, battery: 60 },
];

/**
 * Main App Component
 * Handles the main layout, state management, and simple routing.
 */
const App = () => {
  // Simple state-based routing
  const [currentPage, setCurrentPage] = useState('status'); 

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'status':
        return <StatusPage soldiers={initialSoldiers} />;
      case 'gps':
        return <GPSPage />;
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
