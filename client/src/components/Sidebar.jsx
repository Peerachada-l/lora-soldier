import { Map, ClipboardList } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    // The Sidebar needs a distinct dark background
    return (
        <div className="w-20 bg-[#141626] flex flex-col items-center py-6 space-y-6 shadow-xl z-10">
            {/* GPS Page Button */}
            <button
                onClick={() => navigate("/gps")}
                // Increased padding and roundedness for a 'pill' shape on active
                className={`p-4 rounded-xl transition duration-200 
                    ${location.pathname === "/gps"
                        ? "bg-[#1f2140] text-white shadow-lg shadow-black/30"
                        : "bg-transparent text-gray-400 hover:bg-[#1f2140]"
                    }`}
            >
                <Map size={24} />
            </button>

            {/* Status Page Button */}
            <button
                onClick={() => navigate("/status")}
                className={`p-4 rounded-xl transition duration-200 
                    ${location.pathname === "/status"
                        ? "bg-[#1f2140] text-white shadow-lg shadow-black/30"
                        : "bg-transparent text-gray-400 hover:bg-[#1f2140]"
                    }`}
            >
                <ClipboardList size={24} />
            </button>
        </div>
    );
}
