import { Link, useLocation } from "react-router-dom";
import { FaUtensils, FaConciergeBell, FaClipboardList, FaSignOutAlt } from "react-icons/fa";

const menuItems = [
  { label: "Tableau de bord", icon: <FaUtensils />, path: "/dashboard/restaurant" },
  { label: "Réservations", icon: <FaClipboardList />, path: "/dashboard/restaurant/reservations" },
  { label: "Menu", icon: <FaConciergeBell />, path: "/dashboard/gerant-restaurant/menu" },
  { label: "Inventaire", icon: <FaClipboardList />, path: "/dashboard/restaurant/inventaire" },
];

export default function SidebarGerantRestaurant() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-white shadow-lg border-r border-gray-200 fixed top-0 left-0 z-50">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">Luxvia Resto</h2>

        <nav className="space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium ${
                location.pathname === item.path
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full mt-10"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Déconnexion</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
