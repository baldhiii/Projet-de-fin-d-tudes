import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCog,
  FaBed,
  FaCalendarAlt,
  FaConciergeBell,
  FaMoneyBillWave,
  FaSlidersH,
  FaHotel,
} from "react-icons/fa";

const links = [
  { name: "Dashboard", path: "/dashboard/gerant", icon: <FaHome /> },
  { name: "Configuration Hôtel", path: "/gerant/configuration", icon: <FaCog /> },
  { name: "Chambres", path: "/gerant/chambres", icon: <FaBed /> },
  { name: "Réservations", path: "/gerant/reservations", icon: <FaCalendarAlt /> },
  { name: "Services", path: "/gerant/services", icon: <FaConciergeBell /> },
  { name: "Finances", path: "/gerant/finances", icon: <FaMoneyBillWave /> },
  { name: "Paramètres", path: "/gerant/parametres", icon: <FaSlidersH /> },
];

export default function SidebarGerantHotel() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-lg z-50 flex flex-col">
      {/* En-tête */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 text-indigo-700 font-bold text-2xl">
          <FaHotel className="text-3xl" />
          <span>Gerant Hôtel</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Version Personnel</p>
      </div>

      {/* Liens de navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
