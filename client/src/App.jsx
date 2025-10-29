import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GPSPage from "./pages/GPSPage";
import StatusPage from "./pages/StatusPage";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <div className="flex bg-black text-white h-screen">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/status" element={<StatusPage />} />
            <Route path="/gps" element={<GPSPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
